import React from "react";

function Lectures({ isActive, color, lectureAcronym, lectureName, onClick }) {
  const colorMap = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    // dodaj inne kolory w razie potrzeby spytac
  };

  const bgClass = colorMap[color] || "bg-gray-500";

  return (
    <button  type="button" onClick={onClick} className={`${isActive ? "bg-violet-50" : "bg-white"} flex p-4 rounded-xl pr-2 gap-2 place-items-center`}>
      <div className={`rounded-xl ${bgClass} text-white  flex items-center justify-center w-12 h-12`}>
        <h1 className="text-2xl font-black">{lectureAcronym}</h1>
      </div>
      <h1 className="font-semibold text-sm text-black">{lectureName}</h1>
    </button>
  );
}

export default Lectures;