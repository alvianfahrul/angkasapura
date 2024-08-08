import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import LoginPage from "./pages/Login";
import ChangePasswordPage from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import DataPas from "./pages/DataPas";
import ScanPage from "./pages/Scan";
import LogAkses from "./pages/LogAkses";
import RegisterPage from "./pages/Register";
import Personal from "./pages/Personal";

const App = () => {
  return (
    <div className="wrapper">
      <BrowserRouter basename="/angkasapura">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/apdashboard" element={<Dashboard />} />
          <Route path="/datapas" element={<DataPas />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/logakses" element={<LogAkses />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/datapersonal" element={<Personal />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
        {/* <RefreshOnNavigate /> */}
      </BrowserRouter>
    </div>
  );
};

/* const RefreshOnNavigate = () => {
  const location = useLocation();
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPathname) {
      window.location.reload();
      setPrevPathname(location.pathname);
    }
  }, [location, prevPathname]);

  return null;
}; */

export default App;
