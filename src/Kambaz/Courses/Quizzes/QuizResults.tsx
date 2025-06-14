import { useEffect } from "react";
import { Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";

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
      //return "testing breakpoint";
      return answer.fillAnswers;
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
          return evaluateCorrect(q);
        }
        return false;
      })) score += q.points;
    });
    return score;
  };

  const evaluateCorrect = (curQuestion: any) => {
    // check correctness of other questions normally
    if (curQuestion.type !== "FILLBLANK") return getCorrectAnswersForQuestion(curQuestion).includes(getUserAnswerForQuestion(curQuestion));;
    // check whether each blank is correct. if any are wrong, return false
    const userAnswers = getUserAnswerForQuestion(curQuestion);
    const blanks = curQuestion.fillBlanks;
    let correct = true;
    if (!userAnswers) return false;
    blanks.forEach((blank: any) => {
      const userResponse = userAnswers.find((ans: any) => ans.blankId === blank._id);
      if (!userResponse) correct = false;
      const blankAnswers = blank.answers.map((b: any) => b.toLowerCase())
      if (!blankAnswers.includes(userResponse.fillAnswer.toLowerCase())) correct = false;
    })
    return correct;
  }

  if (!quiz) return;

  return (
    <>
      <Row className="mx-auto" style={{ maxWidth: '800px' }}>
      <h4 className="mt-5">{quiz.title}</h4>
      <h5 className="m-3">Score: {calculateAttemptScore(attempt.originalQuestions, attempt.answers)} / {attempt.originalQuestions.reduce(
                (total: number, question: any) => total + (question.points || 0)
                , 0) || 0} </h5>
      <h5 className="m-3">
        Finished: {formatDate(new Date(attempt.attemptEndTime))}
      </h5>
      </Row>
      {
        attempt.originalQuestions.map((curQuestion: any, questionIdx: number) => {
          const isCorrect = evaluateCorrect(curQuestion);
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
                  <Row className="ms-3 fw-bold">
                    Blanks:
                  </Row>
                  {curQuestion.fillBlanks.map((blank: any) => (
                    <div className="mt-4">
                    <div className="mx-3 mb-1">{blank.label}</div>
                    <Form.Control
                      type="text"
                      value={ getUserAnswerForQuestion(curQuestion) ? (
                      getUserAnswerForQuestion(curQuestion).find((ans: any) => blank._id === ans.blankId)
                      ? 
                      getUserAnswerForQuestion(curQuestion).find((ans: any) => blank._id === ans.blankId).fillAnswer 
                      : 
                      "") : ""}
                      className="ms-4"
                      style={{ width: '400px' }}
                      readOnly={true} />
                    <div className="mt-3 ms-3 mb-2">
                      <span className="badge bg-success">Correct Answers:</span>
                    </div>
                    {blank.answers.map((ans: any, idx: number) =>{
                      return (
                        <div key={idx} className=" mt-2 ms-3">
                          "{ans}"
                        </div>
                      )
                    })}
                    </div>
                  ))}
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