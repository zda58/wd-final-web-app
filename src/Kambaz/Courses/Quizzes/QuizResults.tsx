import { useEffect } from "react";
import { Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";

export default function QuizResults({ attempt, quiz }:
  { attempt: any; quiz: any; }) {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (!attempt || !quiz) {
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`);
      return;
    }
  }, [attempt, quiz]);

  const getUserAnswerForQuestion = (question: any) => {
    if (!attempt) return;
    const answer = attempt.answers.find((a: any) => a.questionID === question._id);
    if (!answer) return answer;
    if (question.type === "MULTIPLE") {
      return answer.multipleAnswerID;
    } else if (question.type === "TRUEFALSE") {
      return answer.boolAnswer;
    } else if (question.type === "FILLBLANK") {
      return answer.fillAnswer.toString().toLowerCase();
    }
  };

  const getCorrectAnswersForQuestion = (question: any) => {
    if (question.type === "MULTIPLE") {
      return [question.multipleAnswerID];
    } else if (question.type === "TRUEFALSE") {
      return [question.boolAnswer];
    } else if (question.type === "FILLBLANK") {
      return question.fillAnswers.map((q: string) => q.toLowerCase()) || [];
    }
  };

  if (!quiz) return;

  return (
    <>
      {
        quiz.questions.map((curQuestion: any, questionIdx: number) => {
          const isCorrect =
            getCorrectAnswersForQuestion(curQuestion).includes(getUserAnswerForQuestion(curQuestion));
            console.log("correct, ", getCorrectAnswersForQuestion(curQuestion))
            console.log("user: ", getUserAnswerForQuestion(curQuestion))
          return (
            <Row key={curQuestion._id} className="border mx-auto m-5 pb-3" style={{ maxWidth: '800px' }}>
              <div className="bg-secondary p-2 border border-bottom-0 mb-3 d-flex justify-content-between">
                <div className="d-flex align-items-center">
                <h5 className="m-2">Question {questionIdx + 1} </h5>
                {
                  isCorrect ? <span className="badge bg-success ms-1">Correct!</span> :
                  <span className="badge bg-danger ms-1">Wrong!</span>
                }
                </div>
                <h5 className="d-flex align-items-center me-3">
                  {isCorrect ? curQuestion.points : "0"} / {curQuestion.points} pts
                </h5>
              </div>
              <Row>
                <div className="d-flex align-items-center m-3">
                  <span className="fw-bold me-2">Title:</span>{curQuestion.title}
                </div>
              </Row>
              <Row className="ms-3 mb-3 fw-bold">
                Description:
              </Row>
              <Row className="ms-4 mb-3">
                {curQuestion.question}
              </Row>
              {curQuestion.type === "MULTIPLE" &&
                (<>
                  {curQuestion.multipleOpts.map((option: any) => (
                    <Form.Group key={option._id} className="mb-2">
                      <div className="d-flex align-items-center">
                        <Form.Check
                          type="radio"
                          id={`wd-multiple-${option._id}`}
                          name="correctMultipleAnswer"
                          checked={getUserAnswerForQuestion(curQuestion) === option._id}
                          className="me-2"
                          readOnly={true} />
                        <label htmlFor={`wd-multiple-${option._id}`}>
                          {option.value}
                          {
                            (getCorrectAnswersForQuestion(curQuestion)[0] === option._id) &&
                            <span className="badge bg-success ms-1">Correct Answer</span>
                          }
                        </label>
                      </div>
                    </Form.Group>
                  ))}
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
                          checked={getUserAnswerForQuestion(curQuestion) === true}
                          className="me-2"
                          readOnly={true} />
                        <label htmlFor="bool-true-option">
                          True
                          {
                            (getCorrectAnswersForQuestion(curQuestion)[0] === true) &&
                            <span className="badge bg-success ms-1">Correct Answer</span>
                          }
                        </label>
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <div className="d-flex align-items-center">
                        <Form.Check
                          type="radio"
                          id="bool-false-option"
                          name="correctBoolAnswer"
                          checked={getUserAnswerForQuestion(curQuestion) === false}
                          className="me-2"
                          readOnly={true} />
                        <label htmlFor="bool-false-option">
                          False
                          {
                            (getCorrectAnswersForQuestion(curQuestion)[0] === false) &&
                            <span className="badge bg-success ms-1">Correct Answer</span>
                          }
                        </label>
                      </div>
                    </Form.Group>
                  </>
                )}
              {
                curQuestion.type === "FILLBLANK" &&
                (<>
                  <Form.Control
                    type="text"
                    value={getUserAnswerForQuestion(curQuestion)}
                    className="ms-4"
                    style={{ width: '400px' }}
                    readOnly={true} />
                  <div className="mt-3 ms-3 mb-2">
                    <span className="badge bg-success">Correct Answers:</span>
                  </div>
                  {curQuestion.fillAnswers.map((a: any, idx: number) => {
                    return (
                      <div key={idx} className=" mt-2 ms-3">
                        "{a}"
                      </div>
                    );
                  })}
                </>)
              }
              <div className="clearfix"></div>
            </Row>
          );
        })}
      <br />
    </>
  );
};