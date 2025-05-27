import { Button } from "react-bootstrap";
import { FaBell, FaBullhorn, FaCheckCircle, FaHome } from "react-icons/fa";
import { BiImport } from "react-icons/bi";
import { LiaFileImportSolid } from "react-icons/lia";
import { MdDoNotDisturbAlt, MdOutlineBarChart } from "react-icons/md";

export default function CourseStatus() {
  return (
    <div id="wd-course-status" style={{ width: "350px" }}>
      <h2>Course Status</h2>
      <div className="d-flex">
        <div className="w-50 pe-1">
          <Button variant="secondary" size="lg" className="w-100 text-nowrap ">
            <MdDoNotDisturbAlt className="me-2 fs-5" /> Unpublish </Button> </div>
        <div className="w-50">
          <Button variant="success" size="lg" className="w-100">
            <FaCheckCircle className="me-2 fs-5" /> Publish </Button> </div>
      </div>
      <br />
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <BiImport className="me-2 fs-5" /> Import Existing Content </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <LiaFileImportSolid className="me-2 fs-5" /> Import from Commons </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <FaHome className="me-2 fs-5" /> Choose Home Page </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <MdOutlineBarChart className="me-2 fs-5" /> View Course Stream </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <FaBullhorn className="me-2 fs-5" /> New Announcements </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <MdOutlineBarChart className="me-2 fs-5" /> New Analytics </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <FaBell className="me-2 fs-5" /> View Course Notifications </Button>
    </div>);
}