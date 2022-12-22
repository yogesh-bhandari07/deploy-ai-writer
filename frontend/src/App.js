import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRoute from "./Services/PortectedRoute";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import Navbar from "./Components/Navbar/Navbar";
import NewHome from "./Pages/NewHome/NewHome";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/ask-me-anything"
            element={
              <ProtectedRoute>
                <main className="main flex flex-col flex-grow  md:ml-0 transition-all duration-150 ease-in m-0">
                  <Navbar />
                  <Home />
                </main>
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/"
            element={
              <ProtectedRoute>
                <main className="main flex flex-col flex-grow  md:ml-0 transition-all duration-150 ease-in m-0">
                  <Navbar />
                  <NewHome />
                </main>
              </ProtectedRoute>
            }
          />

          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
