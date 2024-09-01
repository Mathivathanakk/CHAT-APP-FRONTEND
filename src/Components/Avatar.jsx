import React from "react";
import { PiUserCircle } from "react-icons/pi";

const Avatar = ({ userId, name, imageUrl, width, height }) => {
  let avatarName = "";
  //vikram or milan matvik
  if (name) {
    const splitName = name?.split(" "); //'vikram' or 'milan','matvik'
    //console.log(splitName)
    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0]; // 'm'+'m'='mm'
    } else {
      avatarName = splitName[0][0]; //'v'
    }
  }

  const bgColor = [
    "bg-slate-200",
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-gray-200",
    "bg-cyan-200",
    "bg-sky-200",
    "bg-blue-200",
  ];

  const randomNumber = Math.floor(Math.random() * 9);
  // console.log(randomNumber);
  // console.log(avatarName, "avatarName");
  return (
    <div
      className="text-slate-800 rounded-full font-bold relative mb-2"
      style={{ width: width + "px", height: height + "px" }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          width={width}
          height={height}
          className="overflow-hidden rounded-full"
        />
      ) : name ? (
        <div
          style={{ width: width + "px", height: height + "px" }}
          className={`overflow-hidden rounded-full flex justify-center items-center text-lg ${bgColor[randomNumber]}`}
        >
          {avatarName}
        </div>
      ) : (
        <PiUserCircle size={width} />
      )}
    </div>
  );
};

export default Avatar;
