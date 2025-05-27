import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addAssignment, updateAssignment } from "./reducer";
import * as coursesClient from "../client";
import * as assignmentsClient from "./client";

const formatLocalDateTime = (date: string): string => {
  try {
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      throw new Error();
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    return '0000:00:00T00:00:00';
  }
};

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);

  const defaultAssignment = {
    title: "New Assignment",
    course: cid,
    description: "Description",
    points: 0,
    group: "ASSIGNMENTS",
    display: "PERCENTAGE",
    submissionType: "ONLINE",
    entryOptions: [],
    assignTo: [],
  } as any;

  const [assignment, setAssignment] = useState(defaultAssignment);

  const isNewAssignment = !(assignments.find((assignment: any) => assignment._id === aid));

  useEffect(() => {
    const foundAssignment = assignments.find((assignment: any) => assignment._id === aid);
    if (foundAssignment) {
      setAssignment(foundAssignment);
    }
  }, [aid, assignments]);

  const dispatch = useDispatch();
  const navigator = useNavigate();

  const saveNewAssignment = async () => {
    if (!cid) return;
    if (!assignment.title) {
      alert("Assignment should have a title");
      return;
    }
    assignment.course = cid;
    const createdAssignment = await coursesClient.createAssignmentForCourse(cid, assignment);
    dispatch(addAssignment(createdAssignment));
    navigator(`/Kambaz/Courses/${cid}/Assignments`);
  };

  const updateCurAssignment = async () => {
    if (!assignment.title) {
      alert("Assignment should have a title");
      return;
    }
    const updatedAssignment =
      await assignmentsClient.updateAssignment(assignment);
    dispatch(updateAssignment(updatedAssignment));
    navigator(`/Kambaz/Courses/${cid}/Assignments`);
  }

  return (
    <div id="wd-assignments-editor">
      <Form>
        <Form.Group className="mb-3" controlId="wd-name">
          <Form.Label className="fw-bold">Assignment Name</Form.Label>
          <Form.Control value={assignment.title || ''}
            onChange={(e) => setAssignment({ ...assignment, title: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="wd-description">
          <Form.Control
            as="textarea"
            style={{ height: '150px' }}
            value={assignment.description || ''}
            onChange={(e) => setAssignment({ ...assignment, description: e.target.value })} />
        </Form.Group>

        <Row className="mb-3 align-items-center">
          <Col xs={4} className="text-end pe-2">
            <Form.Label htmlFor="wd-points" className="mb-0">Points</Form.Label>
          </Col>
          <Col xs={8} md={6}>
            <Form.Group controlId="wd-points" className="mb-0">
              <Form.Control type="number" value={assignment.points || 0}
                onChange={(e) => setAssignment({ ...assignment, points: parseInt(e.target.value) || 0 })} />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3 align-items-center">
          <Col xs={4} className="text-end pe-2">
            <Form.Label htmlFor="wd-group" className="mb-0">Assignment Group</Form.Label>
          </Col>
          <Col xs={8} md={6}>
            <Form.Group controlId="wd-group" className="mb-0">
              <Form.Select value={assignment.group || "ASSIGNMENTS"}
                onChange={(e) => setAssignment({ ...assignment, group: e.target.value })}>
                <option value="ASSIGNMENTS">Assignments</option>
                <option value="QUIZES">Quizzes</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3 align-items-center">
          <Col xs={4} className="text-end pe-2">
            <Form.Label htmlFor="wd-display-grade-as" className="mb-0">Display Grade as</Form.Label>
          </Col>
          <Col xs={8} md={6}>
            <Form.Group controlId="wd-display-grade-as" className="mb-0">
              <Form.Select value={assignment.display || "PERCENTAGE"}
                onChange={(e) => setAssignment({ ...assignment, display: e.target.value })}>
                <option value="PERCENTAGE">Percentage</option>
                <option value="EE">ee</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={4} className="text-end pe-2">
            <Form.Label htmlFor="wd-submission-type" className="mb-0 mt-3">Submission Type</Form.Label>
          </Col>
          <Col xs={8} md={6} className="border pb-2 pt-2">
            <Form.Group controlId="wd-submission-type" className="mb-0">
              <Form.Select value={assignment.submissionType || "ONLINE"} className="mb-2"
              onChange={(e) => {
                  setAssignment({ ...assignment, submissionType: e.target.value });
                }}>
                <option value="ONLINE">Online</option>
                <option value="PERSON">In Person</option>
              </Form.Select>
              <Form.Label className="fw-bold">Online Entry Options</Form.Label>
              <Form.Check checked={assignment.entryOptions?.includes("TEXT_ENTRY") || false}
                onChange={(e) => {
                  const options = assignment.entryOptions || [];
                  const newOptions = e.target.checked
                    ? [...options, "TEXT_ENTRY"]
                    : options.filter((opt: any) => opt !== "TEXT_ENTRY");
                  setAssignment({ ...assignment, entryOptions: newOptions });
                }}
                id="wd-text-entry"
                label="Text Entry" />
              <Form.Check checked={assignment.entryOptions?.includes("WEBSITE_URL") || false}
                onChange={(e) => {
                  const options = assignment.entryOptions || [];
                  const newOptions = e.target.checked
                    ? [...options, "WEBSITE_URL"]
                    : options.filter((opt: any) => opt !== "WEBSITE_URL");
                  setAssignment({ ...assignment, entryOptions: newOptions });
                }} id="wd-website-url"
                label="Website URL" />
              <Form.Check checked={assignment.entryOptions?.includes("MEDIA_RECORDINGS") || false}
                onChange={(e) => {
                  const options = assignment.entryOptions || [];
                  const newOptions = e.target.checked
                    ? [...options, "MEDIA_RECORDINGS"]
                    : options.filter((opt: any) => opt !== "MEDIA_RECORDINGS");
                  setAssignment({ ...assignment, entryOptions: newOptions });
                }} id="wd-media-recordings"
                label="Media Recordings" />
              <Form.Check checked={assignment.entryOptions?.includes("STUDENT_ANNOTATIONS") || false}
                onChange={(e) => {
                  const options = assignment.entryOptions || [];
                  const newOptions = e.target.checked
                    ? [...options, "STUDENT_ANNOTATIONS"]
                    : options.filter((opt: any) => opt !== "STUDENT_ANNOTATIONS");
                  setAssignment({ ...assignment, entryOptions: newOptions });
                }} id="wd-student-annotations"
                label="Student annotations" />
              <Form.Check checked={assignment.entryOptions?.includes("FILE_UPLOADS") || false}
                onChange={(e) => {
                  const options = assignment.entryOptions || [];
                  const newOptions = e.target.checked
                    ? [...options, "FILE_UPLOADS"]
                    : options.filter((opt: any) => opt !== "FILE_UPLOADS");
                  setAssignment({ ...assignment, entryOptions: newOptions });
                }} id="wd-file-uploads"
                label="File Uploads" />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={4} className="text-end pe-2">
            <Form.Label htmlFor="wd-assign-to" className="mb-0 mt-3">Assign</Form.Label>
          </Col>
          <Col xs={8} md={6} className="border pb-2 pt-2">
            <Form.Group controlId="wd-assign-to" className="mb-3">
              <Form.Label className="fw-bold">Assign to</Form.Label>
              <Form.Control as="select" multiple value={assignment.assignTo || []}
                onChange={(e) => {
                  const target = e.target as unknown as HTMLSelectElement;
                  const selectedValues = Array.from(target.selectedOptions, option => option.value);
                  setAssignment({ ...assignment, assignTo: selectedValues });
                }}>
                <option value="SEC1">Section 1</option>
                <option value="SEC2">Section 2</option>
                <option value="SEC3">Section 3</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="wd-due-date" className="mb-0">
              <Form.Label className="fw-bold">Due</Form.Label>
              <Form.Control type="datetime-local" value={formatLocalDateTime(assignment.due) || ""}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  const dateString = newDate.toISOString().split('.')[0] + "+00:00";
                  setAssignment({ ...assignment, due: dateString });
                }} />
            </Form.Group>
            <Row>
              <Col xs={6}>
                <Form.Group controlId="wd-available-from" className="mb-0">
                  <Form.Label className="fw-bold">Available from</Form.Label>
                  <Form.Control type="datetime-local" value={formatLocalDateTime(assignment.from)}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      const dateString = newDate.toISOString().split('.')[0] + "+00:00";
                      setAssignment({ ...assignment, from: dateString });
                    }} />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group controlId="wd-available-until" className="mb-0">
                  <Form.Label className="fw-bold">Until</Form.Label>
                  <Form.Control type="datetime-local" value={formatLocalDateTime(assignment.until)}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      const dateString = newDate.toISOString().split('.')[0] + "+00:00";
                      setAssignment({ ...assignment, until: dateString });
                    }} />
                </Form.Group>
              </Col>
            </Row>
          </Col>
        </Row>
        <hr />
        <Row className="mb-3">
          <Col xs={4}>
          </Col>
          <Col xs={8} md={6} className="text-end">
            <Link to={`/Kambaz/Courses/${cid}/Assignments/`} id={`wd-cancel`}
              className="btn btn-secondary btn-lg me-2">Cancel</Link>
            <Button id={`wd-cancel`}
              className="btn btn-danger btn-lg me-2"
              onClick={isNewAssignment ? saveNewAssignment : updateCurAssignment}>Save</Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
