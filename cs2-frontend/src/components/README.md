# Composant DarkVeil

Un fond animé WebGL avec des effets visuels pour votre application React.

## Utilisation simple

### Option 1: Utiliser directement DarkVeil

```jsx
import DarkVeil from './components/DarkVeil';

function MyPage() {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <DarkVeil />
      {/* Votre contenu ici */}
    </div>
  );
}
```

### Option 2: Utiliser BackgroundWrapper (Recommandé)

```jsx
import BackgroundWrapper from './components/BackgroundWrapper';

function MyPage() {
  return (
    <BackgroundWrapper 
      hueShift={30}
      speed={0.5}
      warpAmount={0.2}
    >
      {/* Votre contenu de page ici */}
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Ma Page</h1>
        <p>Contenu avec fond animé</p>
      </div>
    </BackgroundWrapper>
  );
}
```

## Paramètres disponibles

- `hueShift` (0-360): Décalage de teinte des couleurs
- `noiseIntensity` (0-1): Intensité du bruit
- `scanlineIntensity` (0-1): Intensité des lignes de balayage
- `speed` (0-2): Vitesse de l'animation
- `scanlineFrequency` (0-0.1): Fréquence des lignes de balayage
- `warpAmount` (0-1): Intensité de la déformation
- `resolutionScale` (0.5-2): Échelle de résolution

## Exemples de configurations

### Fond subtil
```jsx
<DarkVeil 
  hueShift={0}
  noiseIntensity={0.02}
  scanlineIntensity={0.01}
  speed={0.1}
  warpAmount={0.05}
/>
```

### Effet cyberpunk
```jsx
<DarkVeil 
  hueShift={120}
  noiseIntensity={0.15}
  scanlineIntensity={0.1}
  speed={0.5}
  scanlineFrequency={0.02}
  warpAmount={0.3}
/>
```

### Effet gaming
```jsx
<DarkVeil 
  hueShift={30}
  noiseIntensity={0.1}
  scanlineIntensity={0.05}
  speed={0.3}
  warpAmount={0.2}
/>
```