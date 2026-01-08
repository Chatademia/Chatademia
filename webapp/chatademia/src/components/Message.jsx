import React, { useState } from "react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

function Message({
  message,
  isOwnMessage,
  senderName,
  senderShortName,
  formatTimestamp,
  senderColor,
  onClick,
}) {
  const bgClass = senderColor || "bg-gray-500";
  const [imageError, setImageError] = useState(false);

  // Check if file is an image with regex
  const isImage =
    message.fileName && /\.(jpg|jpeg|png|gif|webp)$/i.test(message.fileName);

  return (
    <div
      className={`w-full flex ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex gap-3 max-w-[60%] ${
          isOwnMessage ? "cursor-pointer" : ""
        }`}
        onClick={onClick}
      >
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
            } rounded-xl border border-gray-200 p-3 pb-8 relative min-w-[64px] max-w-[420px] w-fit break-words`}
            style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
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
            } rounded-lg p-0.5 border border-gray-200 pb-8 relative min-w-[120px] max-w-[420px] w-fit`}
          >
            {isImage ? (
              !imageError ? (
                <a
                  href={message.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg m-1 overflow-hidden cursor-pointer block"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <img
                    src={message.content}
                    alt={message.fileName || "Zdjęcie"}
                    onError={() => setImageError(true)}
                    className="max-w-full h-auto object-contain"
                    style={{ maxHeight: "300px" }}
                  />
                </a>
              ) : (
                <div
                  className={`rounded-lg ${
                    isOwnMessage ? "bg-white" : "bg-gray-100"
                  } p-3 flex items-center gap-3 cursor-pointer`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (message.content) {
                      window.open(message.content, "_blank");
                    }
                  }}
                >
                  <DocumentTextIcon className="size-6" color="#5004E0" />
                  <p className="font-semibold text-lg text-black break-words">
                    {message.fileName || "Plik"}
                  </p>
                </div>
              )
            ) : (
              <div
                className={`rounded-lg ${
                  isOwnMessage ? "bg-white" : "bg-gray-100"
                } p-3 flex items-center gap-3 cursor-pointer`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (message.content) {
                    window.open(message.content, "_blank");
                  }
                }}
              >
                <DocumentTextIcon className="size-6" color="#5004E0" />
                <p className="font-semibold text-lg text-black break-words">
                  {message.fileName || "Plik"}
                </p>
              </div>
            )}
            <span className="text-xs text-white absolute bottom-2 right-2">
              {formatTimestamp(message.createdAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;
