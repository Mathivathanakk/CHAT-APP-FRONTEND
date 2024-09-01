import React, { useEffect, useRef, useState } from "react";
import { uploadFile} from "../Uploads/uploadFile";
import Avatar from "./Avatar";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { URL } from "../Uploads/Backend";

const EditUserDetails = ({ user, onClose }) => {
  const [data, setData] = useState({
    name: user?.name,
    profile_pic: user?.profile_pic,
  });

  const dispatch = useDispatch();
  const uploadPhotoRef = useRef();

  useEffect(() => {
    setData((prev) => {
      return {
        ...prev,
        ...user,
      };
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadPhotoRef.current.click();
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadphoto = await uploadFile(file);
    //console.log(uploadphoto)

    setData((prev) => {
      return {
        ...prev,
        profile_pic: uploadphoto?.url,
      };
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await axios({
        method: "post",
        url: `${URL}/update-user`,
        data: data,
        withCredentials: true,
      });
     // console.log("response", response);
      toast.success(response?.data?.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-pink-700 bg-opacity-40 flex justify-center items-center z-10">
      <div className="bg-white p-4 py-6 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold font-Roboto text-center underline">
          PROFILE DETAILS
        </h2>
        <p className="font-Nunito text-center text-blue-500">
          Edit user Details
        </p>
        <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              className="bg-blue-100 w-full px-2 py-1 focus:outline-pink-500 border-0.5"
              value={data.name}
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <div>Profile Photo</div>
            <div className="my-1 flex items-center gap-4">
              <Avatar
                width={40}
                height={40}
                imageUrl={data?.profile_pic}
                name={data?.name}
              />
              <label htmlFor="profile_pic">
                <button
                  className="text-blue-400 underline font-Serif"
                  onClick={handleOpenUploadPhoto}
                >
                  Change Photo
                </button>
                <input
                  type="file"
                  id="profile_pic"
                  className="hidden"
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </label>
            </div>
          </div>

          <hr />
          <div className="flex gap-2 w-fit ml-auto">
            <button
              onClick={handleSubmit}
              className="border-pink-600 bg-pink-600 px-4 py-1 rounded hover:bg-pink-500 text-white border"
            >
              Save
            </button>

            <button
              onClick={onClose}
              className="border-pink-600 border text-pink-600 px-4 py-1 rounded hover:bg-pink-600 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetails;
