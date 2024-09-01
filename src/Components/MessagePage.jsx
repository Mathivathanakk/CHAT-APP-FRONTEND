import React, { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaImage, FaPlus } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import { HiDotsVertical } from "react-icons/hi";
import { uploadFile } from "../Uploads/uploadFile";
import { IoClose } from "react-icons/io5";
import Loading from "./Loading";
import { IoMdSend } from "react-icons/io";
import moment from "moment";

const MessagePage = () => {
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });
  const params = useParams();

  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);
  //console.log(params)

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);

      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });

      socketConnection.emit("seen", params.userId);

      socketConnection.on("message", (data) => {
        console.log("message data", data);
        setAllMessage(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);

    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: uploadPhoto.url,
      };
    });
  };

  const handleClearUploadImage = () => {
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: "",
      };
    });
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: uploadPhoto.url,
      };
    });
  };

  const handleClearUploadVideo = () => {
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: "",
      };
    });
  };

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage((prev) => {
      return {
        ...prev,
        text: value,
      };
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("new message", {
          sender: user._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
        });

        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };

 // console.log("message", message);
  return (
    <div>
      <header className="sticky top-0 h-16 bg-white flex  justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser.profile_pic}
              name={dataUser.name}
              userId={dataUser._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h3>
            <p>
              {dataUser.online ? (
                <span className="text-blue-500">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <button className="cursor-pointer hover:text-pink-600">
            <HiDotsVertical />
          </button>
        </div>
      </header>

      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
        {/* all message show here */}
        <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
          {allMessage.map((ele, index) => {
            return (
              <div
                className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md font-Nunito ${
                  user?._id === ele?.msgByUserId
                    ? "ml-auto bg-white "
                    : "bg-pink-400"
                }`}
              >
                <div className="w-full relative">
                  {ele.imageUrl && (
                    <img
                      src={ele.imageUrl}
                      alt="image"
                      download
                      className="w-full h-full object-scale-down"
                    />
                  )}
                  {ele.videoUrl && (
                    <video
                      src={ele.videoUrl}
                      alt="video"
                      controls
                      download
                      className="w-full h-full object-scale-down"
                    />
                  )}
                </div>
                <p className="px-2">{ele.text}</p>
                <p>{moment(ele.createdAt).format("hh:mm")}</p>
              </div>
            );
          })}
        </div>

        {/* upload Image display */}

        {message.imageUrl && (
          <div className="w-full h-full bottom-0 bg-slate-200 bg-opacity-40 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadImage}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message.imageUrl}
                alt="uploadImage"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}

        {/**upload video display */}
        {message.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadVideo}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message.videoUrl}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
            <Loading />
          </div>
        )}
      </section>

      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative">
          <button
            onClick={handleUploadImageVideoOpen}
            className="flex justify-center items-center w-11 h-11 rounded-full text-blue-950 hover:bg-blue-950 hover:text-white"
          >
            <FaPlus size={20} />
          </button>

          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-pink-600">
                    <FaImage size={18} />
                  </div>
                  <p className="font-Nunito font-semibold">Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-purple-600">
                    <FaImage size={18} />
                  </div>
                  <p className="font-Nunito font-semibold">Video</p>
                </label>
                <input
                  type="file"
                  id="uploadImage"
                  className="hidden"
                  onClick={handleUploadImage}
                />
                <input
                  type="file"
                  id="uploadVideo"
                  className="hidden"
                  onClick={handleUploadVideo}
                />
              </form>
            </div>
          )}
        </div>

        {/* input box */}

        <form className="h-full w-full flex gap-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type here message"
            className="py-1 px-4 outline-none w-full h-full"
            value={message.text}
            onChange={handleChange}
          />
          <button className="text-blue-950 hover:text-blue-900">
            <IoMdSend size={28} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
