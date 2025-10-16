const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;

class StripeService {
  constructor() {
    this.stripe = stripe;
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  }

  // Packages de Xcoins disponibles
  getXcoinPackages() {
    return [
      {
        id: 'starter',
        name: 'Starter Pack',
        xcoins: 100,
        price: 0.99,
        currency: 'eur',
        description: 'Parfait pour débuter',
        bonus: 0,
        popular: false
      },
      {
        id: 'small',
        name: 'Small Pack',
        xcoins: 500,
        price: 4.99,
        currency: 'eur',
        description: 'Idéal pour quelques cases',
        bonus: 0,
        popular: false
      },
      {
        id: 'medium',
        name: 'Medium Pack',
        xcoins: 1000,
        price: 9.99,
        currency: 'eur',
        description: 'Le plus populaire',
        bonus: 50,
        popular: true
      },
      {
        id: 'large',
        name: 'Large Pack',
        xcoins: 2500,
        price: 19.99,
        currency: 'eur',
        description: 'Pour les vrais fans',
        bonus: 200,
        popular: false
      },
      {
        id: 'mega',
        name: 'Mega Pack',
        xcoins: 5000,
        price: 39.99,
        currency: 'eur',
        description: 'Le meilleur rapport qualité/prix',
        bonus: 500,
        popular: false
      },
      {
        id: 'ultimate',
        name: 'Ultimate Pack',
        xcoins: 10000,
        price: 79.99,
        currency: 'eur',
        description: 'Pour les collectionneurs',
        bonus: 1500,
        popular: false
      }
    ];
  }

  // Créer une session de paiement Stripe
  async createCheckoutSession(userId, packageId, successUrl, cancelUrl) {
    try {
      if (!this.stripe) {
        throw new Error('Stripe non configuré');
      }
      
      const packages = this.getXcoinPackages();
      const selectedPackage = packages.find(pkg => pkg.id === packageId);
      
      if (!selectedPackage) {
        throw new Error('Package non trouvé');
      }

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: selectedPackage.currency,
              product_data: {
                name: `${selectedPackage.name} - ${selectedPackage.xcoins} Xcoins`,
                description: selectedPackage.description,
                images: ['https://skincase.gg/images/xcoins-icon.png']
              },
              unit_amount: Math.round(selectedPackage.price * 100), // Convertir en centimes
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId: userId.toString(),
          packageId: packageId,
          xcoins: selectedPackage.xcoins.toString(),
          bonus: selectedPackage.bonus.toString()
        },
        customer_email: undefined, // Sera rempli automatiquement
      });

      return session;
    } catch (error) {
      console.error('Erreur création session Stripe:', error);
      throw error;
    }
  }

  // Créer un PaymentIntent pour les paiements directs
  async createPaymentIntent(userId, packageId) {
    try {
      const packages = this.getXcoinPackages();
      const selectedPackage = packages.find(pkg => pkg.id === packageId);
      
      if (!selectedPackage) {
        throw new Error('Package non trouvé');
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(selectedPackage.price * 100),
        currency: selectedPackage.currency,
        metadata: {
          userId: userId.toString(),
          packageId: packageId,
          xcoins: selectedPackage.xcoins.toString(),
          bonus: selectedPackage.bonus.toString()
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('Erreur création PaymentIntent:', error);
      throw error;
    }
  }

  // Récupérer une session de paiement
  async retrieveSession(sessionId) {
    try {
      return await this.stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      console.error('Erreur récupération session:', error);
      throw error;
    }
  }

  // Récupérer un PaymentIntent
  async retrievePaymentIntent(paymentIntentId) {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error('Erreur récupération PaymentIntent:', error);
      throw error;
    }
  }

  // Vérifier le webhook Stripe
  verifyWebhookSignature(payload, signature) {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret
      );
    } catch (error) {
      console.error('Erreur vérification webhook:', error);
      throw error;
    }
  }

  // Traiter le paiement réussi
  async handleSuccessfulPayment(session) {
    try {
      const { userId, packageId, xcoins, bonus } = session.metadata;
      
      // Ici vous pouvez ajouter la logique pour créditer les Xcoins
      // Cette fonction sera appelée depuis le webhook handler
      
      return {
        userId,
        packageId,
        xcoins: parseInt(xcoins),
        bonus: parseInt(bonus),
        totalXcoins: parseInt(xcoins) + parseInt(bonus),
        sessionId: session.id,
        paymentIntentId: session.payment_intent
      };
    } catch (error) {
      console.error('Erreur traitement paiement:', error);
      throw error;
    }
  }

  // Créer un remboursement
  async createRefund(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    try {
      const refundData = {
        payment_intent: paymentIntentId,
        reason: reason
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100);
      }

      return await this.stripe.refunds.create(refundData);
    } catch (error) {
      console.error('Erreur création remboursement:', error);
      throw error;
    }
  }

  // Obtenir les détails d'un remboursement
  async retrieveRefund(refundId) {
    try {
      return await this.stripe.refunds.retrieve(refundId);
    } catch (error) {
      console.error('Erreur récupération remboursement:', error);
      throw error;
    }
  }

  // Créer un client Stripe
  async createCustomer(email, name) {
    try {
      return await this.stripe.customers.create({
        email: email,
        name: name
      });
    } catch (error) {
      console.error('Erreur création client:', error);
      throw error;
    }
  }

  // Obtenir les méthodes de paiement d'un client
  async getCustomerPaymentMethods(customerId) {
    try {
      return await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
    } catch (error) {
      console.error('Erreur récupération méthodes de paiement:', error);
      throw error;
    }
  }

  // Créer un setup intent pour sauvegarder une carte
  async createSetupIntent(customerId) {
    try {
      return await this.stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
      });
    } catch (error) {
      console.error('Erreur création SetupIntent:', error);
      throw error;
    }
  }
}

module.exports = new StripeService();
