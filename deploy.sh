#!/bin/bash

# Script de déploiement SkinCase
set -e

echo "🚀 Déploiement SkinCase en cours..."

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
    
    # Vérifier Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker n'est pas installé"
        exit 1
    fi
    
    # Vérifier Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose n'est pas installé"
        exit 1
    fi
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé"
        exit 1
    fi
    
    print_message "Tous les prérequis sont installés"
}

# Créer le fichier .env s'il n'existe pas
setup_environment() {
    print_step "Configuration de l'environnement..."
    
    if [ ! -f .env ]; then
        print_warning "Fichier .env non trouvé, création depuis .env.example"
        if [ -f .env.example ]; then
            cp .env.example .env
            print_warning "Veuillez configurer les variables d'environnement dans .env"
        else
            print_error "Fichier .env.example non trouvé"
            exit 1
        fi
    else
        print_message "Fichier .env trouvé"
    fi
}

# Build des images Docker
build_images() {
    print_step "Construction des images Docker..."
    
    # Build du backend
    print_message "Construction de l'image backend..."
    docker build -t skincase-backend .
    
    # Build du frontend
    print_message "Construction de l'image frontend..."
    cd cs2-frontend
    docker build -t skincase-frontend .
    cd ..
    
    print_message "Images construites avec succès"
}

# Démarrage des services
start_services() {
    print_step "Démarrage des services..."
    
    # Arrêter les services existants
    docker-compose down --remove-orphans
    
    # Démarrer les services
    docker-compose up -d
    
    print_message "Services démarrés"
}

# Vérification de la santé des services
health_check() {
    print_step "Vérification de la santé des services..."
    
    # Attendre que les services soient prêts
    sleep 30
    
    # Vérifier MongoDB
    if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
        print_message "✅ MongoDB est opérationnel"
    else
        print_error "❌ MongoDB n'est pas opérationnel"
        return 1
    fi
    
    # Vérifier Redis
    if docker-compose exec -T redis redis-cli ping | grep -q "PONG"; then
        print_message "✅ Redis est opérationnel"
    else
        print_error "❌ Redis n'est pas opérationnel"
        return 1
    fi
    
    # Vérifier le backend
    if curl -f http://localhost:5000/health &> /dev/null; then
        print_message "✅ Backend est opérationnel"
    else
        print_error "❌ Backend n'est pas opérationnel"
        return 1
    fi
    
    # Vérifier le frontend
    if curl -f http://localhost:3000 &> /dev/null; then
        print_message "✅ Frontend est opérationnel"
    else
        print_error "❌ Frontend n'est pas opérationnel"
        return 1
    fi
}

# Initialisation de la base de données
init_database() {
    print_step "Initialisation de la base de données..."
    
    # Attendre que MongoDB soit prêt
    sleep 10
    
    # Exécuter les scripts d'initialisation
    if [ -f "scripts/initDatabase.js" ]; then
        print_message "Exécution du script d'initialisation de la base de données..."
        docker-compose exec -T backend node scripts/initDatabase.js
    fi
    
    if [ -f "scripts/initBattlepass.js" ]; then
        print_message "Exécution du script d'initialisation du battlepass..."
        docker-compose exec -T backend node scripts/initBattlepass.js
    fi
    
    print_message "Base de données initialisée"
}

# Affichage des informations de déploiement
show_deployment_info() {
    print_step "Informations de déploiement"
    
    echo ""
    echo "🎉 Déploiement terminé avec succès !"
    echo ""
    echo "📱 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:5000"
    echo "📊 Health Check: http://localhost:5000/health"
    echo ""
    echo "🗄️  Base de données:"
    echo "   - MongoDB: localhost:27017"
    echo "   - Redis: localhost:6379"
    echo ""
    echo "📋 Commandes utiles:"
    echo "   - Voir les logs: docker-compose logs -f"
    echo "   - Arrêter: docker-compose down"
    echo "   - Redémarrer: docker-compose restart"
    echo "   - Status: docker-compose ps"
    echo ""
}

# Fonction principale
main() {
    echo "🎯 SkinCase - Script de déploiement"
    echo "=================================="
    echo ""
    
    check_prerequisites
    setup_environment
    build_images
    start_services
    init_database
    
    if health_check; then
        show_deployment_info
    else
        print_error "Échec du déploiement - certains services ne sont pas opérationnels"
        print_message "Vérifiez les logs avec: docker-compose logs"
        exit 1
    fi
}

# Gestion des arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "build")
        check_prerequisites
        build_images
        ;;
    "start")
        start_services
        ;;
    "stop")
        print_step "Arrêt des services..."
        docker-compose down
        print_message "Services arrêtés"
        ;;
    "restart")
        print_step "Redémarrage des services..."
        docker-compose restart
        print_message "Services redémarrés"
        ;;
    "logs")
        docker-compose logs -f
        ;;
    "status")
        docker-compose ps
        ;;
    "health")
        health_check
        ;;
    "clean")
        print_step "Nettoyage des ressources Docker..."
        docker-compose down --volumes --remove-orphans
        docker system prune -f
        print_message "Nettoyage terminé"
        ;;
    *)
        echo "Usage: $0 {deploy|build|start|stop|restart|logs|status|health|clean}"
        echo ""
        echo "Commandes:"
        echo "  deploy  - Déploiement complet (défaut)"
        echo "  build   - Construction des images uniquement"
        echo "  start   - Démarrage des services"
        echo "  stop    - Arrêt des services"
        echo "  restart - Redémarrage des services"
        echo "  logs    - Affichage des logs"
        echo "  status  - Statut des services"
        echo "  health  - Vérification de la santé"
        echo "  clean   - Nettoyage des ressources"
        exit 1
        ;;
esac
