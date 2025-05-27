import { FormControl, ListGroup } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import { useParams } from "react-router";
import * as coursesClient from "../client";
import { addModule, editModule, updateModule, deleteModule, setModules }
  from "./reducer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as modulesClient from "./client";

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const dispatch = useDispatch();

  const fetchModules = async () => {
    const modules = await coursesClient.findModulesForCourse(cid as string);
    dispatch(setModules(modules));
  };

  const removeModuleHandler = async (moduleId: string) => {
    await modulesClient.deleteModule(moduleId);
    dispatch(deleteModule(moduleId));
  };

  const updateModuleHandler = async (module: any) => {
    await modulesClient.updateModule(module);
    dispatch(updateModule(module));
  };

  const addModuleHandler = async () => {
    const newModule = await coursesClient.createModuleForCourse(cid!, {
      name: moduleName,
      course: cid,
    });
    dispatch(addModule(newModule));
    setModuleName("");
  };

  useEffect(() => {
    fetchModules();
  }, [cid]);

  return (
    <div>
      <ModulesControls setModuleName={setModuleName} moduleName={moduleName} addModule={addModuleHandler} />
      <br /><br /><br /><br />
      <ListGroup className="rounded-0" id="wd-modules">
        {modules
          .map((module: any) => (
            <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
              <div className="wd-title p-3 ps-2 bg-secondary">
                <BsGripVertical className="me-2 fs-3" /> {!module.editing && module.name}
                {module.editing && (
                  <FormControl className="w-50 d-inline-block"
                    onChange={(e) => dispatch(updateModule({ ...module, name: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updateModuleHandler({ ...module, editing: false });
                      }
                    }}
                    defaultValue={module.name} />
                )}
                <ModuleControlButtons moduleId={module._id}
                  deleteModule={(moduleId) => removeModuleHandler(moduleId)} editModule={(moduleId) => dispatch(editModule(moduleId))} />
              </div>
              {module.lessons && (
                <ListGroup className="wd-lessons rounded-0">
                  {module.lessons.map((lesson: any) => (
                    <ListGroup.Item className="wd-lesson p-3 ps-1">
                      <BsGripVertical className="me-2 fs-3" /> {lesson.name} <LessonControlButtons />
                    </ListGroup.Item>
                  ))}
                </ListGroup>)}
            </ListGroup.Item>))}
      </ListGroup>
    </div>
  );
}
