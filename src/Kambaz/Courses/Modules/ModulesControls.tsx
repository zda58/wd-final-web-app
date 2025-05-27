import { FaPlus } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import { Button, Dropdown } from "react-bootstrap";
import ModuleEditor from "./ModuleEditor";
import { useState } from "react";
import { RoleRoute } from "../../Account/ProtectedRoute";


export default function ModulesControls({ moduleName, setModuleName, addModule }:
  { moduleName: string; setModuleName: (title: string) => void; addModule: () => void; }) {
   const [show, setShow] = useState(false);
   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);
  return (
    <div id="wd-modules-controls" className="text-nowrap" style={{ minWidth: "620px" }}>
      <RoleRoute roles={["FACULTY"]}><></>
      <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-module-btn" onClick={handleShow}>
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Module
      </Button>
      <Dropdown className="float-end me-2">
        <Dropdown.Toggle variant="secondary" size="lg" id="wd-publish-all-btn">
          <GreenCheckmark /> Publish All
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item id="wd-publish-all-modules-and-items">
            <GreenCheckmark /> Publish all modules and items
          </Dropdown.Item>
          <Dropdown.Item id="wd-publish-modules-only">
            <GreenCheckmark /> Publish modules only
          </Dropdown.Item>
          <Dropdown.Item id="wd-unpublish-all-modules-and-items">
            <GreenCheckmark /> Unpublish all modules and items
          </Dropdown.Item>
          <Dropdown.Item id="wd-unpublish-modules-only">
            <GreenCheckmark /> Unpublish modules only
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      </RoleRoute>
      <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-view-progress">
        View Progress
      </Button>
      <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-collapse-all">
        Collapse All
      </Button>
      <ModuleEditor show={show} handleClose={handleClose} dialogTitle="Add Module"
       moduleName={moduleName} setModuleName={setModuleName} addModule={addModule} />
    </div>
  );
}
