import { Outlet } from "react-router-dom";
import UserSidebar from "../sidebar/UserSidebar";

const UserLayout = () => {
  return (
    <div
      style={{
        padding: "50px 0px 0px 370px",
      }}
    >
      <UserSidebar />
      <Outlet />
    </div>
  );
};

export default UserLayout;
