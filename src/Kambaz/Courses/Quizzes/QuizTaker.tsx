import { Link, useNavigate, useParams } from "react-router";
import * as coursesClient from "../client";
import { useDispatch, useSelector } from "react-redux";
import { setQuizzes } from "./reducer";
import { useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";



export default function QuizTaker(
  { answers, setAnswerHandler, finishQuizHandler }:
    {
      answers: any[];
      setAnswerHandler: (qid: string, answer: any) => void;
      finishQuizHandler: (endTime: Date) => void;
    }
) {
  const { cid, qid, questionNum } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);

  const fetchQuizzes = async () => {
    if (!cid) return;
    const updatedQuizzes =
      await coursesClient.findQuizzesForCourse(cid);
    dispatch(setQuizzes(updatedQuizzes));
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const getAnswerForQuestion = (question: any) => {
    const answer = answers.find((a: any) => a.questionID === question._id);
    if (!answer) return answer;
    if (question.type === "MULTIPLE") {
      return answer.multipleAnswerID;
    } else if (question.type === "TRUEFALSE") {
      return answer.boolAnswer;
    } else if (question.type === "FILLBLANK") {
      return answer.fillAnswer;
    }
  };

  const quiz = quizzes.find((q: any) => q._id === qid);
  const questionIdx = parseInt(questionNum || "0");

  useEffect(() => {
    if (!quiz || quiz.questions.length === 0) return;

    if (questionNum === undefined) {
      navigate(`../question/0`, { replace: true });
      return;
    }

    if (isNaN(questionIdx) || questionIdx < 0 || questionIdx >= quiz.questions.length) {
      navigate(`../question/0`, { replace: true });
    }
  }, [questionNum, questionIdx, quiz]);

  if (!quiz) return null;

  const curQuestion = quiz.questions[questionIdx];

  const shuffleAnswerList = (array: any) => {
    if (!quiz.shuffleAnswers) return array;
    for (let i = 0; i < array.length; ++i) {
      const j = Math.floor(Math.random() * (array.length - i)) + i;
      if (j === i) continue;
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  return (
    <Row>
      <Col className="border border-3 m-3 p-5">
        <h4>Q1 - HTML</h4>
        <h4>Quiz Instructions</h4>
        <hr />
        <Row className="border mx-auto m-5 pb-3" style={{ maxWidth: '800px' }}>
          <div className="bg-secondary p-2 border border-bottom-0 mb-3 d-flex justify-content-between">
            <h5 className="m-2">Question {questionIdx + 1} </h5>
            <h5 className="d-flex align-items-center me-3">
              {curQuestion.points} pts
            </h5>
          </div>
          <Row>
            <div className="d-flex align-items-center m-3">
              {curQuestion.title}
            </div>
          </Row>
          <Row className="ms-4 mb-3">
            {curQuestion.question}
          </Row>
          {curQuestion.type === "MULTIPLE" &&
            (<>
              {shuffleAnswerList(curQuestion.multipleOpts.map((option: any) => (
                <Form.Group key={option._id} className="mb-2">
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="radio"
                      id={`wd-multiple-${option._id}`}
                      name="correctMultipleAnswer"
                      checked={getAnswerForQuestion(curQuestion) === option._id}
                      onChange={() => {
                        setAnswerHandler(curQuestion._id, option._id);
                      }}
                      className="me-2"
                    />
                    <label htmlFor={`wd-multiple-${option._id}`}>{option.value}</label>
                  </div>
                </Form.Group>
              )))}
            </>)}

          <div className="clearfix"></div>
          {curQuestion.type === "TRUEFALSE" &&
            (
              <>
                <Form.Group className="mb-2">
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="radio"
                      id="bool-true-option"
                      name="correctBoolAnswer"
                      checked={getAnswerForQuestion(curQuestion) === true}
                      onChange={() => {
                        setAnswerHandler(curQuestion._id, true);
                      }}
                      className="me-2"
                    />
                    <label htmlFor="bool-true-option">True</label>
                  </div>
                </Form.Group>
                <Form.Group className="mb-2">
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="radio"
                      id="bool-false-option"
                      name="correctBoolAnswer"
                      checked={getAnswerForQuestion(curQuestion) === false}
                      onChange={() => {
                        setAnswerHandler(curQuestion._id, false);
                      }}
                      className="me-2"
                    />
                    <label htmlFor="bool-false-option">False</label>
                  </div>
                </Form.Group>
              </>
            )}
          {
            curQuestion.type === "FILLBLANK" &&
            (<>
              <Form.Control
                type="text"
                value={getAnswerForQuestion(curQuestion)}
                onChange={(e) => {
                  setAnswerHandler(curQuestion._id, e.target.value);
                }}
                className="ms-4"
                style={{ width: '400px' }}
              />
            </>)

          }
          <div className="clearfix"></div>
        </Row>
        {
          (questionIdx < quiz.questions.length - 1) &&
          <Row className="mx-auto m-5" style={{ maxWidth: '800px' }}>
            <div className="d-flex justify-content-end">
              <Link className="btn btn-lg btn-secondary me-1" id="wd-next-btn"
                to={`../question/${questionIdx + 1}`} replace={true} >
                Next
              </Link>
            </div>
          </Row>
        }
        <Row className="mx-auto m-5 border p-3" style={{ maxWidth: '800px' }}>
          <div className="d-flex justify-content-end align-items-center">
            <div className="m-3">
            </div>
            <Button size="lg" variant="secondary" className="me-1" id="wd-submit-btn"
              onClick={() => {
                finishQuizHandler(new Date());
              }}>
              Submit Quiz
            </Button>
          </div>
        </Row>
        <Row className="mx-auto m-5 p-3" style={{ maxWidth: '800px' }}>
          <h5>Questions</h5>
          {
            quiz.questions.map((q: any, index: number) => {
              const answer = answers.find((a) => a.questionID === q._id);
              return (
                <Link key={q._id} className="text-danger" to={`../question/${index}`} replace={true}>
                  {answer ? <FaCheck /> : <MdOutlineCancel />}
                  {' '}Question {index + 1}
                </Link>
              );
            })
          }
        </Row>
      </Col>
      <Col xs={4}>
      </Col>
    </Row>
  );
};