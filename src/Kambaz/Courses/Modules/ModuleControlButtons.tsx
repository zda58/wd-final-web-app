import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { BsPlus } from "react-icons/bs";
import { FaPencil, FaTrash } from "react-icons/fa6";
import { RoleRoute } from "../../Account/ProtectedRoute";
export default function ModuleControlButtons({ moduleId, deleteModule, editModule }:
  { moduleId: string; deleteModule: (moduleId: string) => void; editModule: (moduleId: string) => void }) {
  return (
    <div className="float-end">
      <RoleRoute roles={["FACULTY"]}>
      <FaPencil onClick={() => editModule(moduleId)} className="text-primary me-3" />
      <FaTrash className="text-danger me-2 mb-1" onClick={() => deleteModule(moduleId)} />
      </RoleRoute>
      <GreenCheckmark />
      <BsPlus />
      <IoEllipsisVertical className="fs-4" />
    </div>);
}