import React from "react";

function Users({ color, userName, userAcronym, userStatus }) {
  const colorMap = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    // dodaj inne kolory w razie potrzeby - spytac 
  };

  const bgClass = colorMap[color] || "bg-gray-500";

  return (
    <div className={`bg-white flex p-4 rounded-xl pr-2 gap-4 place-items-center`}>
      <div className={`rounded-xl ${bgClass} text-white  flex items-center justify-center w-12 h-12`}>
        <h1 className="text-2xl font-black">{userAcronym}</h1>
      </div>
      <h1 className="font-semibold text-sm text-black mr-6">{userName}</h1>
      {userStatus && (
        <div className="bg-orange-100 p-1 rounded-xl text-orange-500 text-xs font-semibold">
            <h1>Moderator</h1>
        </div>
      )}
    </div>
  );
}

export default Users;