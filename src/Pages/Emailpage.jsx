import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { URL } from "../Uploads/Backend";
import toast from "react-hot-toast";
import axios from "axios";

const Emailpage = () => {
  const [data, setData] = useState({
    email: "",
  });
  const navigate = useNavigate();

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
      const response = await axios.post(`${URL}/email`, data);

      toast.success(response.data.message);

      if (response.data.message) {
        setData({
          email: "",
        });
      }
      //console.log(response.data.data)
      navigate("/password", {
        state: response.data.data,
      });
    } catch (error) {
      toast.error(error.response.data.message);
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
          <h3 className="text-center font-bold text-2xl font-Roboto">
            Welcome to Chat App !
          </h3>
          <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your Email"
                className="bg-blue-100 px-2 py-1 focus:outline-pink-500 rounded"
                value={data.email}
                required
                onChange={handleChange}
              />
            </div>

            <button className="bg-pink-500  hover:bg-pink-600 font-Serif text-lg px-4 py-1 rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
              Verify
            </button>
          </form>
          <p className="my-1">
            New User?
            <Link
              to={"/register"}
              className="font-semibold hover:text-pink-500 text-blue-500 p-1"
            >
              SignUp
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Emailpage;
