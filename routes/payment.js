const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const stripeService = require('../utils/stripe');
const config = require('../config/config');

// Middleware pour vérifier l'authentification
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Non authentifié' });
};

// ===========================================
// PACKAGES DE XCOINS
// ===========================================

// Obtenir les packages disponibles
router.get('/packages', (req, res) => {
  try {
    const packages = stripeService.getXcoinPackages();
    res.json({ packages });
  } catch (error) {
    console.error('Erreur get packages:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// CHECKOUT STRIPE
// ===========================================

// Créer une session de checkout
router.post('/create-checkout-session', ensureAuthenticated, [
  body('packageId')
    .notEmpty()
    .withMessage('ID du package requis'),
  body('successUrl')
    .isURL()
    .withMessage('URL de succès invalide'),
  body('cancelUrl')
    .isURL()
    .withMessage('URL d\'annulation invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Données invalides', 
        details: errors.array() 
      });
    }

    const { packageId, successUrl, cancelUrl } = req.body;

    // Vérifier que le package existe
    const packages = stripeService.getXcoinPackages();
    const selectedPackage = packages.find(pkg => pkg.id === packageId);
    if (!selectedPackage) {
      return res.status(400).json({ error: 'Package non trouvé' });
    }

    // Créer la session Stripe
    const session = await stripeService.createCheckoutSession(
      req.user._id,
      packageId,
      successUrl,
      cancelUrl
    );

    // Créer une transaction en attente
    const transaction = new Transaction({
      user: req.user._id,
      type: 'purchase',
      amount: selectedPackage.xcoins + selectedPackage.bonus,
      currency: 'xcoins',
      description: `Achat ${selectedPackage.name}`,
      status: 'pending',
      paymentMethod: 'stripe',
      paymentId: session.id,
      stripeSessionId: session.id,
      metadata: {
        packageId: packageId,
        packageName: selectedPackage.name,
        baseXcoins: selectedPackage.xcoins,
        bonusXcoins: selectedPackage.bonus,
        price: selectedPackage.price,
        currency: selectedPackage.currency
      }
    });

    await transaction.save();

    res.json({
      sessionId: session.id,
      url: session.url,
      transactionId: transaction._id
    });

  } catch (error) {
    console.error('Erreur create checkout session:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// PAYMENT INTENT (POUR PAIEMENTS DIRECTS)
// ===========================================

// Créer un PaymentIntent
router.post('/create-payment-intent', ensureAuthenticated, [
  body('packageId')
    .notEmpty()
    .withMessage('ID du package requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Données invalides', 
        details: errors.array() 
      });
    }

    const { packageId } = req.body;

    // Vérifier que le package existe
    const packages = stripeService.getXcoinPackages();
    const selectedPackage = packages.find(pkg => pkg.id === packageId);
    if (!selectedPackage) {
      return res.status(400).json({ error: 'Package non trouvé' });
    }

    // Créer le PaymentIntent
    const paymentIntent = await stripeService.createPaymentIntent(
      req.user._id,
      packageId
    );

    // Créer une transaction en attente
    const transaction = new Transaction({
      user: req.user._id,
      type: 'purchase',
      amount: selectedPackage.xcoins + selectedPackage.bonus,
      currency: 'xcoins',
      description: `Achat ${selectedPackage.name}`,
      status: 'pending',
      paymentMethod: 'stripe',
      paymentId: paymentIntent.id,
      stripePaymentIntentId: paymentIntent.id,
      metadata: {
        packageId: packageId,
        packageName: selectedPackage.name,
        baseXcoins: selectedPackage.xcoins,
        bonusXcoins: selectedPackage.bonus,
        price: selectedPackage.price,
        currency: selectedPackage.currency
      }
    });

    await transaction.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      transactionId: transaction._id
    });

  } catch (error) {
    console.error('Erreur create payment intent:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// WEBHOOK STRIPE
// ===========================================

// Webhook pour traiter les événements Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripeService.verifyWebhookSignature(req.body, sig);
    } catch (err) {
      console.error('Erreur signature webhook:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Traiter les événements
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      
      case 'charge.dispute.created':
        await handleChargeDisputeCreated(event.data.object);
        break;
      
      default:
        console.log(`Événement non géré: ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Erreur webhook:', error);
    res.status(500).json({ error: 'Erreur traitement webhook' });
  }
});

// ===========================================
// HANDLERS WEBHOOK
// ===========================================

async function handleCheckoutSessionCompleted(session) {
  try {
    console.log('✅ Checkout session completed:', session.id);

    // Trouver la transaction
    const transaction = await Transaction.findOne({ 
      stripeSessionId: session.id 
    });

    if (!transaction) {
      console.error('Transaction non trouvée pour session:', session.id);
      return;
    }

    // Marquer la transaction comme terminée
    transaction.status = 'completed';
    transaction.processedAt = new Date();
    await transaction.save();

    // Créditer les Xcoins à l'utilisateur
    const user = await User.findById(transaction.user);
    if (user) {
      user.xcoins += transaction.amount;
      user.stats.totalSpent += transaction.metadata.get('price');
      await user.save();

      console.log(`✅ ${transaction.amount} Xcoins crédités à ${user.username}`);
    }

  } catch (error) {
    console.error('Erreur handleCheckoutSessionCompleted:', error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    console.log('✅ Payment intent succeeded:', paymentIntent.id);

    // Trouver la transaction
    const transaction = await Transaction.findOne({ 
      stripePaymentIntentId: paymentIntent.id 
    });

    if (!transaction) {
      console.error('Transaction non trouvée pour payment intent:', paymentIntent.id);
      return;
    }

    // Marquer la transaction comme terminée
    transaction.status = 'completed';
    transaction.processedAt = new Date();
    await transaction.save();

    // Créditer les Xcoins à l'utilisateur
    const user = await User.findById(transaction.user);
    if (user) {
      user.xcoins += transaction.amount;
      user.stats.totalSpent += transaction.metadata.get('price');
      await user.save();

      console.log(`✅ ${transaction.amount} Xcoins crédités à ${user.username}`);
    }

  } catch (error) {
    console.error('Erreur handlePaymentIntentSucceeded:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent) {
  try {
    console.log('❌ Payment intent failed:', paymentIntent.id);

    // Trouver la transaction
    const transaction = await Transaction.findOne({ 
      stripePaymentIntentId: paymentIntent.id 
    });

    if (transaction) {
      transaction.status = 'failed';
      transaction.metadata.set('failure_reason', paymentIntent.last_payment_error?.message);
      await transaction.save();
    }

  } catch (error) {
    console.error('Erreur handlePaymentIntentFailed:', error);
  }
}

async function handleChargeDisputeCreated(dispute) {
  try {
    console.log('⚠️ Charge dispute created:', dispute.id);

    // Trouver la transaction liée
    const transaction = await Transaction.findOne({ 
      paymentId: dispute.charge 
    });

    if (transaction) {
      transaction.metadata.set('dispute_id', dispute.id);
      transaction.metadata.set('dispute_reason', dispute.reason);
      await transaction.save();
    }

  } catch (error) {
    console.error('Erreur handleChargeDisputeCreated:', error);
  }
}

// ===========================================
// REMBOURSEMENTS
// ===========================================

// Créer un remboursement (admin seulement)
router.post('/refund', ensureAuthenticated, [
  body('transactionId')
    .notEmpty()
    .withMessage('ID de transaction requis'),
  body('reason')
    .optional()
    .trim()
], async (req, res) => {
  try {
    // Vérifier que l'utilisateur est admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Accès refusé - Admin requis' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Données invalides', 
        details: errors.array() 
      });
    }

    const { transactionId, reason = 'requested_by_customer' } = req.body;

    // Trouver la transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction non trouvée' });
    }

    if (transaction.status !== 'completed') {
      return res.status(400).json({ error: 'Transaction non terminée' });
    }

    // Créer le remboursement Stripe
    const refund = await stripeService.createRefund(
      transaction.stripePaymentIntentId || transaction.paymentId,
      transaction.metadata.get('price'),
      reason
    );

    // Mettre à jour la transaction
    transaction.status = 'refunded';
    transaction.refundedAt = new Date();
    transaction.refundReason = reason;
    transaction.metadata.set('refund_id', refund.id);
    await transaction.save();

    // Débiter les Xcoins de l'utilisateur
    const user = await User.findById(transaction.user);
    if (user) {
      user.xcoins = Math.max(0, user.xcoins - transaction.amount);
      await user.save();
    }

    res.json({
      message: 'Remboursement effectué avec succès',
      refundId: refund.id,
      refundAmount: refund.amount / 100
    });

  } catch (error) {
    console.error('Erreur refund:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// STATUT DES PAIEMENTS
// ===========================================

// Vérifier le statut d'une session
router.get('/session-status/:sessionId', ensureAuthenticated, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripeService.retrieveSession(sessionId);
    const transaction = await Transaction.findOne({ stripeSessionId: sessionId });

    res.json({
      sessionStatus: session.payment_status,
      transactionStatus: transaction?.status,
      sessionId: session.id,
      transactionId: transaction?._id
    });

  } catch (error) {
    console.error('Erreur session status:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Vérifier le statut d'un PaymentIntent
router.get('/payment-intent-status/:paymentIntentId', ensureAuthenticated, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripeService.retrievePaymentIntent(paymentIntentId);
    const transaction = await Transaction.findOne({ stripePaymentIntentId: paymentIntentId });

    res.json({
      paymentIntentStatus: paymentIntent.status,
      transactionStatus: transaction?.status,
      paymentIntentId: paymentIntent.id,
      transactionId: transaction?._id
    });

  } catch (error) {
    console.error('Erreur payment intent status:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
