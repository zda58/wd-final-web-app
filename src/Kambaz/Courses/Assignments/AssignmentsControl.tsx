import { InputGroup, Button, Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { RoleRoute } from "../../Account/ProtectedRoute";
import { Link, useParams } from "react-router-dom";

export default function AssignmentsControl() {
  const { cid } = useParams();
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <InputGroup className="w-25">
        <InputGroup.Text>
          <FaMagnifyingGlass />
        </InputGroup.Text>
        <Form.Control id="wd-search-assignment" placeholder="Search..." />
      </InputGroup>
      <RoleRoute roles={["FACULTY"]}>
        <span>
          <Link className="btn btn-danger btn-lg me-1 float-end" id="wd-add-module-btn"
            to={`/Kambaz/Courses/${cid}/Assignments/new`}>
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
            Assignment
          </Link>
          <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-add-module-btn">
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
            Group
          </Button>
        </span>
      </RoleRoute>
    </div>
  );
}