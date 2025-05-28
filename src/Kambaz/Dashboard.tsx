import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router"
import { useSelector } from "react-redux";
import { RoleRoute } from "./Account/ProtectedRoute";
import { useEffect, useState } from "react";
import * as userClient from "./Account/client";
import * as courseClient from "./Courses/client";

export default function Dashboard() {
  const [course, setCourse] = useState<any>({
    name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15", description: "New Description",
  });
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const findCoursesForUser = async () => {
    try {
      const foundCourses = await userClient.findCoursesForUser(currentUser._id);
      setCourses(foundCourses.map((c: any) => ({ ...c, enrolled: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCourses = async () => {
    try {
      const allCourses = await courseClient.fetchAllCourses();
      const enrolledCourses = await userClient.findCoursesForUser(
        currentUser._id
      );
      const courses = allCourses.map((course: any) => {
        if (enrolledCourses.find((c: any) => c._id === course._id)) {
          return { ...course, enrolled: true };
        } else {
          return course;
        }
      });
      setCourses(courses);
    } catch (error) {
      console.error(error);
    }
  };

  const updateEnrollment = async (courseId: string, enrolled: boolean) => {
    if (enrolled) {
      await userClient.enrollIntoCourse(currentUser._id, courseId);
    } else {
      await userClient.unenrollFromCourse(currentUser._id, courseId);
    }
    setCourses(
      courses.map((course: any) => {
        if (course._id === courseId) {
          return { ...course, enrolled: enrolled };
        } else {
          return course;
        }
      })
    );
  };


  useEffect(() => {
    if (enrolling) {
      fetchCourses();
    } else {
      findCoursesForUser();
    }
  }, [currentUser, enrolling]);


  const addNewCourse = async () => {
    const newCourse = await courseClient.createCourse(course);
    const newEnrolled = { ...newCourse, enrolled: true };
    setCourses([...courses, newEnrolled]);
  };

  const deleteCourse = async (courseId: string) => {
    await courseClient.deleteCourse(courseId);
    setCourses(courses.filter((course: any) => course._id !== courseId));
  };

  const updateCourse = async () => {
    await courseClient.updateCourse(course);
    setCourses(courses.map((c: any) => {
      if (c._id === course._id) { return course; }
      else { return c; }
    }));
  };

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <RoleRoute roles={["FACULTY"]}>
        <h5>New Course
          <button className="btn btn-primary float-end"
            id="wd-add-new-course-click"
            onClick={() => addNewCourse()} > Add </button>
          <button className="btn btn-warning float-end me-2"
            onClick={() => updateCourse()} id="wd-update-course-click">
            Update
          </button>
        </h5><br />
        <br />
        <Form.Control value={course.name} className="mb-2"
          onChange={(e) => setCourse({ ...course, name: e.target.value })} />
        <Form.Control as="textarea" value={course.description} rows={3}
          onChange={(e) => setCourse({ ...course, description: e.target.value })} />
        <hr />
      </RoleRoute>
      <div className="d-flex justify-content-between">
        <h2 id="wd-dashboard-published">{enrolling ? "All Courses" : "My Courses"} ({courses.length})
        </h2>
        <button className="btn btn-primary float-end me-2"
          onClick={() => {
            setEnrolling(!enrolling)
          }} id="wd-update-enrollment-click">
          {enrolling ? "My courses" : "All Courses"}
        </button>
      </div>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {courses.map((course: any) => {
            return (
              <Col className="wd-dashboard-course" style={{ width: "350px" }}>
                <Card>
                  <Link to={course.enrolled ? `/Kambaz/Courses/${course._id}/Home` : ''}
                    className="wd-dashboard-course-link text-decoration-none text-dark" >
                    <Card.Img src={
                      course.image ? course.image : "/vite.svg"
                    } variant="top" width="100%" height={160} />
                    <Card.Body className="card-body">
                      <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        {course.name} </Card.Title>
                      <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                        {course.description} </Card.Text>
                      <Button variant={course.enrolled ? "primary" : "secondary"}> Go </Button>

                      <RoleRoute roles={["FACULTY"]}>
                        <button onClick={(event) => {
                          event.preventDefault();
                          deleteCourse(course._id);
                        }} className="btn btn-danger float-end"
                          id="wd-delete-course-click">
                          Delete
                        </button>
                        <button id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className="btn btn-warning me-2 float-end" >
                          Edit
                        </button>
                      </RoleRoute>
                      {enrolling &&
                        <button id="wd-toggle-enrollment-click"
                          onClick={(event) => {
                            event.preventDefault();
                            updateEnrollment(course._id, !course.enrolled);
                          }}
                          className={`btn ${course.enrolled ? 'btn-danger' : 'btn-success'} me-2 float-end`} disabled={currentUser.role == "ADMIN"}>
                          {course.enrolled ? 'Unenroll' : 'Enroll'}
                        </button>
                      }
                    </Card.Body>
                  </Link>
                </Card>
              </Col>
            )
          })}
        </Row>
      </div>
    </div>
  );
}
