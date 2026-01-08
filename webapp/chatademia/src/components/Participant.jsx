import React from "react";

function Participant({
  color,
  participantFirstName,
  participantLastName,
  participantShortName,
  participantStatus,
}) {
  const bgClass = color || "bg-gray-500";

  return (
    <div
      className={`bg-white flex p-4 rounded-xl pr-2 gap-4 place-items-center`}
    >
      <div
        className={`rounded-xl ${bgClass} text-white aspect-square flex items-center justify-center w-12 h-12`}
      >
        <h1 className="text-2xl font-black">{participantShortName}</h1>
      </div>
      <h1 className="font-semibold text-sm text-black mr-6">
        {participantFirstName} {participantLastName}
      </h1>
      {participantStatus && (
        <div className="bg-orange-100 p-1 rounded-xl text-orange-500 text-xs font-semibold">
          <h1>Moderator</h1>
        </div>
      )}
    </div>
  );
}

export default Participant;
