import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { uploadFile} from "../Uploads/uploadFile";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import axios from "axios";
import {URL} from "../Uploads/Backend"


const SignUp = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });
  const [uploadphoto, setUploadPhoto] = useState("");

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

  const handleUploadPhoto = async (e) => {
    
    const file = e.target.files[0];
    const uploadphoto = await uploadFile(file);
  //  console.log(uploadphoto)
    setUploadPhoto(file);
    setData((prev) => {
      return {
        ...prev,
        profile_pic: uploadphoto.url,
      };
    });
  };

  const handleClearUploadPhoto = (e) => {
   
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
   
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await axios.post(`${URL}/register`, data);
      toast.success(response.data.message);
      if (response.data.message) {
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        });
        navigate("/email");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    //console.log(data)
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
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                className="bg-blue-100 px-2 py-1 focus:outline-pink-500 rounded"
                value={data.name}
                required
                onChange={handleChange}
              />
            </div>
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
            <div className="flex flex-col gap-2">
              <label htmlFor="profile_pic">
                Profile Photo
                <div className="h-14 bg-blue-100 flex justify-center items-center border rounded hover:border-pink-500 cursor-pointer">
                  <p>
                    {uploadphoto?.name
                      ? uploadphoto?.name
                      : "Upload profile photo"}
                  </p>
                  {uploadphoto?.name  && (
                    <button
                      className="text-lg ml-2 hover:text-red-600"
                      onClick={handleClearUploadPhoto}
                    >
                      <IoClose />
                    </button>
                  )}
                </div>
              </label>
              <input
                type="file"
                id="profile_pic"
                name="profile_pic"
                className="bg-blue-100 px-2 py-1 focus:outline-pink-500 rounded hidden"
                onChange={handleUploadPhoto}
              />
            </div>
            <button className="bg-pink-500  hover:bg-pink-600 font-Serif text-lg px-4 py-1 rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
              SignUp
            </button>
          </form>
          <p className="my-1">
            Already have account?
            <Link
              to={"/email"}
              className="font-semibold hover:text-pink-500 text-blue-500"
            >
              SignIn
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
