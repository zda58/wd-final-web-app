import { useState } from "react";
export default function ArrayStateVariable() {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  const deleteElement = (index: number) => {
    setArray(array.filter((_, i) => i !== index));
  };
  return (
    <div id="wd-array-state-variables">
      <h2>Array State Variable</h2>
      <button onClick={addElement} className="btn btn-success border-0 rounded mb-2">Add Element</button>
      <ul className="list-unstyled" style={{width: "200px"}}>
        {array.map((item, index) => (
          <li key={index} className="border rounded p-2 mb-2 d-flex justify-content-between align-items-center">
            <span>{item}</span>
            <button className="btn btn-danger border-0 rounded" onClick={() => deleteElement(index)}>
              Delete
            </button>
          </li>
        ))}
      </ul><hr />
    </div>
  );
}