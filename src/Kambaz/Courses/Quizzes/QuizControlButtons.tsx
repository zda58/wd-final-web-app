import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { FcCancel } from "react-icons/fc";
import { Dropdown } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";

export default function QuizControlButtons({ quiz, deleteQuiz, setQuizPublished }:
  { quiz: any; deleteQuiz: (quizID: string) => void; setQuizPublished: (quizID: string, published: boolean) => void; }) {
  const { cid } = useParams();

  const navigate = useNavigate();
  return (
    <div className="float-end d-flex">
      {
        quiz.published ? <GreenCheckmark /> : <FcCancel className="fs-3" />
      }
      <Dropdown>
        <Dropdown.Toggle variant="link" className="p-0 border-0 text-dark" bsPrefix="custom-toggle">
          <IoEllipsisVertical className="fs-4" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => navigate(`Kambaz/Courses/${cid}/Quizzes/${quiz._id}/edit`)}>
            Edit
          </Dropdown.Item>
          <Dropdown.Item onClick={() => deleteQuiz(quiz._id)}>
            Delete
          </Dropdown.Item>
          {!quiz.published &&
            <Dropdown.Item onClick={() => setQuizPublished(quiz._id, true)}>
              Publish
            </Dropdown.Item>}
            {quiz.published &&
            <Dropdown.Item onClick={() => setQuizPublished(quiz._id, false)}>
              Unpublish
            </Dropdown.Item>}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}