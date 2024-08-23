import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { ProfileView, Proposal, JobsPage, SignIn, Signup } from "./Pages/index";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/proposal" element={<Proposal />} />
        <Route path="/matchingjobs" element={<JobsPage />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;






