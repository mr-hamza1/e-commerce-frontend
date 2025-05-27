import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = ({ children, user, redirect = "/", adminOnly, admin }) => {
  if (!user) return <Navigate to={redirect} />;

  if(adminOnly && !admin) return <Navigate to={redirect} />;

  return children ? children : <Outlet />;
};

export default ProtectRoute;