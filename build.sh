#!/bin/bash

# Script de build pour la production SkinCase
set -e

echo "🏗️ Build de production SkinCase en cours..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Vérifier les prérequis
check_prerequisites() {
    print_step "Vérification des prérequis..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé"
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        print_error "npm n'est pas installé"
        exit 1
    fi
    
    print_message "Tous les prérequis sont installés"
}

# Nettoyer les builds précédents
clean_builds() {
    print_step "Nettoyage des builds précédents..."
    
    # Nettoyer le build frontend
    if [ -d "cs2-frontend/build" ]; then
        rm -rf cs2-frontend/build
        print_message "Build frontend nettoyé"
    fi
    
    # Nettoyer les node_modules si demandé
    if [ "$1" = "--clean-deps" ]; then
        print_warning "Nettoyage des dépendances..."
        rm -rf node_modules
        rm -rf cs2-frontend/node_modules
        print_message "Dépendances nettoyées"
    fi
}

# Installer les dépendances
install_dependencies() {
    print_step "Installation des dépendances..."
    
    # Backend
    print_message "Installation des dépendances backend..."
    npm ci --only=production
    
    # Frontend
    print_message "Installation des dépendances frontend..."
    cd cs2-frontend
    npm ci --only=production
    cd ..
    
    print_message "Dépendances installées"
}

# Build du frontend
build_frontend() {
    print_step "Build du frontend..."
    
    cd cs2-frontend
    
    # Vérifier les variables d'environnement
    if [ -z "$REACT_APP_API_URL" ]; then
        print_warning "REACT_APP_API_URL non définie, utilisation de la valeur par défaut"
        export REACT_APP_API_URL="https://api.skincase.com"
    fi
    
    # Build de production
    print_message "Build React en cours..."
    npm run build
    
    # Vérifier que le build a réussi
    if [ ! -d "build" ]; then
        print_error "Échec du build frontend"
        exit 1
    fi
    
    # Optimiser les assets
    print_message "Optimisation des assets..."
    
    # Compresser les fichiers CSS et JS
    find build/static/css -name "*.css" -exec gzip -9 -c {} > {}.gz \;
    find build/static/js -name "*.js" -exec gzip -9 -c {} > {}.gz \;
    
    # Créer les fichiers de preload
    create_preload_files
    
    cd ..
    
    print_message "Build frontend terminé"
}

# Créer les fichiers de preload
create_preload_files() {
    print_message "Création des fichiers de preload..."
    
    # Créer un fichier de preload pour les assets critiques
    cat > build/preload-assets.html << EOF
<link rel="preload" href="/static/css/main.css" as="style">
<link rel="preload" href="/static/js/main.js" as="script">
<link rel="preload" href="/static/js/runtime.js" as="script">
EOF
}

# Build du backend
build_backend() {
    print_step "Build du backend..."
    
    # Vérifier les variables d'environnement critiques
    if [ -z "$MONGODB_URI" ]; then
        print_warning "MONGODB_URI non définie"
    fi
    
    if [ -z "$SESSION_SECRET" ]; then
        print_warning "SESSION_SECRET non définie"
    fi
    
    # Créer les répertoires nécessaires
    mkdir -p logs uploads
    
    # Vérifier la syntaxe du code
    print_message "Vérification de la syntaxe..."
    node -c server.js
    
    print_message "Build backend terminé"
}

# Optimiser les images
optimize_images() {
    print_step "Optimisation des images..."
    
    # Vérifier si ImageMagick est installé
    if command -v convert &> /dev/null; then
        print_message "Optimisation des images avec ImageMagick..."
        
        # Optimiser les images dans le build
        find cs2-frontend/build -name "*.png" -exec convert {} -strip -quality 85 {} \;
        find cs2-frontend/build -name "*.jpg" -exec convert {} -strip -quality 85 {} \;
        
        print_message "Images optimisées"
    else
        print_warning "ImageMagick non installé, optimisation des images ignorée"
    fi
}

# Générer les fichiers de configuration
generate_config_files() {
    print_step "Génération des fichiers de configuration..."
    
    # Générer le sitemap
    generate_sitemap
    
    # Générer robots.txt
    generate_robots_txt
    
    # Générer les fichiers de sécurité
    generate_security_files
    
    print_message "Fichiers de configuration générés"
}

