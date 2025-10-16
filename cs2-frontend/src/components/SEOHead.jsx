import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SEOHead = ({ 
  title, 
  description, 
  keywords = [], 
  image, 
  url, 
  type = 'website',
  author = 'SkinCase Team',
  publishedTime,
  modifiedTime,
  section,
  tags = []
}) => {
  const { t, i18n } = useTranslation();
  
  // Titre par défaut
  const defaultTitle = t('seo.defaultTitle', 'SkinCase - CS2 Case Opening & Servers');
  const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  
  // Description par défaut
  const defaultDescription = t('seo.defaultDescription', 'Ouvrez des cases CS2, créez des serveurs privés et gérez votre inventaire de skins. La meilleure expérience de case opening pour Counter-Strike 2.');
  const pageDescription = description || defaultDescription;
  
  // URL canonique
  const canonicalUrl = url || window.location.href;
  
  // Image par défaut
  const defaultImage = image || `${window.location.origin}/logo512.png`;
  
  // Mots-clés par défaut
  const defaultKeywords = [
    'CS2', 'Counter-Strike 2', 'case opening', 'skins', 'serveurs privés',
    'inventaire', 'skinchanger', 'battlepass', 'premium', 'gaming'
  ];
  const pageKeywords = [...defaultKeywords, ...keywords].join(', ');

  return (
    <Helmet>
      {/* Meta tags de base */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content={i18n.language} />
      <meta name="revisit-after" content="7 days" />
      
      {/* URL canonique */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="SkinCase" />
      <meta property="og:locale" content={i18n.language === 'fr' ? 'fr_FR' : 'en_US'} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={defaultImage} />
      <meta name="twitter:site" content="@skincase" />
      <meta name="twitter:creator" content="@skincase" />
      
      {/* Article meta tags (si type = article) */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Meta tags pour mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      <meta name="theme-color" content="#a259ff" />
      <meta name="msapplication-TileColor" content="#a259ff" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="SkinCase" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/logo192.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Preconnect pour les domaines externes */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://steamcommunity-a.akamaihd.net" />
      <link rel="preconnect" href="https://ui-avatars.com" />
      
      {/* DNS prefetch */}
      <link rel="dns-prefetch" href="https://api.stripe.com" />
      <link rel="dns-prefetch" href="https://csgoskins.gg" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "SkinCase",
          "description": pageDescription,
          "url": canonicalUrl,
          "applicationCategory": "GameApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
          },
          "author": {
            "@type": "Organization",
            "name": "SkinCase Team"
          },
          "publisher": {
            "@type": "Organization",
            "name": "SkinCase",
            "logo": {
              "@type": "ImageObject",
              "url": `${window.location.origin}/logo512.png`
            }
          },
          "screenshot": `${window.location.origin}/screenshot1.png`,
          "softwareVersion": "1.0.0",
          "datePublished": "2024-01-01",
          "dateModified": new Date().toISOString(),
          "inLanguage": i18n.language,
          "isAccessibleForFree": true,
          "gameItem": [
            {
              "@type": "VideoGame",
              "name": "Counter-Strike 2",
              "description": "Case opening et gestion de serveurs pour CS2"
            }
          ]
        })}
      </script>
    </Helmet>
  );
};

// Composant pour les pages spécifiques
export const PageSEO = ({ page, data = {} }) => {
  const { t } = useTranslation();
  
  const seoConfig = {
    home: {
      title: t('seo.home.title', 'Accueil'),
      description: t('seo.home.description', 'Découvrez SkinCase, la meilleure plateforme pour ouvrir des cases CS2 et créer des serveurs privés. Rejoignez des milliers de joueurs !'),
      keywords: ['accueil', 'découverte', 'présentation', 'CS2', 'case opening']
    },
    cases: {
      title: t('seo.cases.title', 'Cases CS2'),
      description: t('seo.cases.description', 'Ouvrez des cases CS2 authentiques avec des skins rares. Probabilités transparentes et animations immersives.'),
      keywords: ['cases', 'ouverture', 'skins', 'probabilités', 'animations']
    },
    inventory: {
      title: t('seo.inventory.title', 'Mon Inventaire'),
      description: t('seo.inventory.description', 'Gérez votre collection de skins CS2. Filtrez, triez et organisez vos skins préférés.'),
      keywords: ['inventaire', 'collection', 'skins', 'organisation', 'filtres']
    },
    servers: {
      title: t('seo.servers.title', 'Serveurs CS2'),
      description: t('seo.servers.description', 'Créez et rejoignez des serveurs CS2 privés. Deathmatch, Retake, Surf et bien plus !'),
      keywords: ['serveurs', 'privés', 'deathmatch', 'retake', 'surf', 'création']
    },
    battlepass: {
      title: t('seo.battlepass.title', 'Battlepass'),
      description: t('seo.battlepass.description', 'Progressez dans le battlepass et débloquez des récompenses exclusives. Missions quotidiennes et hebdomadaires.'),
      keywords: ['battlepass', 'progression', 'missions', 'récompenses', 'niveaux']
    },
    premium: {
      title: t('seo.premium.title', 'Premium'),
      description: t('seo.premium.description', 'Débloquez tous les avantages premium : bonus Xcoins, cases exclusives, support prioritaire et bien plus !'),
      keywords: ['premium', 'avantages', 'bonus', 'exclusif', 'support']
    }
  };

  const config = seoConfig[page] || seoConfig.home;
  
  return (
    <SEOHead
      title={config.title}
      description={config.description}
      keywords={config.keywords}
      {...data}
    />
  );
};

export default SEOHead;
