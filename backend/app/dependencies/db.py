from typing import Generator
from sqlmodel import Session
from ..core.db import engine

# Cette fonction est un 'generator' et sera utilisée par FastAPI comme Dépendance
def get_db() -> Generator[Session, None, None]:
    """
    Dépendance FastAPI pour obtenir une session de base de données.
    La session est automatiquement fermée après la requête (grâce au 'yield').
    """
    with Session(engine) as session:
        # Fournit la session au code de l'endpoint
        yield session
    # Le bloc 'with' assure la fermeture de la session, même en cas d'erreur