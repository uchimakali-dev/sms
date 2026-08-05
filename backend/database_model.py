from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, Float,Date,ForeignKey,Boolean

Base=declarative_base()
class students(Base):

    __tablename__ = "students"

    id=Column(Integer,primary_key=True,index=True)
    student_name=Column(String(200))
    dateofjoin=Column(Date)
    department=Column(String(50))
    
    fees=relationship("fees",back_populates="students")

    

class fees(Base):
    __tablename__="fees"

    id=Column(Integer,primary_key=True)
    student_id=Column(Integer,ForeignKey(students.id))
    month=Column(Integer)
    year=Column(Integer)
    amount_due=Column(Integer)
    amount_paid=Column(Integer)
    paid=Column(Boolean)

    students=relationship("students",back_populates="fees")



class users(Base):

    __tablename__ = "users"

    user_id=Column(Integer,primary_key=True,index=True)
    username=Column(String(200))
    pwd=Column(String(64))





