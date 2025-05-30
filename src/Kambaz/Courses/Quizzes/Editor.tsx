import { useState } from "react";
import { Button, Col, Row, Tab, Tabs, Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import { v4 as uuidv4 } from "uuid";
import QuestionEditor from "./QuestionEditor";
import * as coursesClient from "../client";
import * as quizzesClient from "./client";
import { addQuiz, updateQuiz } from "./reducer";

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

export default function QuizzesEditor() {
  const { cid, qid } = useParams();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);

  const dispatch = useDispatch();
  const navigator = useNavigate();

  const foundQuiz = quizzes.find((quiz: any) => quiz._id === qid);
  const isNewQuiz = foundQuiz === undefined;

  const defaultQuiz: any = {
    title: "New quiz",
    course: cid,
    description: "",
    type: "GRADED",
    group: "ASSIGNMENTS",
    shuffleAnswers: true,
    timeLimit: true,
    mins: 0,
    multipleAttempts: false,
    attempts: 5,
    showCorrect: "IMMEDIATELY",
    showTime: "2025-05-20T23:59:00-05:00",
    oneQuestionAtTime: false,
    requiredWebcam: false,
    lockAfterAnswering: false,
    assignTo: [],
    due: "2025-05-20T23:59:00-05:00",
    from: "2025-05-20T00:00:00-05:00",
    until: "2025-05-20T23:59:00-05:00",
    accessCode: "",
    questions: [],
  };

  const [quiz, setQuiz] = useState(defaultQuiz);
  const createQuestionHandler = () => {
    const optId = uuidv4();
    const newQuestion = {
      _id: uuidv4(),
      title: "New Question",
      points: 0,
      question: "Description",
      type: "MULTIPLE",
      multipleOpts: [{ _id: optId, value: "Option" }],
      multipleAnswerID: optId,
      boolAnswer: true,
      fillAnswers: ["Answer"]
    } as any;
    const newQuestions: any[] = [...quiz.questions, newQuestion];
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const deleteQuestionHandler = (questionId: string) => {
    const filteredQuestions = quiz.questions.filter((question: any) => question._id !== questionId);
    setQuiz({ ...quiz, questions: filteredQuestions });
  };

  const updateQuestionHandler = (questionId: string, question: any) => {
    const updatedQuestion = { ...question, _id: questionId };
    const updatedList = quiz.questions.map((q: any) =>
      q._id === questionId ? updatedQuestion : q);
    setQuiz({ ...quiz, questions: updatedList as any })
  };

  const saveNewQuizHandler = async () => {
    if (!cid) return;
    const newQuiz = await coursesClient.createQuizForCourse(cid, { ...quiz, course: cid });
    dispatch(addQuiz(newQuiz));
    navigator(`/Kambaz/Courses/${cid}/Quizzes`);
  };

  const updateQuizHandler = async () => {
    if (!cid) return;
    const updatedQuiz = { ...quiz, _id: qid, course: cid };
    await quizzesClient.updateQuiz(updateQuiz);
    dispatch(updateQuiz(updatedQuiz));
    navigator(`/Kambaz/Courses/${cid}/Quizzes`);
  };

  return (
    <>
    <Row className="mb-3">
      <Col></Col>
      <Col xs="auto" className="d-flex align-items-center">
      <span className="me-2 fw-bold">
      Points:{
        quiz.questions.reduce(
          (total: number, question: any) => total + (question.points || 0)
          , 0) || 0
      }
      </span>
      </Col>
    </Row>
    <Tabs
      defaultActiveKey="details"
      id="wd-quiz-editor-tabs"
      className="mb-3">
      <Tab eventKey="details" title="Details">
        <Form>
          <Form.Group className="mb-3" controlId="wd-name">
            <Form.Label className="fw-bold">Quiz Name</Form.Label>
            <Form.Control value={quiz.title || ''}
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="wd-description">
            <Form.Control as="textarea" style={{ height: '150px' }}
              value={quiz.description || ''}
              onChange={(e) => setQuiz({ ...quiz, description: e.target.value })} />
          </Form.Group>

          <Row className="mb-3 align-items-center">
            <Col xs={4} className="text-end pe-2">
              <Form.Label htmlFor="wd-type" className="mb-0">Quiz Type</Form.Label>
            </Col>
            <Col xs={8} md={6}>
              <Form.Group controlId="wd-type" className="mb-0">
                <Form.Select value={quiz.type || "GRADED_QUIZ"}
                  onChange={(e) => setQuiz({ ...quiz, type: e.target.value })}>
                  <option value="GRADED_QUIZ">Graded Quiz</option>
                  <option value="PRACTICE_QUIZ">Practice Quiz</option>
                  <option value="GRADED_SURVEY">Graded Survey</option>
                  <option value="UNGRADED_SURVEY">Ungraded Survey</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3 align-items-center">
            <Col xs={4} className="text-end pe-2">
              <Form.Label htmlFor="wd-group" className="mb-0">Assignment Group</Form.Label>
            </Col>
            <Col xs={8} md={6}>
              <Form.Group controlId="wd-group" className="mb-0">
                <Form.Select value={quiz.group || "QUIZZES"}
                  onChange={(e) => setQuiz({ ...quiz, group: e.target.value })}>
                  <option value="QUIZZES">Quizzes</option>
                  <option value="EXAMS">Exams</option>
                  <option value="ASSIGNMENTS">Assignments</option>
                  <option value="PROJECT">Project</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={4} className="text-end pe-2">
              <Form.Label className="mb-0 mt-3" htmlFor="wd-shuffle-answers">Details</Form.Label>
            </Col>
            <Col xs={8} md={6} className="border pb-2 pt-2 align-items-center">
              <Row className="mb-3">
                <div className="d-flex align-items-center">
                  <Form.Check type="checkbox" className="me-2" id="wd-shuffle-answers"
                    checked={quiz.shuffleAnswers || false}
                    onChange={(e) => setQuiz({ ...quiz, shuffleAnswers: e.target.checked })} />
                  <Form.Label htmlFor="wd-shuffle-answers" className="mb-0">
                    Shuffle Answers
                  </Form.Label>
                </div>
              </Row>
              <Row className="mb-3">
                <div className="d-flex align-items-center">
                  <Form.Check type="checkbox" className="me-2" id="wd-time-limit"
                    checked={quiz.timeLimit || false}
                    onChange={(e) => setQuiz({ ...quiz, timeLimit: e.target.checked })} />
                  <Form.Label htmlFor="wd-time-limit" className="mb-0">
                    Time Limit
                  </Form.Label>
                </div>
              </Row>
              {
                quiz.timeLimit &&
                (<Row className="mb-3">
                  <div className="d-flex align-items-center">
                    <Form.Control type="number" id="wd-mins" value={quiz.mins || 0}
                      onChange={(e) => setQuiz({ ...quiz, mins: parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : 0 })}
                      style={{ width: '100px' }} />
                    <Form.Label htmlFor="wd-mins" className="mb-0 me-2 ms-3">Minutes</Form.Label>
                  </div>
                </Row>)
              }
              <Row className="mb-3">
                <div className="d-flex align-items-center">
                  <Form.Check type="checkbox" className="me-2" id="wd-multiple-attempts"
                    checked={quiz.multipleAttempts || false}
                    onChange={(e) => setQuiz({ ...quiz, multipleAttempts: e.target.checked })} />
                  <Form.Label htmlFor="wd-multiple-attempts" className="mb-0">
                    Multiple Attempts
                  </Form.Label>
                </div>
              </Row>
              {
                quiz.multipleAttempts &&
                (<Row className="mb-3">
                  <div className="d-flex align-items-center">
                    <Form.Control type="number" id="wd-attempts" value={quiz.mins || 1}
                      onChange={(e) => setQuiz({ ...quiz, mins: parseInt(e.target.value) >= 1 ? parseInt(e.target.value) : 1 })}
                      style={{ width: '100px' }} />
                    <Form.Label htmlFor="wd-attempts" className="mb-0 me-2 ms-3">Attempts</Form.Label>
                  </div>
                </Row>)
              }
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={4} className="text-end pe-2">
              <Form.Label htmlFor="wd-show-correct" className="mb-0 mt-3">Show Correct</Form.Label>
            </Col>

            <Col xs={8} md={6} className="border pb-2 pt-2">
              <Form.Group controlId="wd-show-correct" className="mb-0">
                <Form.Select value={quiz.showCorrect || "IMMEDIATELY"}
                  onChange={(e) => setQuiz({ ...quiz, showCorrect: e.target.value })}>
                  <option value="NEVER">Never</option>
                  <option value="IMMEDIATELY">Immediately</option>
                  <option value="DATE">Date</option>
                </Form.Select>
              </Form.Group>

              {
                quiz.showCorrect === "DATE" &&
                <Form.Group controlId="wd-correct-date" className="mt-3">
                  <Form.Label className="fw-bold">Show</Form.Label>
                  <Form.Control type="datetime-local" value={formatLocalDateTime(quiz.showTime)}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      const dateString = newDate.toISOString().split('.')[0] + "+00:00";
                      setQuiz({ ...quiz, showTime: dateString });
                    }} />
                </Form.Group>
              }
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={4} className="text-end pe-2">
              <Form.Label htmlFor="wd-assign-to" className="mb-0 mt-3">Assign</Form.Label>
            </Col>
            <Col xs={8} md={6} className="border pb-2 pt-2">
              <Form.Group controlId="wd-assign-to" className="mb-3">
                <Form.Label className="fw-bold">Assign to</Form.Label>
                <Form.Control as="select" multiple value={quiz.assignTo || []}
                  onChange={(e) => {
                    const target = e.target as unknown as HTMLSelectElement;
                    const selectedValues = Array.from(target.selectedOptions, option => option.value) as any;
                    setQuiz({ ...quiz, assignTo: selectedValues });
                  }}>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="wd-due-date" className="mb-0">
                <Form.Label className="fw-bold">Due</Form.Label>
                <Form.Control type="datetime-local" value={formatLocalDateTime(quiz.due)}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    const dateString = newDate.toISOString().split('.')[0] + "+00:00";
                    setQuiz({ ...quiz, due: dateString });
                  }} />
              </Form.Group>
              <Row>
                <Col xs={6}>
                  <Form.Group controlId="wd-available-from" className="mb-0">
                    <Form.Label className="fw-bold">Available from</Form.Label>
                    <Form.Control type="datetime-local" value={formatLocalDateTime(quiz.from)}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        const dateString = newDate.toISOString().split('.')[0] + "+00:00";
                        setQuiz({ ...quiz, from: dateString });
                      }} />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group controlId="wd-available-until" className="mb-0">
                    <Form.Label className="fw-bold">Until</Form.Label>
                    <Form.Control type="datetime-local" value={formatLocalDateTime(quiz.until)}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        const dateString = newDate.toISOString().split('.')[0] + "+00:00";
                        setQuiz({ ...quiz, until: dateString });
                      }} />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="align-items-center mb-3">
            <Col xs={4} className="text-end pe-2 align-items-center">
              <Form.Label htmlFor="wd-access-code" className="mb-3">Access Code</Form.Label>
            </Col>
            <Col xs={8} md={6} className="text-end">
              <Form.Group className="mb-3" controlId="wd-access-code">
                <Form.Control value={quiz.accessCode || ''} placeholder="None"
                  onChange={(e) => setQuiz({ ...quiz, accessCode: e.target.value })} />
              </Form.Group>
            </Col>
          </Row>
          <hr />
          <Row className="mb-3">
            <Col xs={4}>
            </Col>
            <Col xs={8} md={6} className="text-end">
              <Link to={`/Kambaz/Courses/${cid}/Quizzes/`} id="wd-cancel"
              className="btn btn-secondary btn-lg me-2">Cancel</Link>
            <Button id="wd-save"
              className="btn btn-danger btn-lg me-2"
              onClick={() => {
                if (isNewQuiz) {
                  saveNewQuizHandler();
                } else {
                  updateQuizHandler();
                }
              }}>Save</Button>
            </Col>
          </Row>
        </Form>
      </Tab>
      <Tab eventKey="questions" title="Questions" className="justify-content-center mb-3">
        {
          quiz.questions.map((question: any) => {
            return (
              <div key={question._id} className="card mb-3 mx-auto" style={{ maxWidth: '800px' }}>
                <div className="card-body">
                  <QuestionEditor key={question._id} question={question}
                  updateQuestionHandler={updateQuestionHandler} deleteQuestionHandler={deleteQuestionHandler}/>
                </div>
              </div>
            );
          })
        }
        <div className="text-center">
          <Button variant="secondary" size="lg" className="me-1" id="wd-add-question-btn"
            onClick={createQuestionHandler} >
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
            New Question
          </Button>
        </div>
        <div className="clearfix"></div>
        <hr />
        <Row className="mb-3">
          <Col xs={4}>
          </Col>
          <Col xs={8} md={6} className="text-end">
            <Link to={`/Kambaz/Courses/${cid}/Quizzes/`} id="wd-cancel"
              className="btn btn-secondary btn-lg me-2">Cancel</Link>
            <Button id="wd-save"
              className="btn btn-danger btn-lg me-2"
              onClick={() => {
                if (isNewQuiz) {
                  saveNewQuizHandler();
                } else {
                  updateQuizHandler();
                }
              }}>Save</Button>
          </Col>
        </Row>
      </Tab>
    </Tabs>
    </>
  );
}
