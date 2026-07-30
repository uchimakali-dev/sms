from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float

Base=declarative_base()
class students(Base):

    __tablename__ = "students"

    id=Column(Integer,primary_key=True,index=True)
    student_name=Column(String(200))
    age=Column(Integer)
    email=Column(String(100))
    department=Column(String(50))

