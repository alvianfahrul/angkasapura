import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ChangePasswordBody from "../components/ChangePasswordBody";
import Sidebar from "../components/Sidebar";

function ChangePassword() {
  const [auth, setAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [nama, setNama] = useState("");
  const [nip, setNip] = useState("");
  const [unit, setUnit] = useState("");

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL).then((res) => {
      if (res.data.Status === "Success") {
        setAuth(true);
        setNama(res.data.nama);
        setNip(res.data.nip);
        setUnit(res.data.unit);
      } else {
        setAuth(false);
        setMessage(res.data.Error);
      }
      setIsLoading(false); // Set isLoading to false after the API call is complete
    });
  }, []);

  if (isLoading) {
    return (
      <>
        <Sidebar nama={nama} nip={nip} unit={unit} />
        <Header />
      </>
    );
  }

  return (
    <>
      {auth ? (
        <>
          <Sidebar nama={nama} nip={nip} unit={unit} />
          <Header />
          <ChangePasswordBody nip={nip}/>
          <Footer />
        </>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
}

export default ChangePassword;