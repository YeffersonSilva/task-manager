import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contex/AuthContext";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user } = useContext(AuthContext);

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
