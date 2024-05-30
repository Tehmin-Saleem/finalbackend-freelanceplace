import { Routes, Route } from "react-router-dom";
import "./App.css";
// import Login from "./Pages/Signup/Login";
import { ProfileView, Proposal } from "./Pages/index";

function App() {
  return (
    <>
      {/* <Login /> */}
      <ProfileView />
      {/* <Proposal /> */}
    </>
  );
}

export default App;
