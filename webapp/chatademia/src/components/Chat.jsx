import React from "react";

function Chat({ isActive, color, chatShortName, chatName, onClick, hasNew }) {
  const bgClass = color || "bg-gray-500";

  return (
      <button
        type="button"
        onClick={onClick}
        className={` ${
          isActive ? "bg-violet-50" : "bg-white hover:bg-gray-50"
        } flex p-4 rounded-xl pr-2 gap-2 place-items-center transition-colors duration-200 cursor-pointer`}
      >
        <div
          className={`rounded-xl ${bgClass} text-white aspect-square flex items-center justify-center w-12 h-12`}
        >
          <h1 className="text-2xl font-black">{chatShortName}</h1>
        </div>
        <h1 className={`${hasNew ? "font-black" : "font-medium"} text-sm text-black  overflow-hidden whitespace-nowrap text-ellipsis`}>
          {chatName}
        </h1> 
      </button>
  );
}

export default Chat;
