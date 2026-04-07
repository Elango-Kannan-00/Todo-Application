# Table creation ORM model file
from sqlalchemy import Column, Integer, String, Boolean
from Database import base

# Extending base class
class Todo(base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    completed = Column(Boolean, default=False)
    