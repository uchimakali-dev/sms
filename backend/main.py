from fastapi import FastAPI,Depends,HTTPException,status
from fastapi.middleware.cors import CORSMiddleware
from database import session,engine
import database_model
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os
import password
import webtoken
import bcrypt

database_model.Base.metadata.create_all(bind=engine)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

app=FastAPI()
@app.api_route("/",methods=['GET',"HEAD"])
def root():
    return {"status":"ok"}

load_dotenv()

cors=os.getenv("CORS")
origins = cors

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class students(BaseModel):
    student_name:str
    email:str
    department:str


class LoginData(BaseModel):
    name:str
    password:str


def get_db():
    db=session()

    try:
        yield db
    finally:
        db.close()




@app.post("/login")
def login(data:OAuth2PasswordRequestForm = Depends(),db:Session=Depends(get_db)):

    user=db.query(database_model.users).filter(database_model.users.username==data.username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="incorrect username or password"
        )
    hashed_pwd=(user.pwd)


    success=password.verify_password(data.password,hashed_pwd)

    if success:
        token=webtoken.create_token(user.user_id)
        return {
            "success":True,
            "access_token":token
        }

    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="incorrect username or password"
        )


def get_current_user(token:str=Depends(oauth2_scheme)):
    if token=="undefined":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing authentcation token"
        )
    return webtoken.verify_token(token)


    
    
@app.get("/")
def home():
    return {"message":"welcome the student management API"}


@app.post("/add_student")
def new_student(data:students,user:dict=Depends(get_current_user)):

    db=session()
    db.add(database_model.students(**data.model_dump()))

    db.commit()

    return {
        "message":"data is stored successfully"
    }

@app.get("/students/")
def sort_student(search:str=None ,sort:str=None,db:Session=Depends(get_db),user:dict=Depends(get_current_user)):


    stud=db.query(database_model.students)

    if search:
        stud=stud.filter(database_model.students.student_name.contains(search))
    if sort=="name":
        stud=stud.order_by(database_model.students.student_name)
    if sort=="department":
        stud=stud.order_by(database_model.students.department)
    if sort=="email":
        stud=stud.order_by(database_model.students.email)

    stud=stud.all()

    if stud:
        return stud
    
@app.get("/all_students")

def all_students(db:Session = Depends(get_db),user:dict=Depends(get_current_user)):
    all_stud=db.query(database_model.students).all()

    return all_stud


@app.get("/students/{student_id}")
def one_student(student_id:int,db:Session=Depends(get_db),user:dict=Depends(get_current_user)):

    stud=db.query(database_model.students).filter(database_model.students.id==student_id).first()
    if stud:
        return stud
    return "student is not found"


@app.put("/update_student/{student_id}")
def change_data(student_id:int,data:students,db:Session=Depends(get_db),user:dict=Depends(get_current_user)):

    stud=db.query(database_model.students).filter(database_model.students.id==student_id).first()

    if not stud:
        return {"message":"student doesn't exists"}

    stud.student_name=data.student_name 
    stud.department=data.department 
    stud.email=data.email

    db.commit()
    return {"message":"data updated successfully"}


@app.delete("/delete_student/{student_id}")
def delete_data(student_id:int, db:Session=Depends(get_db),user:dict=Depends(get_current_user)):

    stud=db.query(database_model.students).filter(database_model.students.id==student_id).first()

    if not stud:
        return {"message":"student doesn't exists"}

    db.delete(stud)

    db.commit()

    return {"message":"student data is deleted successfully"}


    




