import React from "react";

function Message({
  message,
  isMyMessage,
  senderName,
  senderShortName,
  formatTimestamp,
  senderColor,
}) {
  const bgClass = senderColor || "bg-gray-500";

  return (
    <div
      className={`w-full flex ${isMyMessage ? "justify-end" : "justify-start"}`}
    >
      <div className="flex gap-3 w-[60%]">
        {!isMyMessage && (
          <div
            className={`rounded-xl ${bgClass} text-white flex items-center justify-center w-12 h-12 flex-shrink-0`}
          >
            <span className="text-lg font-black">{senderShortName || "?"}</span>
          </div>
        )}

        {message.type === "message" ? (
          <div
            className={`${
              isMyMessage ? "bg-primary text-white" : "bg-white text-black "
            } rounded-xl border border-gray-200 p-3 w-full pb-8 relative`}
          >
            <p className="text-base font-medium break-words">
              {message.content}
            </p>
            <span
              className={`text-xs ${
                isMyMessage ? "text-white" : "text-black"
              } mt-1 absolute bottom-2 right-2`}
            >
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
        ) : (
          <div
            className={`${
              isMyMessage ? "bg-primary" : "bg-white"
            } rounded-lg p-0.5 border border-gray-200 w-full pb-8 relative`}
          >
            <div
              className={`rounded-lg ${
                isMyMessage ? "bg-white" : "bg-gray-100"
              } p-3 flex items-center gap-3`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#5004E0" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>

              <p className="font-semibold text-lg text-black break-words">
                {message.content}
              </p>
            </div>
            <span className="text-xs text-gray-500 absolute bottom-2 right-2">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;
