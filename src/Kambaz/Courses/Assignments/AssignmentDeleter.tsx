import { Modal, Button } from "react-bootstrap";
export default function AssignmentDeleter({ show, handleClose, dialogTitle, assignmentId, deleteAssignment }: {
  show: boolean; handleClose: () => void; dialogTitle: string; assignmentId: string; deleteAssignment: (assignmentId: string) => void;
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{dialogTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}> Cancel </Button>
        <Button variant="primary"
          onClick={() => {
            deleteAssignment(assignmentId);
            handleClose();
          }} > Delete assignment </Button>
      </Modal.Footer>
    </Modal>
  );
}