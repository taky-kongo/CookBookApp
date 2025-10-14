from sqlmodel import create_engine
from .config import settings

# L'URL de connexion est chargée depuis les settings
# L'argument 'pool_pre_ping=True' permet de tester les connexions avant de les utiliser
engine = create_engine(
    settings.DATABASE_URL, 
    echo=True, # Afficher les requêtes SQL générées (utile en dev)
    pool_pre_ping=True
)

def init_db():
    """
    Fonction qui pourrait être utilisée pour initialiser la BDD si on utilisait
    SQLModel.SQLModel.metadata.create_all(engine).
    
    Nous préférons utiliser Alembic (Étape 4) pour gérer les migrations.
    """
    # Ici, nous n'initialisons rien manuellement, on se repose sur Alembic (migrations)
    # L'appel à create_all() est souvent omis en production au profit des outils de migration
    pass