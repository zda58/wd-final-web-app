import { ListGroup, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";

export default function TodoItem({ todo } : { todo : any }) {
  const dispatch = useDispatch();
  return (
    <ListGroup.Item key={todo.id} className="d-flex align-items-center justify-content-between">
      {todo.title}
      <div>
      <Button className="btn border-0 rounded mb-2 m-2" onClick={() => dispatch(setTodo(todo))}
        id="wd-set-todo-click"> Edit </Button>
      <Button className="btn btn-danger border-0 rounded mb-2 m-2" onClick={() => dispatch(deleteTodo(todo.id))}
        id="wd-delete-todo-click"> Delete </Button>
      </div>
    </ListGroup.Item>
  );
}