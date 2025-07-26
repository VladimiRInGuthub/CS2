import React from 'react';
import DarkVeil from './DarkVeil';

const BackgroundWrapper = ({ 
  children, 
  hueShift = 0,
  noiseIntensity = 0.05,
  scanlineIntensity = 0.03,
  speed = 0.3,
  scanlineFrequency = 0.01,
  warpAmount = 0.1,
  overlay = true,
  overlayOpacity = 0.8
}) => {
  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%'
    }}>
      {/* Fond animé DarkVeil */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1 
      }}>
        <DarkVeil 
          hueShift={hueShift}
          noiseIntensity={noiseIntensity}
          scanlineIntensity={scanlineIntensity}
          speed={speed}
          scanlineFrequency={scanlineFrequency}
          warpAmount={warpAmount}
        />
      </div>

      {/* Contenu avec overlay optionnel */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        minHeight: '100vh',
        backgroundColor: overlay ? `rgba(0, 0, 0, ${overlayOpacity * 0.3})` : 'transparent'
      }}>
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;