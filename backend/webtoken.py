import jwt
import datetime
from fastapi import HTTPException,status
from dotenv import load_dotenv
import os


load_dotenv()
secret_key=os.getenv("SECRET_KEY")

def create_token(userid:int):

    expiration=datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=30)

    payload={
        "user_id":userid,
        "exp":expiration
    }

    token=jwt.encode(payload,secret_key,algorithm="HS256")

    return token

def verify_token(token):
    try:
        decoded_token=jwt.decode(token,secret_key,algorithms=["HS256"])
        return decoded_token
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="token expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="token invalid"
        )

    


