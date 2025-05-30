import { useState } from "react";
import { Button, Form } from "react-bootstrap";
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

      Enter your question and multiple answers, then select the one correct answer.
      <h4 className="fw-bold  ">Question:</h4>
      <Form.Group className="mb-3" controlId="wd-description">
        <Form.Control
          as="textarea"
          style={{ height: '150px', width: '500px' }}
          value={questionEdits.description || ''}
          readOnly={!editing}
          onChange={(e) => {
            setQuestionEdits({ ...questionEdits, description: e.target.value });
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
              variant="secondary"
              className="mb-3"
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
          <h4 className="fw-bold">Fill in the Blank Answers:</h4>
          {
            questionEdits.fillAnswers.map((option: any, index: number) => (
              <Form.Group key={option._id} className="mb-2">
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="text"
                    value={option}
                    readOnly={!editing}
                    onChange={(e) => {
                      const newFillAnswers = questionEdits.fillAnswers;
                      newFillAnswers[index] = e.target.value;
                      setQuestionEdits({
                        ...questionEdits,
                        fillAnswers: newFillAnswers,
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
                        const newFillAnswers = questionEdits.fillAnswers.splice(index, 1)
                        setQuestionEdits({ ...questionEdits, multipleOpts: newFillAnswers });
                      }}>
                      Remove
                    </Button>
                  )}
                </div>
              </Form.Group>
            ))}
          {editing && (
            <Button
              variant="secondary"
              className="mb-3"
              onClick={() => {
                setQuestionEdits({
                  ...questionEdits,
                  fillAnswers: [...questionEdits.fillAnswers, "New Answer"]
                });
              }}
            >
              Add Answer
            </Button>
          )}
        </>)

      }
      <div className="clearfix"></div>
      {editing &&
        <>
          <Button onClick={cancelEditHandler}>Cancel</Button>
          <Button onClick={saveEditsHandler}>Update</Button>
        </>
      }
      {!editing && (
        <>
          <Button onClick={editHandler}>Edit</Button>
          <Button onClick={() => deleteQuestionHandler(question._id)}>Delete Question</Button>
        </>
      )}
    </Form>
  );
}