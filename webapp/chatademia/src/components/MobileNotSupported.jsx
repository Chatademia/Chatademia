import React from "react";
import icon from "../assets/icon.png";
import { DevicePhoneMobileIcon } from "@heroicons/react/24/outline";

const MobileNotSupported = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #EDEEFF 0%, #CBCEFB 100%)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <div
            className="rounded-full p-6"
            style={{ backgroundColor: "#EDEEFF" }}
          >
            <DevicePhoneMobileIcon
              className="h-16 w-16"
              style={{ color: "#5004E0" }}
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Aplikacja niedostępna na urządzeniach mobilnych
        </h1>

        <p className="text-gray-600 mb-6">
          Chatademia jest zoptymalizowana do pracy na komputerach stacjonarnych
          i laptopach. Aby korzystać z pełnej funkcjonalności aplikacji, otwórz
          ją na komputerze.
        </p>
      </div>
    </div>
  );
};

export default MobileNotSupported;
