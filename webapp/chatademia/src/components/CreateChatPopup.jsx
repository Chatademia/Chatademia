import React, { useState } from "react";
import { XMarkIcon, UserGroupIcon } from "@heroicons/react/24/outline";

function CreateChatPopup({ isOpen, onClose, onSubmit }) {
  const [chatName, setChatName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (chatName.trim()) {
      onSubmit(chatName.trim());
      setChatName("");
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
          Tworzenie czatu niestandardowego
        </h2>

        <p className="text-gray-500 text-base mb-5">
          Wprowadź nazwę czatu grupowego
        </p>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="chatName"
            className="block text-gray-700 font-medium mb-2 text-sm"
          >
            Nazwa czatu grupowego
          </label>

          <input
            type="text"
            id="chatName"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            placeholder="Wprowadź nazwę czatu"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-primary transition-colors mb-4"
            autoFocus
          />

          <button
            type="submit"
            disabled={!chatName.trim()}
            className="w-full bg-primary text-white font-semibold py-3 rounded-xl text-m hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Dalej
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateChatPopup;