# Générer le sitemap
generate_sitemap() {
    print_message "Génération du sitemap..."
    
    cat > cs2-frontend/build/sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://skincase.com/</loc>
        <lastmod>$(date -u +%Y-%m-%dT%H:%M:%S+00:00)</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://skincase.com/cases</loc>
        <lastmod>$(date -u +%Y-%m-%dT%H:%M:%S+00:00)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://skincase.com/servers</loc>
        <lastmod>$(date -u +%Y-%m-%dT%H:%M:%S+00:00)</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://skincase.com/battlepass</loc>
        <lastmod>$(date -u +%Y-%m-%dT%H:%M:%S+00:00)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://skincase.com/premium</loc>
        <lastmod>$(date -u +%Y-%m-%dT%H:%M:%S+00:00)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
</urlset>
EOF
}

# Générer robots.txt
generate_robots_txt() {
    print_message "Génération de robots.txt..."
    
    cat > cs2-frontend/build/robots.txt << EOF
User-agent: *
Allow: /
Disallow: /api/
Disallow: /auth/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /inventory/
Disallow: /settings/

Sitemap: https://skincase.com/sitemap.xml
EOF
}

# Générer les fichiers de sécurité
generate_security_files() {
    print_message "Génération des fichiers de sécurité..."
    
    # Générer .htaccess pour Apache (si nécessaire)
    cat > cs2-frontend/build/.htaccess << EOF
# Security headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache control
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# SPA fallback
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
EOF
}

# Vérifier la taille du build
check_build_size() {
    print_step "Vérification de la taille du build..."
    
    # Calculer la taille du build frontend
    FRONTEND_SIZE=$(du -sh cs2-frontend/build | cut -f1)
    print_message "Taille du build frontend: $FRONTEND_SIZE"
    
    # Vérifier si la taille est raisonnable
    FRONTEND_SIZE_BYTES=$(du -sb cs2-frontend/build | cut -f1)
    if [ $FRONTEND_SIZE_BYTES -gt 50000000 ]; then
        print_warning "Le build frontend est volumineux (>50MB)"
    fi
    
    # Calculer la taille du backend
    BACKEND_SIZE=$(du -sh . --exclude=cs2-frontend --exclude=node_modules | cut -f1)
    print_message "Taille du backend: $BACKEND_SIZE"
}

# Générer un rapport de build
generate_build_report() {
    print_step "Génération du rapport de build..."
    
    REPORT_FILE="build-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > $REPORT_FILE << EOF
Rapport de build SkinCase
========================
Date: $(date)
Version: $(node -p "require('./package.json').version || '1.0.0'")

Build Frontend:
- Taille: $(du -sh cs2-frontend/build | cut -f1)
- Fichiers: $(find cs2-frontend/build -type f | wc -l)
- Dernière modification: $(date)

Build Backend:
- Taille: $(du -sh . --exclude=cs2-frontend --exclude=node_modules | cut -f1)
- Fichiers: $(find . -name "*.js" -not -path "./cs2-frontend/*" -not -path "./node_modules/*" | wc -l)

Variables d'environnement:
- NODE_ENV: ${NODE_ENV:-non définie}
- REACT_APP_API_URL: ${REACT_APP_API_URL:-non définie}
- MONGODB_URI: ${MONGODB_URI:-non définie}

Optimisations appliquées:
- Compression gzip des assets
- Optimisation des images
- Génération du sitemap
- Fichiers de sécurité
- Preload des assets critiques
EOF
    
    print_message "Rapport de build généré: $REPORT_FILE"
}

# Fonction principale
main() {
    echo "🎯 SkinCase - Script de build de production"
    echo "==========================================="
    echo ""
    
    check_prerequisites
    clean_builds "$1"
    install_dependencies
    build_backend
    build_frontend
    optimize_images
    generate_config_files
    check_build_size
    generate_build_report
    
    echo ""
    echo "🎉 Build de production terminé avec succès !"
    echo ""
    echo "📁 Fichiers générés:"
    echo "   - Frontend: cs2-frontend/build/"
    echo "   - Backend: prêt pour déploiement"
    echo "   - Rapport: build-report-*.txt"
    echo ""
    echo "🚀 Prêt pour le déploiement !"
}

# Gestion des arguments
case "${1:-build}" in
    "build")
        main
        ;;
    "clean")
        clean_builds --clean-deps
        print_message "Nettoyage terminé"
        ;;
    "frontend")
        build_frontend
        ;;
    "backend")
        build_backend
        ;;
    "optimize")
        optimize_images
        ;;
    "config")
        generate_config_files
        ;;
    *)
        echo "Usage: $0 {build|clean|frontend|backend|optimize|config}"
        echo ""
        echo "Commandes:"
        echo "  build     - Build complet de production (défaut)"
        echo "  clean     - Nettoyer les builds et dépendances"
        echo "  frontend  - Build du frontend uniquement"
        echo "  backend   - Build du backend uniquement"
        echo "  optimize  - Optimiser les images"
        echo "  config    - Générer les fichiers de configuration"
        exit 1
        ;;
esac
