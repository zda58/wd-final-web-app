import { ListGroup, Button, FormControl } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, setTodo, updateTodo } from "./todosReducer";

export default function TodoForm() {
  const { todo } = useSelector((state: any) => state.todosReducer);
  const dispatch = useDispatch();
  return (
    <ListGroup.Item className="d-flex">
      <FormControl className="m-2" value={todo.title}
        onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))} />
        <Button onClick={() => dispatch(updateTodo(todo))}
         className="btn btn-warning border-0 rounded mb-2 m-2" id="wd-update-todo-click"> Update </Button>
        <Button onClick={() => dispatch(addTodo(todo))}
         className="btn btn-success border-0 rounded mb-2 m-2" id="wd-add-todo-click"> Add </Button>
    </ListGroup.Item>
  );
}
