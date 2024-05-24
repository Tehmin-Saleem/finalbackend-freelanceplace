import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Sign-up/Login";
import ProfileView from "./Pages/ProfileView/ProfileView";
import Proposal from "./Pages/ProposalsPage/Proposal";
import StarRating from "./components/ProfileView/starrating/StarRating";

function App() {
  return (
    <>
      {/* <Login /> */}
      {/* <ProfileView /> */}
      <Proposal />
    </>
  );
}

export default App;
