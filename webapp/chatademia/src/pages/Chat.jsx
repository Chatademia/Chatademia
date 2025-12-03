import icon from "../assets/icon.png";
import arrowDown from "../assets/arrowDown.svg";
import plus from "../assets/plus.svg";
import Lectures from "../components/Lectures.jsx";
import dots from "../assets/dotsPrimary.svg";
import Users from "../components/Users.jsx";
import React, { useEffect } from "react";
import { useState } from "react";
import edit from "../assets/edit.svg";
import invite from "../assets/users.svg";
import leave from "../assets/logoutRed.svg";
import { useNavigate } from "react-router-dom";

function Chat() {
  const [groupBar, setGroupBar] = useState(false);
  const [logoutBar, setLogoutBar] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
  });
  const [chats, setChats] = useState([
    {
      id: 1,
      color: "red",
      short_name: "IO",
      name: "Inżynieria Oprogramowania (gr. 24)",
    },
    {
      id: 2,
      color: "blue",
      short_name: "SI",
      name: "Sztuczna Inteligencja (gr. 11)",
    },
    {
      id: 3,
      color: "green",
      short_name: "AM",
      name: "Analiza Matematyczna 1 (gr. 10)",
    },
    {
      id: 4,
      color: "yellow",
      short_name: "PP",
      name: "Podstawy programowania (gr. 14)",
    },
    {
      id: 5,
      color: "green",
      short_name: "ZR",
      name: "Zbiory Rozmyte (gr. 12)",
    },
  ]);

  const [selectedChatId, setSelectedChatId] = useState(1);

  const handleLogout = async () => {
    try {
      // Get session token from cookies
      const sessionToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("session_token="))
        ?.split("=")[1];

      // If session token doesn't exist, redirect to home page
      if (!sessionToken) {
        console.error("Brak tokenu sesji");
        navigate("/");
        return;
      }

      // Terminate session on the backend
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/session?session=${sessionToken}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          //credentials: "include",
        }
      );
      /*
      // Terminate session on the backend with session token in body
            const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/session`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session: sessionToken }),
          //credentials: "include",
        }
      );
      */

      if (!response.ok) {
        throw new Error(response.status);
      }
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    } finally {
      // Delete session cookie and redirect to home page
      document.cookie = "session_token=; path=/; max-age=0; SameSite=Strict";
      navigate("/");
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      // Get session token from cookies
      const sessionToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("session_token="))
        ?.split("=")[1];

      // If session token doesn't exist, redirect to home page
      if (!sessionToken) {
        console.error("Brak tokenu sesji");
        navigate("/");
        return;
      }

      try {
        // Get user data
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/user?session=${sessionToken}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            //credentials: "include",
          }
        );

        // Read response text
        const responseText = await response.text();

        if (!response.ok) {
          throw new Error(response.status);
        }

        // Parse response to JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error("Nieprawidłowa odpowiedź z serwera:", responseText);
          throw new Error("Serwer zwrócił nieprawidłowy format danych");
        }
        if (data.error) {
          throw new Error(data.error);
        }

        // Set user data
        setUserData(data);
      } catch (error) {
        console.error("Błąd podczas pobierania danych użytkownika:", error);
        navigate("/");
      }
    };
    getUserData();
  }, [navigate]);

  return (
    <div className="bg-white flex h-screen relative">
      <div className="w-1/4 border flex flex-col relative">
        <div className=" flex gap-2 pr-4 px-5 h-[7.74%] border-b items-center">
          <img src={icon} alt="Logo" className="h-12 w-12" />
          <h1 className="text-4xl font-bold text-primary">Chatademia</h1>
        </div>
        <div className=" flex gap-2 h-[8.63%] justify-between border-b items-center p-5">
          <div className="flex gap-2 items-center">
            <h1 className="font-semibold text-black text-xl">Czaty grupowe</h1>
            <img src={arrowDown} alt="arrow down" className="h-5 w-5" />
          </div>
          <div className="rounded-full bg-primary text-white overflow-visible h-8 w-8 flex justify-center items-center cursor-pointer">
            <img src={plus} alt="plus" className="h-6 w-6" />
          </div>
        </div>
        <div className="flex flex-col gap-4 p-5 border-b h-[76.77%] overflow-y-auto">
          {chats.map((chat) => (
            <Lectures
              key={chat.id}
              isActive={chat.id === selectedChatId}
              color={chat.color}
              lectureAcronym={chat.short_name}
              lectureName={chat.name}
              onClick={() => setSelectedChatId(chat.id)}
            />
          ))}
        </div>
        <div className="h-[6.94%] flex p-5 gap-3 justify-left items-center ">
          <div
            className={`rounded-xl bg-orange-500 text-white  flex items-center justify-center w-10 h-10`}
          >
            <h1 className="text-xl font-black">
              {userData.firstName[0]}
              {userData.lastName[0]}
            </h1>
            <button
              type="button"
              onClick={() => setLogoutBar((s) => !s)}
              aria-expanded={logoutBar}
              aria-label="Opcje użytkownika"
              className="absolute inset-0 rounded-xl focus:outline-none"
            />
          </div>
          <h1 className="font-semibold text-sm text-black">
            {userData.firstName} {userData.lastName}
          </h1>
        </div>

        {logoutBar && (
          <div className="absolute bottom-14 left-4 bg-white border rounded-lg shadow-lg w-72 z-10">
            <button
              className="flex gap-2 items-center justify-left px-4"
              onClick={() => handleLogout()}
            >
              <img src={leave} alt="leave" className="h-5 w-5" />
              <h1 className="px-4 py-2 font-semibold text-red-400 cursor-pointer">
                Wyloguj się
              </h1>
            </button>
          </div>
        )}
      </div>
      <div className="w-1/2 border">
        <div className=" flex gap-4  h-[7.74%] justify-center p-5 border-b items-center">
          <div
            className={`rounded-xl text-white  flex items-center justify-center w-12 h-12`}
            style={{
              backgroundColor: chats.find((chat) => chat.id === selectedChatId)
                ?.color,
            }}
          >
            <h1 className="text-2xl font-black">
              {chats.find((chat) => chat.id === selectedChatId)?.short_name}
            </h1>
          </div>
          <h1 className="font-semibold text-xl text-black">
            {chats.find((chat) => chat.id === selectedChatId)?.name}
          </h1>
        </div>
        <div className="bg-white h-[82.885%] overflow-y-auto"></div>
        <div className="h-[9.375%] p-5 flex gap-5 items-center">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
              />
            </svg>
          </button>
          <div className="relative w-full">
            <input
              className="w-full rounded-lg border border-gray-200 py-3 text-gray-300 text-xs px-2"
              placeholder="Wprowadź wiadomość"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="purple"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="purple"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </div>
            {/* naprawic te ikoenke  */}
          </div>
        </div>
      </div>
      <div className="w-1/4 border relative">
        <div className=" flex gap-2 pr-4 h-[7.74%] justify-between p-5 border-b items-center relative">
          <h1 className="font-semibold text-black text-xl">Grupa</h1>
          <div className="relative">
            <button
              onClick={() => setGroupBar((s) => !s)}
              className="rounded-full h-8 w-8 bg-violet-50 flex items-center justify-center cursor-pointer"
              aria-expanded={groupBar}
              aria-label="Opcje grupy"
            >
              <img src={dots} alt="dots" className="h-5 w-5" />
            </button>

            {groupBar && (
              <div className="absolute top-10 right-4 bg-white border rounded-lg shadow-lg w-72 z-10">
                <div className="py-2">
                  <div className="flex gap-2 items-center justify-left px-4">
                    <img src={edit} alt="edit" className="h-5 w-5" />
                    <h1 className="px-4 py-2 font-semibold hover:bg-gray-100 cursor-pointer">
                      Zmień nazwę grupy
                    </h1>
                  </div>
                  <div className="flex gap-2 items-center justify-left px-4">
                    <img src={invite} alt="invite" className="h-5 w-5" />
                    <h1 className="px-4 py-2 font-semibold hover:bg-gray-100 cursor-pointer">
                      Zaproś inne osoby
                    </h1>
                  </div>
                  <div className="flex gap-2 items-center justify-left px-4">
                    <img src={leave} alt="leave" className="h-5 w-5" />
                    <h1 className="px-4 py-2 font-semibold hover:bg-gray-100 text-red-400 cursor-pointer">
                      Opuść grupę
                    </h1>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 p-5 h-[92.26%] overflow-y-auto">
          <div className="flex gap-2 items-center">
            <h1 className="font-medium text-black text-lg">Uczestnicy</h1>
            <span className="bg-purple-50 text-primary text-xs font-bold px-2 py-1 rounded-full">
              4
            </span>
          </div>
          <Users
            color="red"
            userName="Anna Kowalska"
            userAcronym="AK"
            userStatus={true}
          />
          <Users
            color="blue"
            userName="Jan Nowak"
            userAcronym="JN"
            userStatus={false}
          />
          <Users
            color="green"
            userName="Maria Wiśniewska"
            userAcronym="MW"
            userStatus={false}
          />
          <Users
            color="yellow"
            userName="Piotr Zieliński"
            userAcronym="PZ"
            userStatus={false}
          />
          <div className="w-full mt-2">
            <hr className="border-t-1 border-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
