import { Button, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as client from "./client";

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const fetchProfile = () => {
    if (!currentUser) return navigate("/Kambaz/Account/Signin");
    setProfile(currentUser);
  };
  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    navigate("/Kambaz/Account/Signin");
  };
  useEffect(() => { fetchProfile(); }, []);

  const updateProfile = async () => {
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile));
  };
  return (
    <div id="wd-profile-screen">
      {profile && (
        <div>
          <FormControl placeholder="username" value={profile.username} id="wd-username" className="mb-2"
            onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
          <FormControl placeholder="password" value={profile.password} id="wd-password" className="mb-2"
            onChange={(e) => setProfile({ ...profile, password: e.target.value })} />
          <FormControl placeholder="first name" value={profile.firstName} id="wd-firstname" className="mb-2"
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
          <FormControl placeholder="last name" value={profile.lastName} id="wd-lastname" className="mb-2"
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
          <FormControl value={profile.dob} id="wd-dob" className="mb-2"
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })} type="date" />
          <FormControl placeholder="email" value={profile.email} id="wd-email" className="mb-2"
            onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          <select value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })}
            className="form-control mb-2" id="wd-role">
            <option value="TA">Assistants</option>            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>      <option value="STUDENT">Student</option>
          </select>
          <button onClick={updateProfile} className="btn btn-primary w-100 mb-2"> Update </button>
          <Button onClick={signout} className="w-100 mb-2" id="wd-signout-btn">
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
}
