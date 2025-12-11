import React from "react";

function Chat({ isActive, color, chatShortName, chatName, onClick }) {
  const bgClass = color || "bg-gray-500";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${
        isActive ? "bg-violet-50" : "bg-white"
      } flex p-4 rounded-xl pr-2 gap-2 place-items-center`}
    >
      <div
        className={`rounded-xl ${bgClass} text-white  flex items-center justify-center w-12 h-12`}
      >
        <h1 className="text-2xl font-black">{chatShortName}</h1>
      </div>
      <h1 className="font-semibold text-sm text-black">{chatName}</h1>
    </button>
  );
}

export default Chat;
