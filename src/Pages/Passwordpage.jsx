import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Avatar from "../Components/Avatar";
import { URL } from "../Uploads/Backend";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setToken } from "../Redux/UserSlice";

const Passwordpage = () => {
  const [data, setData] = useState({
    password: "",
    userId: "",
  });
  const navigate = useNavigate();
  //getting the user details using location
  const location = useLocation();
  // console.log("location", location);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location?.state?.name) {
      navigate("/email");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await axios({
        method: "post",
        url: `${URL}/password`,
        data: {
          userId: location?.state?._id,
          password: data.password,
        },
        withCredentials: true,
      });

      toast.success(response.data.message);
      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);

        setData({
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="mt-5">
        <div
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px",
          }}
          className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto font-Nunito"
        >
          <div className="w-fit mx-auto mb-2 flex items-center justify-center flex-col">
            <Avatar
              width={70}
              height={70}
              name={location.state.name}
              imageUrl={location.state.profile_pic}
            />
            <h2 className="font-semibold text-lg mt-2">
              {location.state.name}
            </h2>
          </div>
          <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="bg-blue-100 px-2 py-1 focus:outline-pink-500 rounded"
                value={data.password}
                required
                onChange={handleChange}
              />
            </div>

            <button className="bg-pink-500  hover:bg-pink-600 font-Serif text-lg px-4 py-1 rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
              Login
            </button>
          </form>
          <p className="my-1">
            <Link
              to={"/forgot-password"}
              className="font-semibold hover:text-pink-500 text-blue-500 p-1"
            >
              forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Passwordpage;
