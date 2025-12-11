import MessageItem from "../components/Message.jsx";
import icon from "../assets/icon.png";
import arrowDown from "../assets/arrowDown.svg";
import plus from "../assets/plus.svg";
import ChatItem from "../components/Chat.jsx";
import dots from "../assets/dotsPrimary.svg";
import ParticipantItem from "../components/Participant.jsx";
import React, { useEffect, useState, useRef } from "react";
import edit from "../assets/edit.svg";
import invite from "../assets/users.svg";
import leave from "../assets/logoutRed.svg";
import { useNavigate } from "react-router-dom";

function Chat({ devMode = false }) {
  const [groupBar, setGroupBar] = useState(false);
  const [logoutBar, setLogoutBar] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const isFirstRender = useRef(true);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    id: "",
  });
  const [chats, setChats] = useState([]);

  const colors = {
    0: "bg-red-500",
    1: "bg-blue-500",
    2: "bg-green-500",
    3: "bg-yellow-500",
    4: "bg-purple-500",
    5: "bg-orange-500",
    6: "bg-pink-500",
    7: "bg-teal-500",
    8: "bg-indigo-500",
    9: "bg-cyan-500",
  };

  const [messages, setMessages] = useState([
    // Dummy messages
    {
      id: 1,
      senderId: 1,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      timestamp: "1765215088",
      type: "message",
    },
    {
      id: 2,
      senderId: 2,
      content: "snwdwd",
      timestamp: "1765215188",
      type: "message",
    },
    {
      id: 3,
      senderId: userData.id,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      timestamp: "1765215288",
      type: "message",
    },
    {
      id: 4,
      senderId: 3,
      content: "Dokument wizji projektu.pdf",
      timestamp: "1765215388",
      type: "file",
    },
    {
      id: 5,
      senderId: userData.id,
      content: "Schemat bazy danych.png",
      timestamp: "1765215488",
      type: "file",
    },
    {
      id: 6,
      senderId: 1,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      timestamp: "1765215088",
      type: "message",
    },
    {
      id: 7,
      senderId: 2,
      content: "snwdwd",
      timestamp: "1765215188",
      type: "message",
    },
    {
      id: 8,
      senderId: userData.id,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      timestamp: "1765215288",
      type: "message",
    },
    {
      id: 9,
      senderId: 3,
      content: "Dokument wizji projektu.pdf",
      timestamp: "1765215388",
      type: "file",
    },
    {
      id: 10,
      senderId: userData.id,
      content: "Schemat bazy danych.png",
      timestamp: "1765215488",
      type: "file",
    },
  ]);

  const [selectedChatId, setSelectedChatId] = useState(1);

  const todaysDate = new Date();

  const formatTimestamp = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000);

    const isToday =
      date.getDate() === todaysDate.getDate() &&
      date.getMonth() === todaysDate.getMonth() &&
      date.getFullYear() === todaysDate.getFullYear();

    const HH = String(date.getHours()).padStart(2, "0");
    const MM = String(date.getMinutes()).padStart(2, "0");

    if (isToday) {
      return `${HH}:${MM}`;
    } else {
      const DD = String(date.getDate()).padStart(2, "0");
      const MM2 = String(date.getMonth() + 1).padStart(2, "0");
      const YYYY = date.getFullYear();

      return `${HH}:${MM} ${DD}.${MM2}.${YYYY}`;
    }
  };

  const handleLogout = async () => {
    try {
      // Terminate session on the backend
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/session`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Send cookie with session token
        }
      );

      if (!response.ok) {
        throw new Error(response.status);
      }
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    } finally {
      // Backend will clear the cookie, redirect to home page
      navigate("/");
    }
  };

  useEffect(() => {
    if (devMode) {
      // w trybie deweloperskim pomijamy sprawdzanie sesji
      return;
    }

    const getUserData = async () => {
      try {
        // Get user data
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/user`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Send cookie with session token
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
        console.log("User data:", data);
      } catch (error) {
        console.error("Błąd podczas pobierania danych użytkownika:", error);
        navigate("/");
      }
    };

    getUserData();

    const getChatsData = async () => {
      try {
        // Get chats data
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/chats`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Send cookie with session token
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

        // Set chats data
        setChats(data);
        //////////////// Debug ///////////////////
        if (process.env.REACT_APP_DEBUG_ALERTS === "true")
          console.log("Odpowiedź z serwera (chats):" + JSON.stringify(data));
        //////////////// Debug ///////////////////
      } catch (error) {
        console.error("Błąd podczas pobierania danych użytkownika:", error);
        navigate("/");
      }
    };

    getChatsData();
  }, [navigate, devMode]);

  useEffect(() => {
    if (isFirstRender.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      isFirstRender.current = false;
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedChatId]);

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
            <ChatItem
              key={chat.id}
              isActive={chat.id === selectedChatId}
              color={colors[chat.color]}
              chatShortName={chat.shortName}
              chatName={chat.name}
              onClick={() => setSelectedChatId(chat.id)}
            />
          ))}
        </div>
        <div className="h-[6.94%] flex p-5 gap-3 justify-start items-center">
          <button
            type="button"
            onClick={() => setLogoutBar((s) => !s)}
            aria-expanded={logoutBar}
            aria-label="Opcje użytkownika"
            className="rounded-xl bg-orange-500 text-white flex items-center justify-center w-10 h-10 focus:outline-none"
          >
            <h1 className="text-xl font-black">
              {(userData.firstName?.[0] || "").toUpperCase()}
              {(userData.lastName?.[0] || "").toUpperCase()}
            </h1>
          </button>

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
            className={`rounded-xl text-white ${
              colors[chats.find((chat) => chat.id === selectedChatId)?.color]
            }  flex items-center justify-center w-12 h-12`}
          >
            <h1 className="text-2xl font-black">
              {chats.find((chat) => chat.id === selectedChatId)?.shortName}
            </h1>
          </div>
          <h1 className="font-semibold text-xl text-black">
            {chats.find((chat) => chat.id === selectedChatId)?.name}
          </h1>
        </div>
        <div className="bg-white h-[82.885%] overflow-y-auto">
          <div className="p-5 flex flex-col gap-4">
            {messages.map((message) => {
              const isOwnMessage = message.senderId === userData.id;
              const sender = chats
                .find((chat) => chat.id === selectedChatId)
                ?.participants?.find((p) => p.id === message.senderId);

              return (
                <MessageItem
                  key={message.id}
                  message={message}
                  isOwnMessage={isOwnMessage}
                  senderShortName={sender?.shortName}
                  senderColor={colors[sender?.color]}
                  formatTimestamp={formatTimestamp}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
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
              className="w-full rounded-lg border border-gray-200 py-3 text-gray-700 text-xs px-2"
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
              {chats.find((chat) => chat.id === selectedChatId)?.participants
                ?.length || 0}
            </span>
          </div>
          {chats
            .find((chat) => chat.id === selectedChatId)
            ?.participants?.map((participant) => (
              <ParticipantItem
                key={participant.id}
                color={colors[participant.color]}
                participantFirstName={participant.firstName}
                participantLastName={participant.lastName}
                participantShortName={participant.shortName}
                participantStatus={false}
              />
            ))}
          <div className="w-full mt-2">
            <hr className="border-t-1 border-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
