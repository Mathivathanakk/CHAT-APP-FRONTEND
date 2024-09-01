import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { URL } from "../Uploads/Backend";
import { logout, setSocketConnection, setUser } from "../Redux/UserSlice";
import { LiaGripfire } from "react-icons/lia";
import { io } from "socket.io-client";

const Home = () => {
  const user = useSelector((state) => state.user);
  //console.log("user", user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios({
        url: `${URL}/user-details`,
        withCredentials: true,
      });
      dispatch(setUser(response.data.data));
      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      }
      console.log("current user Details", response);
    } catch (error) {
      console.log("error", error);
    }
  };

  const basepath = location.pathname === "/";

  // socket connection

  useEffect(() => {
    const socketConnection = io("https://chat-app-backend-mathi.onrender.com", {
      auth: {
        token: localStorage.getItem("token"),
      },
    });
    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basepath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      {/* message Components */}
      <section className={`${basepath && "hidden"}`}>
        <Outlet />
      </section>
      <div
        className={` flex-col items-center justify-center gap-2 hidden ${
          !basepath ? "hidden" : "lg-flex"
        }`}
      >
        <div className="bg-pink-300 text-blue-950 font-bold font-Serif text-4xl p-4 flex items-center justify-center gap-2">
          <div>
            <LiaGripfire size={50} />
          </div>
          <h1>CHAT APP</h1>
        </div>
        <p className="text-lg mt-2 text-slate-500 p-1 font-Nunito">
          Select user to send message...
        </p>
      </div>
    </div>
  );
};

export default Home;
