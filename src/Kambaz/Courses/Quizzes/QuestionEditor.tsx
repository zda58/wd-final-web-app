import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

export default function QuestionEditor({ question, updateQuestionHandler, deleteQuestionHandler }: {
  question: any; updateQuestionHandler: (questionId: string, question: any) => void;
  deleteQuestionHandler: (questionId: string) => void;
}) {
  const [questionEdits, setQuestionEdits] = useState(structuredClone(question));
  const [editing, setEditing] = useState(false);

  const editHandler = () => {
    setEditing(true);
    setQuestionEdits(structuredClone(question));
  };

  const cancelEditHandler = () => {
    setEditing(false);
    setQuestionEdits(structuredClone(question));
  };

  const saveEditsHandler = () => {
    updateQuestionHandler(question._id, questionEdits);
    setEditing(false);
  };
  return (
    <Form>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <Form.Control
            type="text"
            placeholder="Question Title"
            value={questionEdits.title || ''}
            readOnly={!editing}
            onChange={(e) => setQuestionEdits({ ...questionEdits, title: e.target.value })}
            style={{ width: '300px' }}
            className="me-3" />
          <Form.Select
            value={questionEdits.type || 'MULTIPLE'}
            disabled={!editing}
            onChange={(e) => setQuestionEdits({ ...questionEdits, type: e.target.value })}
            style={{ width: '200px' }}>
            <option value="MULTIPLE">Multiple Choice</option>
            <option value="TRUEFALSE">True/False</option>
            <option value="FILLBLANK">Fill in the Blank</option>
          </Form.Select>
        </div>
        <div className="d-flex align-items-center">
          <Form.Label className="me-2 mb-0">Points:</Form.Label>
          <Form.Control
            type="number"
            min="0"
            value={questionEdits.points || 0}
            readOnly={!editing}
            onChange={(e) => setQuestionEdits({
              ...questionEdits,
              points: Math.max(0, parseInt(e.target.value) || 0)
            })}
            style={{ width: '80px' }} />
        </div>
      </div>

      Enter your question and answers
      <h4 className="fw-bold">Question:</h4>
      <Form.Group className="mb-3" controlId="wd-question">
        <Form.Control
          as="textarea"
          style={{ height: '150px', width: '500px' }}
          value={questionEdits.question || ''}
          readOnly={!editing}
          onChange={(e) => {
            setQuestionEdits({ ...questionEdits, question: e.target.value });
          }} />
      </Form.Group>
      {questionEdits.type === "MULTIPLE" &&
        (<>
          <h4 className="fw-bold">Multiple Answers:</h4>
          {questionEdits.multipleOpts.map((option: any) => (
            <Form.Group key={option._id} className="mb-2">
              <div className="d-flex align-items-center">
                <Form.Check
                  type="radio"
                  name="correctMultipleAnswer"
                  checked={questionEdits.multipleAnswerID === option._id}
                  disabled={!editing}
                  onChange={() => setQuestionEdits({ ...questionEdits, multipleAnswerID: option._id })}
                  className="me-2"
                />
                <Form.Control
                  type="text"
                  value={option.value}
                  readOnly={!editing}
                  onChange={(e) => {
                    const newOpts = questionEdits.multipleOpts.map((opt: any) =>
                      opt._id === option._id ? { ...option, value: e.target.value } : opt
                    );

                    setQuestionEdits({
                      ...questionEdits,
                      multipleOpts: newOpts,
                    });
                  }}
                  style={{ width: '400px' }}
                />
                {editing && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => {
                      const newOpts = questionEdits.multipleOpts.filter((opt: any) => opt._id !== option._id);
                      setQuestionEdits({ ...questionEdits, multipleOpts: newOpts });
                    }}>
                    Remove
                  </Button>
                )}
              </div>
            </Form.Group>
          ))}
          {editing && (
            <Button
              variant="primary"
              className="mb-3"
              size="sm"
              onClick={() => {
                setQuestionEdits({
                  ...questionEdits,
                  multipleOpts: [...questionEdits.multipleOpts, { _id: uuidv4(), value: "Option" }]
                });
              }}
            >
              Add Answer
            </Button>
          )}
        </>)}
      <div className="clearfix"></div>
      {questionEdits.type === "TRUEFALSE" &&
        (
          <>
            <h4 className="fw-bold">True False Answers:</h4>
            <Form.Group className="mb-2">
              <div className="d-flex align-items-center">
                <Form.Check
                  type="radio"
                  id="bool-true-option"
                  name="correctBoolAnswer"
                  checked={questionEdits.boolAnswer}
                  disabled={!editing}
                  onChange={() => {
                    setQuestionEdits({
                      ...questionEdits,
                      boolAnswer: true,
                    });
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
                  checked={!questionEdits.boolAnswer}
                  disabled={!editing}
                  onChange={() => {
                    setQuestionEdits({
                      ...questionEdits,
                      boolAnswer: false,
                    });
                  }}
                  className="me-2"
                />
                <label htmlFor="bool-false-option">False</label>
              </div>
            </Form.Group>
          </>
        )}
      {
        questionEdits.type === "FILLBLANK" &&
        (<>
          <h4 className="fw-bold">Blanks and Answers:</h4>
          {questionEdits.fillBlanks.map((blank: any, bIdx: number) => (
            <div key={bIdx}>
              <div className="fbquiz-label d-flex align-items-center">
                {editing ? (
                  <>
                  <Form.Label className="me-2">Label:</Form.Label>
                  <Form.Control 
                      type="text" 
                      value={blank.label}
                      className="me-2 w-50 mb-2"
                      onChange={(e) => {
                        const blanksBeingEdited = [...questionEdits.fillBlanks];
                        blanksBeingEdited[bIdx].label = e.target.value;
                        setQuestionEdits({
                          ...questionEdits,
                          fillBlanks: blanksBeingEdited,
                        });}
                      }
                      ></Form.Control>
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => {
                        const blanksBeingEdited = [...questionEdits.fillBlanks];
                          blanksBeingEdited.splice(bIdx, 1)
                          setQuestionEdits({
                            ...questionEdits,
                            fillBlanks: blanksBeingEdited,
                          });
                      }}>
                      Delete Blank
                    </Button>
                  </>
                ) : (
                  <h5>{blank.label}</h5>)
                }
              </div>
              <div className="fbquiz-answers mb-2">
                {blank.answers.map((ans: any, ansIdx: number) => (
                  <Form.Group key={`${bIdx}--${ansIdx}`}>
                    {editing ? (
                      <div className="d-flex align-items-center mb-2">
                      <Form.Control
                        type="text"
                        value={ans}
                        readOnly={!editing}
                        onChange={(e) => {
                          const blanksBeingEdited = [...questionEdits.fillBlanks];
                          blanksBeingEdited[bIdx].answers[ansIdx] = e.target.value;
                          setQuestionEdits({
                            ...questionEdits,
                            fillBlanks: blanksBeingEdited,
                          });
                        }}
                        style={{ width: '400px' }}
                      />
                      <Button
                      variant="danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => {
                        const blanksBeingEdited = [...questionEdits.fillBlanks];
                        blanksBeingEdited[bIdx].answers.splice(ansIdx, 1)
                        setQuestionEdits({
                            ...questionEdits,
                            fillBlanks: blanksBeingEdited,
                        });
                      }}>
                      Remove
                    </Button>
                    </div>
                    ) : (
                      <span className="text-success">{ans}</span>
                    )}
                  </Form.Group>
                ))}
              </div>
              {editing && (
                <Button
                  variant="primary"
                  className="mb-3"
                  size="sm"
                  onClick={() => {
                    const blanksBeingEdited = [...questionEdits.fillBlanks];
                    blanksBeingEdited[bIdx].answers.push("New Answer")
                    setQuestionEdits({
                        ...questionEdits,
                        fillBlanks: blanksBeingEdited,
                    });
                  }}
                >
                  Add Answer
                </Button>
              )}
            </div>
            // label + text entry box
            // text entry box for each answer
              // delete button for each answer
              // add new answer button
            // delete button for each blank
            // add new blank button
            
          ))
          }
          {editing && (
                <Button
                  variant="warning"
                  className="mb-3"
                  onClick={() => {
                    const blanksBeingEdited = [...questionEdits.fillBlanks];
                    blanksBeingEdited.push({_id: uuidv4(), label: "New Blank", answers:["Answer"]})
                    setQuestionEdits({
                        ...questionEdits,
                        fillBlanks: blanksBeingEdited,
                    });
                  }}
                >
                  Add Blank
                </Button>
              )}
        </>)

      }
      <div className="clearfix"></div>
      {editing &&
        <>
          <Button variant="secondary" onClick={cancelEditHandler} className="me-2">Cancel</Button>
          <Button variant="success" onClick={saveEditsHandler}>Update</Button>
        </>
      }
      {!editing && (
        <>
          <Button variant="warning" onClick={editHandler} className="me-2">Edit</Button>
          <Button variant="danger" onClick={() => deleteQuestionHandler(question._id)}>Delete Question</Button>
        </>
      )}
    </Form>
  );
}