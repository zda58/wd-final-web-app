import { ListGroup, Nav } from "react-bootstrap";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import QuizControl from "./QuizControl";
import { useParams } from "react-router";
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../Modules/GreenCheckmark";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setQuizzes } from "./reducer";
import * as coursesClient from "../client"
import { LuNotebookText } from "react-icons/lu";

const formatDate = (date: Date) => {
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();

  let hours = date.getHours();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${month} ${day} at ${hours}:${minutes}${ampm}`;
};


export default function Quizzes() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const fetchQuizzes = async () => {
    if (!cid) return;
    const updatedQuizzes =
      await coursesClient.findQuizzesForCourse(cid);
    dispatch(setQuizzes(updatedQuizzes));
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);
  return (
    <div id="wd-quizzes">
      <QuizControl />
      <ListGroup className="rounded-0" id="wd-modules">
        <ListGroup.Item className="wd-module p-0 mb-5 sf-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" />QUIZZES
            <div className="float-end">
              <GreenCheckmark />
              <BsPlus />
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>
          <ListGroup className="wd-lessons rounded-0">
            {quizzes.filter((quiz: any) => quiz.course === cid).map((quiz: any) => {
              const fromDate = new Date(quiz.from);
              const dueDate = new Date(quiz.due);

              return (
                <ListGroup.Item className="wd-lesson d-flex justify-content-between align-items-center p-3 ps-1">
                  <div className="d-flex align-items-center">
                    <BsGripVertical className="me-2 fs-3" />
                    <LuNotebookText color="green" className="me-2 fs-3" />
                    <div>
                      <Nav.Link href={currentUser.role == "FACULTY" ?
                        `#/Kambaz/Courses/${cid}/Quizzes/${quiz._id}` : ``}
                        className="wd-assignment-link fw-bold">{quiz.title}</Nav.Link>
                      <span className="text-danger">Multiple Modules</span>
                      {!isNaN(fromDate.getTime()) && (
                        <> | <span className="fw-bold"> Not available until {formatDate(fromDate)} </span></>)}
                      <br />
                      {!isNaN(dueDate.getTime()) && (<><span className="fw-bold"> Due </span> {formatDate(dueDate)} | </>)}
                      {quiz.points}pts
                    </div>
                  </div>
                  <div>
                    {
                      /*<AssignmentControlButtons assignmentId={assignment._id} deleteAssignment={(assignmentId) => {
                      deleteRemoteAssignment(assignmentId)
                    }} />*/
                  }
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}
