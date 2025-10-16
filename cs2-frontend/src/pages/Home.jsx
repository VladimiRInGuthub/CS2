import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: '🎮',
      title: t('home.features.realSkins.title'),
      description: t('home.features.realSkins.description')
    },
    {
      icon: '🖥️',
      title: t('home.features.privateServers.title'),
      description: t('home.features.privateServers.description')
    },
    {
      icon: '🎨',
      title: t('home.features.skinchanger.title'),
      description: t('home.features.skinchanger.description')
    },
    {
      icon: '💰',
      title: t('home.features.virtualCurrency.title'),
      description: t('home.features.virtualCurrency.description')
    }
  ];

  const testimonials = [
    {
      name: 'Alex',
      role: t('home.testimonials.alex.role'),
      content: t('home.testimonials.alex.content'),
      avatar: '👨‍💻'
    },
    {
      name: 'Sarah',
      role: t('home.testimonials.sarah.role'),
      content: t('home.testimonials.sarah.content'),
      avatar: '👩‍🎮'
    },
    {
      name: 'Mike',
      role: t('home.testimonials.mike.role'),
      content: t('home.testimonials.mike.content'),
      avatar: '👨‍🎯'
    }
  ];

  const stats = [
    { number: '10,000+', label: t('home.stats.users') },
    { number: '50,000+', label: t('home.stats.casesOpened') },
    { number: '1,000+', label: t('home.stats.servers') },
    { number: '99.9%', label: t('home.stats.uptime') }
  ];

  // useEffect(() => {
  //   setIsVisible(true);
  //   
  //   // Auto-rotate slides
  //   const interval = setInterval(() => {
  //     setCurrentSlide((prev) => (prev + 1) % features.length);
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [features.length]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="hero-title">
              {t('home.hero.title')}
              <span className="gradient-text"> {t('home.hero.highlight')}</span>
            </h1>
            <p className="hero-description">
              {t('home.hero.description')}
            </p>
            <div className="hero-actions">
              <Link to="/cases">
                <Button size="large" variant="primary">
                  {t('home.hero.cta.primary')}
                </Button>
              </Link>
              <Link to="/servers">
                <Button size="large" variant="secondary">
                  {t('home.hero.cta.secondary')}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="case-preview">
              <div className="case-image">
                <div className="case-content">
                  <div className="case-icon">📦</div>
                  <div className="case-name">CS2 Case</div>
                  <div className="case-price">100 Xcoins</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">{t('home.features.title')}</h2>
            <p className="section-description">{t('home.features.description')}</p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card variant="glass" hoverable className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">{t('home.howItWorks.title')}</h2>
            <p className="section-description">{t('home.howItWorks.description')}</p>
          </motion.div>

          <div className="steps-container">
            {[1, 2, 3, 4].map((step, index) => (
              <motion.div
                key={step}
                className="step-item"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="step-number">{step}</div>
                <div className="step-content">
                  <h3>{t(`home.howItWorks.step${step}.title`)}</h3>
                  <p>{t(`home.howItWorks.step${step}.description`)}</p>
                </div>
                {index < 3 && <div className="step-connector" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <motion.div
            className="stats-grid"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">{t('home.testimonials.title')}</h2>
            <p className="section-description">{t('home.testimonials.description')}</p>
          </motion.div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card variant="glass" hoverable className="testimonial-card">
                  <div className="testimonial-content">
                    <p>"{testimonial.content}"</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">{testimonial.avatar}</div>
                    <div className="author-info">
                      <div className="author-name">{testimonial.name}</div>
                      <div className="author-role">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-title">{t('home.cta.title')}</h2>
            <p className="cta-description">{t('home.cta.description')}</p>
            <div className="cta-actions">
              <Link to="/register">
                <Button size="large" variant="primary">
                  {t('home.cta.getStarted')}
                </Button>
              </Link>
              <Link to="/login">
                <Button size="large" variant="secondary">
                  {t('home.cta.login')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;