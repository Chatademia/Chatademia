import React from "react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

function Message({
  message,
  isOwnMessage,
  senderName,
  senderShortName,
  formatTimestamp,
  senderColor,
}) {
  const bgClass = senderColor || "bg-gray-500";

  return (
    <div
      className={`w-full flex ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div className="flex gap-3 w-[60%]">
        {!isOwnMessage && (
          <div
            className={`rounded-xl ${bgClass} text-white flex items-center justify-center w-12 h-12 flex-shrink-0`}
          >
            <span className="text-lg font-black">{senderShortName || "?"}</span>
          </div>
        )}

        {message.type !== "file" || !message.type ? (
          <div
            className={`${
              isOwnMessage ? "bg-primary text-white" : "bg-white text-black "
            } rounded-xl border border-gray-200 p-3 w-full pb-8 relative`}
          >
            <p className="text-base font-medium break-words">
              {message.content}
            </p>
            <span
              className={`text-xs ${
                isOwnMessage ? "text-white" : "text-black"
              } mt-1 absolute bottom-2 right-2`}
            >
              {formatTimestamp(message.createdAt)}
            </span>
          </div>
        ) : (
          <div
            className={`${
              isOwnMessage ? "bg-primary" : "bg-white"
            } rounded-lg p-0.5 border border-gray-200 w-full pb-8 relative`}
          >
            <div
              className={`rounded-lg ${
                isOwnMessage ? "bg-white" : "bg-gray-100"
              } p-3 flex items-center gap-3`}
            >
              <DocumentTextIcon className="size-6" color="#5004E0" />

              <p className="font-semibold text-lg text-black break-words">
                {message.content}
              </p>
            </div>
            <span className="text-xs text-gray-500 absolute bottom-2 right-2">
              {formatTimestamp(message.createdAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;
