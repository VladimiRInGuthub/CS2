#!/usr/bin/env node

/**
 * Script de démarrage pour l'environnement de développement
 * Démarre le backend (port 5000) et le frontend (port 3000) simultanément
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Démarrage de SkinCase en mode développement...\n');

// Configuration des processus
const processes = [];

// Démarrer le backend
console.log('📡 Démarrage du serveur backend (port 5000)...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: process.cwd(),
  stdio: 'pipe',
  shell: true
});

backend.stdout.on('data', (data) => {
  console.log(`[BACKEND] ${data.toString().trim()}`);
});

backend.stderr.on('data', (data) => {
  console.error(`[BACKEND ERROR] ${data.toString().trim()}`);
});

processes.push(backend);

// Attendre un peu avant de démarrer le frontend
setTimeout(() => {
  console.log('🎨 Démarrage du serveur frontend (port 3000)...');
  const frontend = spawn('npm', ['start'], {
    cwd: path.join(process.cwd(), 'cs2-frontend'),
    stdio: 'pipe',
    shell: true
  });

  frontend.stdout.on('data', (data) => {
    console.log(`[FRONTEND] ${data.toString().trim()}`);
  });

  frontend.stderr.on('data', (data) => {
    console.error(`[FRONTEND ERROR] ${data.toString().trim()}`);
  });

  processes.push(frontend);
}, 2000);

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt des serveurs...');
  processes.forEach(proc => {
    proc.kill('SIGTERM');
  });
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt des serveurs...');
  processes.forEach(proc => {
    proc.kill('SIGTERM');
  });
  process.exit(0);
});

console.log('\n✅ Serveurs en cours de démarrage...');
console.log('📱 Frontend: http://localhost:3000');
console.log('🔧 Backend: http://localhost:5000');
console.log('🔐 Login: http://localhost:3000/login');
console.log('\n💡 Appuyez sur Ctrl+C pour arrêter les serveurs\n');
