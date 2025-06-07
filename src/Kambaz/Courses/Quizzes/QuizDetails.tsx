import { Button, Col, Container, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router";
import * as coursesClient from "../client"
import { setQuizzes, updateQuiz } from "./reducer";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import * as quizzesClient from "./client"

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

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);


  const fetchQuizzes = async () => {
    if (!cid) return;
    const updatedQuizzes =
      await coursesClient.findQuizzesForCourse(cid);
    dispatch(setQuizzes(updatedQuizzes));
  };

  useEffect(() => {
    fetchQuizzes();
  }, [cid]);

  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const quiz = quizzes.find((q: any) => q._id === qid);
  const [allAttempts, setAllAttempts] = useState<any[]>([]);

  const fetchQuizAttempts = async () => {
    const attempts = await quizzesClient.fetchQuizAttempts(qid || "", currentUser._id);
    attempts.sort((a: any, b: any) => {
      const aDate = new Date(a.attemptEndTime);
      const bDate = new Date(b.attemptEndTime);
      if (aDate < bDate) {
        return -1;
      } else if (aDate > bDate) {
        return 1;
      } else {
        return 0;
      }
    });
    setAllAttempts(attempts);
  };

  useEffect(() => {
    if (currentUser.role === "FACULTY") return;
    fetchQuizAttempts();
  }, [qid, currentUser]);

  if (!quiz) {
    return;
  }

  const dueDate = new Date(quiz.due);
  const fromDate = new Date(quiz.from);
  const untilDate = new Date(quiz.until);

  const showCorrectDate = new Date(quiz.showTime);

  const calculateAttemptScore = (questions: any, answers: any) => {
    var score = 0;
    questions.map((q: any) => {
      if (answers.some((a: any) => {
        if (a.questionID !== q._id) return false;
        if (q.type === "MULTIPLE") {
          return q.multipleAnswerID === a.multipleAnswerID;
        } else if (q.type === "TRUEFALSE") {
          return q.boolAnswer === a.boolAnswer;
        } else if (q.type === "FILLBLANK") {
          return q.fillAnswers.includes(a.fillAnswer);
        }
        return false;
      })) score += q.points;
    });
    return score;
  };

  const updateQuizPublished = async (quizID: string, published: boolean) => {
      const curQuiz = quizzes.find((q: any) => q._id === quizID);
      if (!curQuiz) return;
      const updatedQuiz = {
        ...curQuiz, published: published
      }
      await quizzesClient.updateQuiz(updatedQuiz);
      dispatch(updateQuiz(updatedQuiz));
    };

  return (
    <>
      <div className="d-flex justify-content-center">
        {(currentUser.role === "FACULTY") &&
          (<>
            <Button variant={quiz.published ? "secondary" : "danger"} size="lg" className="me-2"
            onClick={() => {
              updateQuizPublished(quiz._id, !quiz.published);
            }}>{quiz.published ? "Unpublish" : "Publish"}</Button>
            <Link className="btn btn-secondary btn-lg me-1 float-end" id="wd-add-module-btn"
              to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/take`}>
              Preview
            </Link>
            <Link className="btn btn-danger btn-lg ms-1 float-end" id="wd-add-module-btn"
              to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`}>
              <CiEdit className="me-2 fs-5" />
              Edit
            </Link>
            <Col xs={4}></Col>
          </>
          )
        }
        {
          (currentUser.role !== "FACULTY") &&
          (
            <>
              <Link className="btn btn-secondary btn-lg me-1 float-end" id="wd-add-module-btn"
                to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/take`}>
                Take
              </Link>
            </>
          )
        }
      </div>
      <Container className="border border-5 m-5">
        <h3 className="m-4">
          {quiz.title}
        </h3>
        <Row>
          <Col xs={4} className="text-end fw-bold">Quiz Type</Col>
          <Col xs={4} className="text-start">{quiz.type}</Col>
          <Col xs={4}></Col>
        </Row>
        <Row>
          <Col xs={4} className="text-end fw-bold">Points</Col>
          <Col xs={4} className="text-start">
            {
              quiz.questions.reduce(
                (total: number, question: any) => total + (question.points || 0)
                , 0) || 0
            }
          </Col>
          <Col xs={4}></Col>
        </Row>
        <Row>
          <Col xs={4} className="text-end fw-bold">Assignment Group</Col>
          <Col xs={4} className="text-start">{quiz.group}</Col>
          <Col xs={4}></Col>
        </Row>
        <Row>
          <Col xs={4} className="text-end fw-bold">Shuffle Answers</Col>
          <Col xs={4} className="text-start">{quiz.shuffleAnswers ? "Yes" : "No"}</Col>
          <Col xs={4}></Col>
        </Row>
        <Row>
          <Col xs={4} className="text-end fw-bold">Time Limit</Col>
          <Col xs={4} className="text-start">{quiz.timeLimit ? `${quiz.mins} mins` : "No"}</Col>
          <Col xs={4}></Col>
        </Row>
        <Row>
          <Col xs={4} className="text-end fw-bold">Multiple Attempts</Col>
          <Col xs={4} className="text-start">{quiz.multipleAttempts ? `Yes (${quiz.attempts} attempts)` : "No"}</Col>
          <Col xs={4}></Col>
        </Row>
        <Row>
          <Col xs={4} className="text-end fw-bold">Show Correct Answers</Col>
          <Col xs={4} className="text-start">{quiz.showCorrect === "DATE" ?
            (isNaN(showCorrectDate.getTime()) ? "N/A" : formatDate(showCorrectDate))
            : quiz.showCorrect}</Col>
          <Col xs={4}></Col>
        </Row>
        <Row>
          <Col xs={4} className="text-end fw-bold">Access Code</Col>
          <Col xs={4} className="text-start ">{quiz.accessCode}</Col>
          <Col xs={4}></Col>
        </Row>
        <Row>
          <Col xs={4} className="text-end fw-bold">One Question at a Time</Col>
          <Col xs={4} className="text-start ">{quiz.oneQuestionAtTime ? "Yes" : "No"}</Col>
          <Col xs={4}></Col>
        </Row>
        <Row>
          <Col xs={4} className="text-end fw-bold">Required Webcam</Col>
          <Col xs={4} className="text-start ">{quiz.requiredWebcam ? "Yes" : "No"}</Col>
          <Col xs={4}></Col>
        </Row>
        <Row>
          <Col xs={4} className="text-end fw-bold">Lock After Answering</Col>
          <Col xs={4} className="text-start ">{quiz.lockAfterAnswering ? "Yes" : "No"}</Col>
          <Col xs={4}></Col>
        </Row>
        <br />
        <Row>
          <Col className="text-center">
            <table className="table table-borderless mx-auto">
              <thead>
                <tr>
                  <th className="text-center border-bottom">Due</th>
                  <th className="text-center border-bottom">Available From</th>
                  <th className="text-center border-bottom">Until</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">
                    {
                      (isNaN(dueDate.getTime()) && "N/A") || formatDate(dueDate)
                    }
                  </td>
                  <td className="text-center">
                    {
                      (isNaN(fromDate.getTime()) && "N/A") || formatDate(fromDate)
                    }
                  </td>
                  <td className="text-center">
                    {
                      (isNaN(untilDate.getTime()) && "N/A") || formatDate(untilDate)
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
          <Col xs={4}></Col>
        </Row>
        {(currentUser.role !== "FACULTY") &&
          (<>
            <h3 className="m-4">
              Attempts
            </h3>
            <Row className="ms-5">
              <Col className="text-center">
                <table className="table table-borderless mx-auto">
                  <thead>
                    <tr>
                      <th className="text-center border-bottom"></th>
                      <th className="text-center border-bottom">Start Time</th>
                      <th className="text-center border-bottom">End Time</th>
                      <th className="text-center border-bottom">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      allAttempts.map((a: any, idx: number) => {
                        const startDate = new Date(a.attemptStartTime);
                        const endDate = new Date(a.attemptEndTime);
                        var score = calculateAttemptScore(a.originalQuestions, a.answers);
                        return (
                          <tr>
                              <td className="text-center align-middle">
                              {
                                (idx == allAttempts.length - 1) &&
                                <>
                                  <Link className="btn btn-primary" to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/attempt/${a._id}`}> View </Link>
                                </>
                              }
                              </td>
                            <td className="text-center align-middle">
                              {
                                (isNaN(startDate.getTime()) && "N/A") || formatDate(startDate)
                              }
                            </td>
                            <td className="text-center align-middle">
                              {
                                (isNaN(endDate.getTime()) && "N/A") || formatDate(endDate)
                              }
                            </td>
                            <td className="text-center align-middle">
                              { score } / { quiz.questions.reduce(
                (total: number, question: any) => total + (question.points || 0)
                , 0) || 0 }
                            </td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </Col>
              <Col xs={4}></Col>
            </Row>
          </>)
        }
      </Container>
    </>
  );
}