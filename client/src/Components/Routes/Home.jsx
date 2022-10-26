import React, { useLayoutEffect, useState } from "react";
import { auth } from "../../firebase-config";
import { signOut } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";

export default function Home() {
  // const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileURL, setProfileURL] = useState("");

  useLayoutEffect(() => {
    // onAuthStateChanged(auth, (currentUser) => {
    //   setUser(currentUser);
    // });

    setName(localStorage.getItem("name"));
    setEmail(localStorage.getItem("email"));
    setProfileURL(localStorage.getItem("photoUrl"));
  }, []);

  if (localStorage.getItem("name") === null) {
    return <Navigate to={"/login"} />;
  }

  const logOut = () => {
    signOut(auth);
    localStorage.clear();
    navigate("/");

    // console.log(auth.currentUser);
  };
  return (
    <div>
      <h1>{name}</h1>
      <h1>{email}</h1>
      <img src={profileURL} alt="Profile Pic" />
      <br />
      <button onClick={logOut}>Logout</button>
    </div>
  );
}
