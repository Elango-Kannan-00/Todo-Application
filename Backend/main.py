from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from Models.Todo import Todo
from Schemas import Todo as TodoSchema, TodoCreate
from sqlalchemy.orm import Session
from Database import sessionLocal, base, engine

# Create tables
base.metadata.create_all(bind=engine)

app = FastAPI()

# Enable CORS for React frontend (default React runs on localhost:3000)
origins = [
    "http://localhost:3000",
    "http://localhost:5173",  # frontend origin
    "http://127.0.0.1:5173",
    # you can add more origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency for DB Session 
def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create Todo
@app.post("/todos", response_model=TodoSchema)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    db_todo = Todo(**todo.dict())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

# Get all Todos
@app.get("/todos", response_model=list[TodoSchema])
def get_todos(db: Session = Depends(get_db)):
    return db.query(Todo).all()

# Update Todo
@app.put("/todos/{todo_id}", response_model=TodoSchema)
def update_todo(todo_id: int, updated: TodoCreate, db: Session = Depends(get_db)):
    todo_item = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo_item:
        raise HTTPException(status_code=404, detail="Todo not found")
    for key, value in updated.dict().items():
        setattr(todo_item, key, value)
    db.commit()
    db.refresh(todo_item)
    return todo_item

# Delete Todo
@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(todo)
    db.commit()
    return {"message": "Todo deleted successfully"}