import { useState } from "react";
import { Form, FormControl } from "react-bootstrap";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1, title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10", completed: false, score: 0,
  });
  const [module, setModule] = useState({
    id: 1, name: "NodeJS Module",
    description: "Learn how to use NodeJS",
    course: "web",
  });
  const ASSIGNMENT_API_URL = `${REMOTE_SERVER}/lab5/assignment`
  const MODULE_API_URL = `${REMOTE_SERVER}/lab5/module`
  console.log(assignment)
  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>
      <h4>Modifying Properties</h4>
      <hr />
      <h2>Assignment operations</h2>
      <a id="wd-update-assignment-title"
         className="btn btn-primary float-end"
         href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>
        Update Title
      </a>
      <FormControl className="w-75" id="wd-assignment-title"
        defaultValue={assignment.title} onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })}/>
      <hr />
      <h4>Retrieving Objects</h4>
      <a id="wd-retrieve-assignments" className="btn btn-primary"
        href={`${REMOTE_SERVER}/lab5/assignment`}>
        Get Assignment
      </a><hr />
      <h4>Retrieving Properties</h4>
      <a id="wd-retrieve-assignment-title" className="btn btn-primary"
         href={`${REMOTE_SERVER}/lab5/assignment/title`}>
        Get Title
      </a><hr/>

      <a id="wd-update-assignment-score"
         className="btn btn-primary float-end"
         href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
        Update Score
      </a>
      <FormControl type="number" className="w-75" id="wd-assignment-score"
        defaultValue={assignment.score} onChange={(e) => {
          const parsedNum = parseInt(e.target.value);
          console.log(parsedNum)
          setAssignment({ ...assignment, score: isNaN(parsedNum) ? 0 : parsedNum})}}/>
      <hr />

      <a id="wd-update-assignment-completed"
         className="btn btn-primary float-end"
         href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}>
        Update Completed
      </a>
      <Form.Check type="checkbox" className="w-75" id="wd-assignment-completed"
        checked={assignment.completed} onChange={(e) => 
          setAssignment({ ...assignment, completed: (e.target.checked)})}/>
      <hr />
      <h2>Module operations</h2>
      <a id="wd-update-module-name"
         className="btn btn-primary float-end"
         href={`${MODULE_API_URL}/name/${module.name}`}>
        Update Module Name
      </a>
      <FormControl className="w-75" id="wd-module-name"
        defaultValue={module.name} onChange={(e) =>
          setModule({ ...module, name: e.target.value })}/>
      <hr />
      <a id="wd-retrieve-modules" className="btn btn-primary"
        href={`${MODULE_API_URL}`}>
        Get Module
      </a><hr />
      <a id="wd-retrieve-module-name" className="btn btn-primary"
         href={`${MODULE_API_URL}/name`}>
        Get Module Name
      </a><hr/>
    </div>
  );
}