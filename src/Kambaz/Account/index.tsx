import { Routes, Route, Navigate, Link } from "react-router";
import Signin from "./Signin";
import Profile from "./Profile";
import Signup from "./Signup";
import AccountNavigation from "./Navigation";
import { useSelector } from "react-redux";
import Users from "./Users";
export default function Account() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  return (
    <div id="wd-account-screen">
      <table>
        <tbody>
          <tr>
            <td valign="top">
              <AccountNavigation />
            </td>
            <td valign="top">
              <Routes>
                <Route path="/" element={<Navigate to={currentUser ? "/Kambaz/Account/Profile" : "/Kambaz/Account/Signin"} />} />
                <Route path="/Signin" element={<Signin />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Signup" element={<Signup />} />
                <Route path="/Users" element={<Users />} />
                <Route path="/Users/:uid" element={<Users />} />
              </Routes>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="text-center bottom-0 start-0 end-0 position-fixed mb-5 fs-1">
        Alex Xie - Sec 4 <br />
        Pauline Saveliev - Sec 4 <br />
        <Link to={"https://github.com/zda58/wd-final-web-app"}>Web App Link</Link><br />
        <Link to={"https://github.com/zda58/wd-final-server-app"}>Server App Link</Link><br />
      </div>
    </div>
  );
}
