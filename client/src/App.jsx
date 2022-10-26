import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from "./Components/Layout/Loading";
import "./App.css";

const Login = lazy(() => import("./Components/Routes/Login"));
const Error = lazy(() => import("./Components/Routes/Error"));
const Home = lazy(() => import("./Components/Routes/Home"));
const NavBar = lazy(() => import("./Components/Layout/NavBar"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <NavBar />
        <Routes>
          <Route path={"/"} element={<Login />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/login/error"} element={<Login />} />
          <Route path={"/home"} element={<Home />} />
          <Route path={"*"} element={<Error />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
