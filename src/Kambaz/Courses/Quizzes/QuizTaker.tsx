import { useSelector } from "react-redux";
import { useParams } from "react-router";

export default function QuizTaker() {
  //const { cid, qid } = useParams();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const saveRecentAttemptHandler = (attempt: any) => {

  };

  return (<>taker</>);
}