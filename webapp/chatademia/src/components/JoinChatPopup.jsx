import React, { useState } from "react";
import { XMarkIcon, UserGroupIcon } from "@heroicons/react/24/outline";

function JoinChatPopup({ isOpen, onClose, onSubmit }) {
  const [code, setCode] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) {
      onSubmit(code.trim());
      setCode("");
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="flex justify-start mb-4">
          <div className="bg-gray-100 rounded-2xl p-4">
            <UserGroupIcon className="w-8 h-8 text-gray-700" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Dołącz do istniejącego czatu
        </h2>

        <p className="text-gray-500 text-base mb-5">
          Wprowadź kod zaproszenia, aby dołączyć do istniejącego czatu grupowego
        </p>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="chatName"
            className="block text-gray-700 font-medium mb-2 text-sm"
          >
            Kod zaproszenia
          </label>

          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => {
              const allowedChars = "ABCDEFGHJKMNPQRSTVWXYZ23456789";
              const value = e.target.value
                .toUpperCase()
                .split("")
                .filter((char) => allowedChars.includes(char))
                .join("");
              setCode(value);
            }}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 text-2xl tracking-widest font-bold text-center bg-gray-50 focus:outline-none focus:border-primary transition-all mb-4 shadow-lg placeholder-gray-400 uppercase"
            autoFocus
            maxLength={6}
            style={{ letterSpacing: "0.3em" }}
          />

          <button
            type="submit"
            disabled={!code.trim() || code.trim().length !== 6}
            className="w-full bg-primary text-white font-semibold py-3 rounded-xl text-m hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Dołącz do czatu
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinChatPopup;
