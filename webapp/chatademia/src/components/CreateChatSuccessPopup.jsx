import React, { useState } from "react";
import {
  CheckCircleIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";

function CreateChatSuccessPopup({ isOpen, onClose, inviteLink }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(
      inviteLink.substring(inviteLink.lastIndexOf("/") + 1)
    );
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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
        <div className="flex justify-start mb-4">
          <div className="bg-green-100 rounded-2xl p-4">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Utworzono czat grupowy
        </h2>

        <p className="text-gray-500 text-base mb-5">
          Zaproś innych do dołączenia do tego czatu
        </p>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2 text-sm">
            Link do dołączenia
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-base bg-gray-50 text-gray-700"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              title="Kopiuj link"
            >
              {copiedLink ? (
                <CheckIcon className="w-5 h-5 text-green-600" />
              ) : (
                <ClipboardDocumentIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2 text-sm">
            Kod zaproszenia
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={inviteLink.substring(inviteLink.lastIndexOf("/") + 1)}
              readOnly
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-base bg-gray-50 text-gray-700"
            />
            <button
              onClick={handleCopyCode}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              title="Kopiuj kod"
            >
              {copiedCode ? (
                <CheckIcon className="w-5 h-5 text-green-600" />
              ) : (
                <ClipboardDocumentIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-primary text-white font-semibold py-3 rounded-xl text-m hover:bg-purple-700 transition-colors"
        >
          Zakończ
        </button>
      </div>
    </div>
  );
}

export default CreateChatSuccessPopup;

/*
function CreateChatSuccessPopup({ isOpen, onClose, inviteLink }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedShortName, setCopiedShortName] = useState(false);

  const full_invite = inviteLink.substring(inviteLink.lastIndexOf("/") + 1); // "example.pl/invite/XX_ABCDEF"
  const [shortName, inviteCode] = full_invite.split("_");

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyShortName = () => {
    navigator.clipboard.writeText(shortName);
    setCopiedShortName(true);
    setTimeout(() => setCopiedShortName(false), 2000);
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
        <div className="flex justify-start mb-4">
          <div className="bg-green-100 rounded-2xl p-4">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Utworzono czat grupowy
        </h2>

        <p className="text-gray-500 text-base mb-5">
          Zaproś innych do dołączenia do tego czatu
        </p>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2 text-sm">
            Link do dołączenia
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-base bg-gray-50 text-gray-700"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              title="Kopiuj link"
            >
              {copiedLink ? (
                <CheckIcon className="w-5 h-5 text-green-600" />
              ) : (
                <ClipboardDocumentIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2 text-sm">
            Kod zaproszenia
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={inviteCode}
              readOnly
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-base bg-gray-50 text-gray-700"
            />
            <button
              onClick={handleCopyCode}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              title="Kopiuj kod"
            >
              {copiedCode ? (
                <CheckIcon className="w-5 h-5 text-green-600" />
              ) : (
                <ClipboardDocumentIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2 text-sm">
            Skrót czatu
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={shortName}
              readOnly
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-base bg-gray-50 text-gray-700"
            />
            <button
              onClick={handleCopyShortName}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              title="Kopiuj kod"
            >
              {copiedShortName ? (
                <CheckIcon className="w-5 h-5 text-green-600" />
              ) : (
                <ClipboardDocumentIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-primary text-white font-semibold py-3 rounded-xl text-m hover:bg-purple-700 transition-colors"
        >
          Zakończ
        </button>
      </div>
    </div>
  );
}


export default CreateChatSuccessPopup;
  */
