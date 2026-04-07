from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# Loading env files
load_dotenv()
DATABASE_URL = os.getenv("DATABaSE_URL")

# Creating database engine
engine = create_engine(DATABASE_URL)
# To prevent autodeletion of session, set autoflush as false
sessionLocal = sessionmaker(bind=engine, autoflush=False) 

base = declarative_base()