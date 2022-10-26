// import React, { useLayoutEffect, useState } from "react";
import { signInWithMicrosoft } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
import MsBtn from "../Assets/ms.svg";

function Login() {
  const navigate = useNavigate();
  // const [user, setUser] = useState({});

  // useLayoutEffect(() => {
  //   onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser);
  //   });
  // }, []);

  //   console.log(user);
  if (localStorage.length > 0) {
    navigate("/home");
  }

  const signIn = async () => {
    await signInWithMicrosoft()
      .then((result) => {
        // console.log(result);
        localStorage.setItem("name", result.user.displayName);
        localStorage.setItem("email", result.user.email);
        localStorage.setItem("photoUrl", result.user.photoURL);
        navigate("/home");
      })
      .catch((error) => {
        // console.log(error);
        navigate("/login/error");
      });
  };

  return (
    <div className="login-page">
      <span className="title-text">HARIBON E - WALL</span>
      <button className="btn btn-dark p-0 btn-ms" onClick={signIn}>
        <img className="rounded" src={MsBtn} alt="Ms Auth Btn" />
      </button>
    </div>
  );
}

export default Login;
