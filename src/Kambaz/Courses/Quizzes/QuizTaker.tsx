

export default function QuizTaker(
  { quiz, answers, setAnswerHandler, finishQuizHandler } :
  { quiz: any;
    answers: any[];
    setAnswerHandler: (qid: string, answer: any) => void;
    finishQuizHandler: () => void;
  }
) {
  return (
    <>
    {JSON.stringify(quiz)}
    </>
  );
};