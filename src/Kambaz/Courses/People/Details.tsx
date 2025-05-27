import { useEffect, useState } from "react";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useParams, useNavigate } from "react-router";
import * as client from "../../Account/client";
import { FormControl } from "react-bootstrap";
import { FaPencil } from "react-icons/fa6";
export default function PeopleDetails() {
  const { uid } = useParams();
  const [user, setUser] = useState<any>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [editing, setEditing] = useState(false);

  const saveUser = async () => {
    const [firstName, lastName] = name.split(" ").filter((n) => n.length > 0);
    const updatedUser = { ...user, firstName, lastName, email, role };
    await client.updateUser(updatedUser);
    setUser(updatedUser);
    setEditing(false);
    navigate(-1);
  };

  const navigate = useNavigate();
  const fetchUser = async () => {
    if (!uid) return;
    const user = await client.findUserById(uid);
    setUser(user);
    setName(`${user.firstName} ${user.lastName}`);
    setEmail(user.email);
    setRole(user.role);
  };
  const deleteUser = async (uid: string) => {
    await client.deleteUser(uid);
    navigate(-1);
  };

  useEffect(() => {
    if (uid) fetchUser();
    setName(`${user.firstName} ${user.lastName}`);
    setEmail(user.email);
    setRole(user.role);
  }, [uid]);
  if (!uid) return null;
  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      <button onClick={() => navigate(-1)} className="btn position-fixed end-0 top-0 wd-close-details">
        <IoCloseSharp className="fs-1" /> </button>
      <div className="text-center mt-2"> <FaUserCircle className="text-secondary me-2 fs-1" /> </div><hr />
      <div className="text-danger fs-4">
        {!editing && (
          <FaPencil onClick={() => setEditing(true)}
              className="float-end fs-5 mt-2 wd-edit" /> )}
        {editing && (
          <FaCheck onClick={() => saveUser()}
              className="float-end fs-5 mt-2 me-2 wd-save" /> )}
        {!editing && (
          <div className="wd-name"
               onClick={() => setEditing(true)}>
            {user.firstName} {user.lastName}</div>)}
        {user && editing && (
          <FormControl className="w-50 wd-edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { saveUser(); }}}/>)}
      </div>
      <b>Email:</b>           <span className="wd-email">
      {!editing && (
          <span className="wd-email"
               onClick={() => setEditing(true)}>
            {user.email}</span>)}
        {user && editing && (
          <FormControl type="email" className="w-50 wd-edit-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { saveUser(); }}}/>)}  
      </span> <br />
      <b>Roles:</b>           <span className="wd-roles">
        {!editing && (
          <span className="wd-role"
               onClick={() => setEditing(true)}>
            {user.role}</span>)}
        {user && editing && (
          <select value={role}
            onChange={(e) => setRole(e.target.value)}
            className="wd-edit-role form-control mb-2">
            <option value="ADMIN">Admin</option>
            <option value="TA">Assistants</option>
            <option value="FACULTY">Faculty</option>
            <option value="STUDENT">Student</option>
          </select>
        )}
      </span> <br />
      <b>Login ID:</b>        <span className="wd-login-id">      {user.loginId}      </span> <br />
      <b>Section:</b>         <span className="wd-section">       {user.section}      </span> <br />
      <b>Total Activity:</b>  <span className="wd-total-activity">{user.totalActivity}</span>
      <hr />
      
      <button onClick={() => deleteUser(uid)} className="btn btn-danger float-end wd-delete" > Delete </button>
      <button onClick={() => navigate(-1)}
              className="btn btn-secondary float-start float-end me-2 wd-cancel" > Cancel </button>
  </div>);
}