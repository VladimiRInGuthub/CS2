import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SkinGallery from '../components/SkinGallery';
import DarkVeil from '../components/DarkVeil';

/**
 * Page Skins - Affiche la galerie complète des skins CS2
 */
const Skins = () => {
  const navigate = useNavigate();
  const [selectedSkin, setSelectedSkin] = useState(null);
  const [showSkinDetails, setShowSkinDetails] = useState(false);

  const handleSkinSelect = (skin) => {
    setSelectedSkin(skin);
    setShowSkinDetails(true);
  };

  const handleCloseDetails = () => {
    setShowSkinDetails(false);
    setSelectedSkin(null);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Fond animé */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <DarkVeil hueShift={120} noiseIntensity={0.03} scanlineIntensity={0.02} speed={0.15} />
      </div>

      {/* Composant SkinGallery */}
      <SkinGallery 
        onSkinSelect={handleSkinSelect}
        showPrices={true}
        showFilters={true}
      />

      {/* Modal de détails du skin */}
      {showSkinDetails && selectedSkin && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            background: 'rgba(28, 28, 42, 0.95)',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            border: '2px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            position: 'relative'
          }}>
            {/* Bouton fermer */}
            <button
              onClick={handleCloseDetails}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(255, 107, 107, 0.8)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            {/* Image du skin */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img
                src={selectedSkin.image || '/api/placeholder/300/200'}
                alt={selectedSkin.name}
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '15px',
                  border: '3px solid rgba(255,255,255,0.2)'
                }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTA1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPC9zdmc+';
                }}
              />
            </div>

            {/* Informations du skin */}
            <div style={{ color: '#fff' }}>
              <h2 style={{ 
                fontSize: '1.8rem', 
                marginBottom: '15px', 
                textAlign: 'center',
                color: '#00ff88'
              }}>
                {selectedSkin.name}
              </h2>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div>
                  <strong style={{ color: '#cfcfff' }}>Arme:</strong>
                  <div style={{ color: '#fff' }}>{selectedSkin.weapon}</div>
                </div>
                <div>
                  <strong style={{ color: '#cfcfff' }}>Rareté:</strong>
                  <div style={{ color: '#00ff88' }}>{selectedSkin.rarity}</div>
                </div>
                <div>
                  <strong style={{ color: '#cfcfff' }}>État:</strong>
                  <div style={{ color: '#fff' }}>{selectedSkin.exterior}</div>
                </div>
                <div>
                  <strong style={{ color: '#cfcfff' }}>Prix:</strong>
                  <div style={{ color: '#FFD700', fontWeight: 'bold' }}>
                    ${parseFloat(selectedSkin.price || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Badges spéciaux */}
              {(selectedSkin.statTrak || selectedSkin.souvenir) && (
                <div style={{ marginBottom: '20px' }}>
                  <strong style={{ color: '#cfcfff', display: 'block', marginBottom: '10px' }}>
                    Caractéristiques spéciales:
                  </strong>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {selectedSkin.statTrak && (
                      <span style={{
                        background: '#ff6b6b',
                        color: '#fff',
                        padding: '5px 10px',
                        borderRadius: '15px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}>
                        StatTrak™
                      </span>
                    )}
                    {selectedSkin.souvenir && (
                      <span style={{
                        background: '#ffd700',
                        color: '#000',
                        padding: '5px 10px',
                        borderRadius: '15px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}>
                        Souvenir
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Boutons d'action */}
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                justifyContent: 'center',
                marginTop: '25px'
              }}>
                <button
                  onClick={() => {
                    // Logique pour ajouter à l'inventaire ou acheter
                    console.log('Ajouter au panier:', selectedSkin);
                    alert('Fonctionnalité d\'achat à implémenter');
                  }}
                  style={{
                    background: 'linear-gradient(90deg, #00ff88, #00d4aa)',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 25px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0, 255, 136, 0.4)'
                  }}
                >
                  🛒 Ajouter au panier
                </button>
                <button
                  onClick={handleCloseDetails}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '12px 25px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        left: '20px', 
        zIndex: 10 
      }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'rgba(28, 28, 42, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '10px 20px',
            borderRadius: '25px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(28, 28, 42, 1)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(28, 28, 42, 0.9)'}
        >
          ← Retour au Dashboard
        </button>
      </div>
    </div>
  );
};

export default Skins;


