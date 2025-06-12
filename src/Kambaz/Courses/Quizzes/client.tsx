import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

export const deleteQuiz = async (quizID: string) => {
  const { data } = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizID}`);
  return data;
};

export const updateQuiz = async (quiz: any) => {
  const { data } = await axiosWithCredentials.put(`${QUIZZES_API}/${quiz._id}`, quiz);
  return data;
};

export const fetchQuizAttempts = async (qid: string, uid: string) => {
  const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/${qid}/attempts/${uid}`)
  return data;
};

export const recordUserAttempt = async (attempt: any) => {
  const { data } = await axiosWithCredentials.post(
    `${QUIZZES_API}/${attempt.quizID}/attempts/${attempt.userID}`,
    attempt
  );
  return data;
}