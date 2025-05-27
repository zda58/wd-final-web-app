import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import AssignmentDeleter from "./AssignmentDeleter";
import { RoleRoute } from "../../Account/ProtectedRoute";

export default function AssignmentControlButtons({ assignmentId, deleteAssignment }:
  { assignmentId: string; deleteAssignment: (assignmentId: string) => void; }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className="float-end">
      <RoleRoute roles={["FACULTY"]}>
      <FaTrash className="text-danger me-2 mb-1" onClick={handleShow} />
      </RoleRoute>
      <GreenCheckmark />
      <IoEllipsisVertical className="fs-4" />
      <AssignmentDeleter show={show} handleClose={handleClose} dialogTitle="Delete assignment"
             assignmentId={assignmentId} deleteAssignment={deleteAssignment} />
    </div>
  );
}