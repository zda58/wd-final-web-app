import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import * as client from "./client";


export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signin = async () => {
    const user =  await client.signin(credentials);
    if (!user) return;
    dispatch(setCurrentUser(user));
    navigate("/Kambaz/Dashboard");
  };

  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      <Form.Control defaultValue={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} id="wd-username" placeholder="username" className="mb-2" />
      <Form.Control defaultValue={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        id="wd-password" placeholder="password" type="password" className="mb-2" />
      <Button onClick={signin} id="wd-signin-btn" className="w-100" > Sign in </Button>
      <Link id="wd-signup-link" to="/Kambaz/Account/Signup">Sign up</Link>
    </div>
  );
}