import CourseNavigation from "./Navigation";
import { Navigate, Route, Routes, useParams, useLocation } from "react-router";
import Home from "./Home"
import Modules from "./Modules"
import Assignments from "./Assignments"
import AssignmentEditor from "./Assignments/Editor";
import PeopleTable from "./People/Table";
import { FaAlignJustify } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as userClient from "../Account/client";
import * as coursesClient from "./client"


export default function Courses() {
  const { cid } = useParams();
  const [courses, setCourses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const fetchCourses = async () => {
    try {
      const courses = await userClient.findMyCourses();
      setCourses(courses);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchUsers = async () => {
    try {
      if (!cid) return;
      const courseUsers = await coursesClient.findUsersForCourse(cid);
      setUsers(courseUsers);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCourses();
    fetchUsers();
  }, [currentUser]);

  const course = courses.find((course: any) => course._id === cid);
  const { pathname } = useLocation();
  return (
    <div id="wd-courses">
      <h2 className="text-danger"> <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course && course.name} &gt; {pathname.split("/")[4]}
      </h2>
      <div className="d-flex">
        <CourseNavigation />
        <div className="flex-fill">
          <Routes>
            <Route path="/" element={<Navigate to="Home" />} />
            <Route path="Home" element={<Home />} />
            <Route path="Modules" element={<Modules />} />
            <Route path="Piazza" element={<h2>Piazza</h2>} />
            <Route path="Zoom" element={<h2>Zoom</h2>} />
            <Route path="Assignments" element={<Assignments />} />
            <Route path="Assignments/:aid" element={<AssignmentEditor />} />
            <Route path="Quizzes" element={<h2>Quizzes</h2>} />
            <Route path="Grades" element={<h2>Grades</h2>} />
            <Route path="People" element={<PeopleTable users={users} />} />
          </Routes>
        </div></div>
    </div>
  );
}
