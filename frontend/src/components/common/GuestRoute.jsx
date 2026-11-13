
import { Navigate, Outlet } from "react-router-dom";

function GuestRoute() {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
