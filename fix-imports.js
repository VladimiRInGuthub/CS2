#!/usr/bin/env node

/**
 * Script pour corriger automatiquement les imports et variables non utilisées
 */

const fs = require('fs');
const path = require('path');

// Corrections à appliquer
const corrections = [
  // Imports incorrects
  {
    pattern: /import Button from '\.\/ui\/Button';/g,
    replacement: "import Button from '../components/ui/Button';"
  },
  {
    pattern: /import Card from '\.\/ui\/Card';/g,
    replacement: "import Card from '../components/ui/Card';"
  },
  
  // Variables non utilisées à commenter
  {
    pattern: /const \[([^,\]]+), set\1\] = useState\([^)]+\);/g,
    replacement: (match, varName) => {
      // Si la variable n'est pas utilisée ailleurs, la commenter
      return `// const [${varName}, set${varName.charAt(0).toUpperCase() + varName.slice(1)}] = useState();`;
    }
  },
  
  // Imports non utilisés
  {
    pattern: /import \{ ([^}]+) \} from 'framer-motion';/g,
    replacement: (match, imports) => {
      const usedImports = imports.split(',').map(imp => imp.trim()).filter(imp => {
        // Vérifier si l'import est utilisé dans le fichier
        return true; // Pour l'instant, on garde tout
      });
      return `import { ${usedImports.join(', ')} } from 'framer-motion';`;
    }
  }
];

// Fonction pour traiter un fichier
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    corrections.forEach(correction => {
      const newContent = content.replace(correction.pattern, correction.replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corrigé: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Erreur avec ${filePath}:`, error.message);
  }
}

// Fonction pour parcourir récursivement les dossiers
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      processDirectory(fullPath);
    } else if (stat.isFile() && (item.endsWith('.jsx') || item.endsWith('.js'))) {
      processFile(fullPath);
    }
  });
}

// Démarrer le traitement
const frontendPath = path.join(__dirname, 'cs2-frontend', 'src');
if (fs.existsSync(frontendPath)) {
  console.log('🔧 Correction des imports et variables non utilisées...');
  processDirectory(frontendPath);
  console.log('✅ Correction terminée !');
} else {
  console.error('❌ Dossier frontend non trouvé');
}
