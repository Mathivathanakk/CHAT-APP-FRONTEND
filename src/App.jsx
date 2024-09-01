import React from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import SignUp from "./Pages/SignUp";
import Emailpage from "./Pages/Emailpage";
import Passwordpage from "./Pages/Passwordpage";
import Forgotpassword from "./Pages/Forgotpassword";
import Home from "./Pages/Home";
import MessagePage from "./Components/MessagePage";
import toast, { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Toaster />
        <Routes>
          <Route path="/register" element={<SignUp />} />
          <Route path="/email" element={<Emailpage />} />
          <Route path="/password" element={<Passwordpage />} />
          <Route path="/forgot-password" element={<Forgotpassword />} />
          <Route path="" element={<Home />}>
            <Route path="/:userId" element={<MessagePage />} />
          </Route>
        </Routes>
      
      </BrowserRouter>
    </div>
  );
};

export default App;
