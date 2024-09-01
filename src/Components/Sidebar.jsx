import React, { useEffect, useState } from "react";
import { FaImage, FaUserPlus, FaVideo } from "react-icons/fa";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { BiLogOut } from "react-icons/bi";
import { logout } from "../Redux/UserSlice";
import SearchUser from "./SearchUser";
import EditUserDetails from "./EditUserDetails";
import { FiArrowUpLeft } from "react-icons/fi";

const Sidebar = () => {
  const user = useSelector((state) => state.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(true);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);

      socketConnection.on("conversation", (data) => {
       // console.log("conversation", data);

        const conversationUserData = data.map((conversationUser, index) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        });
        setAllUser(conversationUserData);
      });
    }
  }, [socketConnection, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/email");
    localStorage.clear();
  };

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
      <div className="bg-pink-200 w-12 h-full  rounded-tr-lg rounded-br-lg py-5 text-blue-950 flex flex-col justify-between">
        <div>
          <NavLink
            title="chat"
            className={({ isActive }) =>
              `w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-pink-300 rounded ${
                isActive && "bg-pink-300"
              }`
            }
          >
            <IoChatbubbleEllipses size={20} />
          </NavLink>
          <div
            title="Add friend"
            onClick={() => setOpenSearchUser(true)}
            className="w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-pink-300 rounded"
          >
            <FaUserPlus size={20} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="mx-auto"
            onClick={() => setEditUserOpen(true)}
            title={user.name}
          >
            <Avatar
              width={40}
              height={40}
              name={user.name}
              imageUrl={user.profile_pic}
              userId={user._id}
            />
          </button>
          <button
            title="logout"
            onClick={handleLogout}
            className="w-12 h-12 flex -ml-2 items-center justify-center cursor-pointer hover:bg-pink-300 rounded"
          >
            <BiLogOut size={20} />
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="h-16 flex items-center">
          <h2 className="text-xl font-bold font-Roboto p-4 text-blue-950 ">
            Messages
          </h2>
        </div>

        <hr />

        <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {allUser.length === 0 && (
            <div className="mt-12">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore users to start a conversation with.
              </p>
            </div>
          )}

          {allUser.map((conv, index) => {
            return (
              <NavLink
                to={"/" + conv?.userDetails?._id}
                key={conv?._id}
                className="flex items-center gap-2 py-2 px-3 border border-transparent hover:border-pink-600 rounded hover:bg-slate-100 cursor-pointer"
              >
                <div>
                  <Avatar
                    imageUrl={conv?.userDetails?.profile_pic}
                    name={conv?.userDetails?.name}
                    width={40}
                    height={40}
                  />
                </div>

                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                    {conv?.userDetails?.name}
                  </h3>
                  <div className="text-slate-500 text-xs flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      {conv?.lastMsg?.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaImage />
                          </span>
                          {!conv?.lastMsg?.text && <span>Image</span>}
                        </div>
                      )}

                      {conv?.lastMsg?.videoUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaVideo />
                          </span>
                          {!conv?.lastMsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>

                    <p className="text-ellipsis line-clamp-1">
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>
                {Boolean(conv?.unseenMsg) && (
                  <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-pink-500 text-white font-semibold rounded-full">
                    {conv?.unseenMsg}
                  </p>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* editing the user Details */}
      {editUserOpen && (
        <EditUserDetails user={user} onClose={() => setEditUserOpen(false)} />
      )}

      {/* search user */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
