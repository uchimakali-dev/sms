from sqlalchemy.orm import sessionmaker
import sqlalchemy
from dotenv import load_dotenv
import os


load_dotenv()

db_url=os.getenv("DATABASE_URL")
Database_url=db_url


engine=sqlalchemy.create_engine(Database_url,
    connect_args={
        "ssl": {
            "ca": "ca.pem"
        }
    }
    )

session=sessionmaker(autocommit=False,autoflush=True,bind=engine)