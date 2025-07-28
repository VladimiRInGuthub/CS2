import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GlassSurface from '../components/GlassSurface';
import Aurora from '../components/Aurora';
import axios from 'axios';

const getRarityColor = (rarity) => {
  const colors = {
    'Common': '#666666',
    'Uncommon': '#4CAF50',
    'Rare': '#2196F3',
    'Epic': '#9C27B0',
    'Legendary': '#FF9800'
  };
  return colors[rarity] || '#666666';
};

const Home = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/cases');
        setCases(res.data);
      } catch (err) {
        setCases([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  return (
    <div className="home-page">
      {/* Aurora WebGL Background */}
      <Aurora
        colorStops={["#7866FF", "#5227FF", "#401C5B"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <GlassSurface 
            variant="tag" 
            className="hero-tag"
            brightness="60%"
            saturation="1.1"
            redOffset="5px"
            greenOffset="15px"
            blueOffset="25px"
          >
            <span className="tag-icon">✨</span>
            <span>Super Shiny</span>
          </GlassSurface>
          
          <h1 className="hero-title">
            The summer of glass,<br />
            thanks a lot Apple!
          </h1>
          
          <div className="hero-actions">
            <GlassSurface 
              variant="button" 
              className="hero-btn primary"
              brightness="70%"
              saturation="1.2"
              scale="1.05"
            >
              Get Started
            </GlassSurface>
            <GlassSurface 
              variant="button" 
              className="hero-btn secondary"
              brightness="40%"
              saturation="0.9"
              redOffset="10px"
              greenOffset="20px"
              blueOffset="30px"
            >
              Learn More
            </GlassSurface>
          </div>


        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <GlassSurface 
              variant="card" 
              className="stat-card"
              brightness="55%"
              saturation="1.05"
              redOffset="0px"
              greenOffset="10px"
              blueOffset="20px"
            >
              <div className="stat-value">6,687</div>
              <div className="stat-label">Caisses ouvertes</div>
            </GlassSurface>
            <GlassSurface 
              variant="card" 
              className="stat-card"
              brightness="55%"
              saturation="1.05"
              redOffset="5px"
              greenOffset="15px"
              blueOffset="25px"
            >
              <div className="stat-value">307</div>
              <div className="stat-label">Skins gagnés</div>
            </GlassSurface>
            <GlassSurface 
              variant="card" 
              className="stat-card"
              brightness="55%"
              saturation="1.05"
              redOffset="10px"
              greenOffset="20px"
              blueOffset="30px"
            >
              <div className="stat-value">46</div>
              <div className="stat-label">Niveau Elite</div>
            </GlassSurface>
            <GlassSurface 
              variant="card" 
              className="stat-card"
              brightness="55%"
              saturation="1.05"
              redOffset="15px"
              greenOffset="25px"
              blueOffset="35px"
            >
              <div className="stat-value">231</div>
              <div className="stat-label">Score</div>
            </GlassSurface>
          </div>
        </div>
      </section>

      {/* Cases Section */}
      <section className="cases-section">
        <div className="container">
          <h2 className="section-title">Ouvre ta première caisse</h2>
          
          {loading ? (
            <GlassSurface 
              variant="card" 
              className="loading-card"
              brightness="50%"
              saturation="1"
            >
              <div className="loading-spinner"></div>
              <p>Chargement des cases...</p>
            </GlassSurface>
          ) : (
            <div className="cases-grid">
              {cases.map((caseItem, index) => (
                <GlassSurface 
                  key={caseItem._id} 
                  variant="card" 
                  className="case-card"
                  brightness="50%"
                  saturation="1"
                  redOffset={`${index * 5}px`}
                  greenOffset={`${10 + index * 5}px`}
                  blueOffset={`${20 + index * 5}px`}
                  rotateX="2deg"
                  rotateY="1deg"
                  translateZ="5px"
                >
                  <div className="case-image">
                    <img
                      src={caseItem.image}
                      alt={caseItem.name}
                      style={{ borderColor: getRarityColor(caseItem.rarity) }}
                    />
                  </div>
                  
                  <div className="case-content">
                    <h3 className="case-title">{caseItem.name}</h3>
                    <p className="case-description">{caseItem.description}</p>
                    
                    <div className="case-meta">
                      <span 
                        className="case-rarity"
                        style={{ color: getRarityColor(caseItem.rarity) }}
                      >
                        {caseItem.rarity}
                      </span>
                      <span className="case-price">💰 {caseItem.price}</span>
                    </div>
                    
                    <Link to="/login" className="case-btn">
                      Se connecter pour ouvrir
                    </Link>
                  </div>
                </GlassSurface>
              ))}
            </div>
          )}
        </div>
      </section>



      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <Link to="/login">
            <GlassSurface 
              variant="button" 
              className="cta-btn"
              brightness="60%"
              saturation="1.1"
              scale="1.03"
              redOffset="20px"
              greenOffset="30px"
              blueOffset="40px"
            >
              🚀 Commencer l'aventure
            </GlassSurface>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 