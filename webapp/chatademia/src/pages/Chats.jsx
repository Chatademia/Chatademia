import MessageItem from "../components/Message.jsx";
import icon from "../assets/icon.png";
import ChatItem from "../components/Chat.jsx";
import ParticipantItem from "../components/Participant.jsx";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
  PaperClipIcon,
  PlusIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  UserGroupIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";

function Chat({ devMode = false }) {
  const [messageSent, setMessageSent] = useState("");
  const [groupBar, setGroupBar] = useState(false);
  const [logoutBar, setLogoutBar] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const isFirstRender = useRef(true);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const fileInputRef = useRef(null);
  const hubConnectionRef = useRef(null);
  const [userData, setUserData] = useState({
    firstName: null,
    lastName: null,
    id: null,
    color: null,
  });
  const [chats, setChats] = useState([
    {
      id: 1,
      color: "red",
      shortName: "IO",
      name: "Inżynieria Oprogramowania (gr. 24)",
      participants: [
        {
          id: 1,
          firstName: "Anna",
          lastName: "Kowalska",
          shortName: "AK",
          color: "A",
        },
        {
          id: 2,
          firstName: "Jan",
          lastName: "Nowak",
          shortName: "JN",
          color: "B",
        },
        {
          id: 3,
          firstName: "Maria",
          lastName: "Wiśniewska",
          shortName: "MW",
          color: "C",
        },
        {
          id: 4,
          firstName: "Piotr",
          lastName: "Zieliński",
          shortName: "PZ",
          color: "D",
        },
      ],
    },
    {
      id: 2,
      color: "blue",
      shortName: "SI",
      name: "Sztuczna Inteligencja (gr. 11)",
      participants: [],
    },
    {
      id: 3,
      color: "green",
      shortName: "AM",
      name: "Analiza Matematyczna 1 (gr. 10)",
      participants: [],
    },
    {
      id: 4,
      color: "yellow",
      shortName: "PP",
      name: "Podstawy programowania (gr. 14)",
      participants: [],
    },
    {
      id: 5,
      color: "green",
      shortName: "ZR",
      name: "Zbiory Rozmyte (gr. 12)",
      participants: [],
    },
  ]);
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const allowedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "image/jpeg",
    "image/png",
    "image/gif",
  ];
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
      createdAt: "2025-12-11T22:29:06.3840716+00:00",
      type: "message",
    },
    {
      id: 2,
      senderId: 2,
      content: "snwdwd",
      createdAt: "2025-12-11T22:30:06.3840716+00:00",
      type: "message",
    },
    {
      id: 3,
      senderId: userData.id,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      createdAt: "2025-12-11T22:31:06.3840716+00:00",
      type: "message",
    },
    {
      id: 4,
      senderId: 3,
      content: "Dokument wizji projektu.pdf",
      createdAt: "2025-12-11T22:32:06.3840716+00:00",
      type: "file",
    },
    {
      id: 5,
      senderId: userData.id,
      content: "Schemat bazy danych.png",
      createdAt: "2025-12-11T22:33:06.3840716+00:00",
      type: "file",
    },
    {
      id: 6,
      senderId: 1,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      createdAt: "2025-12-11T22:34:06.3840716+00:00",
      type: "message",
    },
    {
      id: 7,
      senderId: 2,
      content: "snwdwd",
      createdAt: "2025-12-11T22:35:06.3840716+00:00",
      type: "message",
    },
    {
      id: 8,
      senderId: userData.id,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      createdAt: "2025-12-11T22:36:06.3840716+00:00",
      type: "message",
    },
    {
      id: 9,
      senderId: 3,
      content: "Dokument wizji projektu.pdf",
      createdAt: "2025-12-11T22:37:06.3840716+00:00",
      type: "file",
    },
    {
      id: 10,
      senderId: userData.id,
      content: "Schemat bazy danych.png",
      createdAt: "2025-12-11T22:38:06.3840716+00:00",
      type: "file",
    },
  ]);

  const [selectedChatId, setSelectedChatId] = useState(null);

  const todaysDate = new Date();

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

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

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert(
          `Plik jest za duży. Maksymalny rozmiar to ${
            MAX_FILE_SIZE / 1024 / 1024
          }MB`
        );

        event.target.value = "";
        return;
      }

      if (!allowedFileTypes.includes(file.type)) {
        alert(
          "Nieprawidłowy typ pliku. Dozwolone rozszerzenia: PDF, DOC, DOCX, TXT, JPG, PNG, GIF"
        );
        event.target.value = "";
        return;
      }

      handleSendAttachment(selectedChatId, file);
    }
  };

  const handleSendAttachment = async (chatId, file) => {
    // TODO: Zaimplementować logikę wysyłania załączników
    console.log("Wysłano załącznik:", file.name);
  };

  const handleChatSwitch = async (chatId) => {
    // Leave previous chat subscription
    if (hubConnectionRef.current && selectedChatId) {
      try {
        await hubConnectionRef.current.invoke(
          "QuitChatSubscription",
          selectedChatId
        );
      } catch (error) {
        console.error("Błąd podczas opuszczania subskrypcji czatu:", error);
      }
    }

    setSelectedChatId(chatId);

    // Join new chat subscription
    if (hubConnectionRef.current) {
      try {
        await hubConnectionRef.current.invoke("JoinChatSubscription", chatId);
      } catch (error) {
        console.error("Błąd podczas dołączania do subskrypcji czatu:", error);
      }
    }

    // Fetch messages for the selected chat from the backend
    await fetchMessages(chatId);
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/chat-messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: chatId,
          }),
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

      console.log("Pobrano wiadomości:", data);
      setMessages(data);
    } catch (error) {
      console.error("Błąd podczas pobierania wiadomości:", error);
    }
  };

  const handleSendMessage = async (chatId, content) => {
    // Send message to the backend
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: chatId,
            content: content,
          }),
          credentials: "include", // Send cookie with session token
        }
      );

      const responseText = await response.text();
      setMessageSent("");

      if (!response.ok) {
        throw new Error(response.status);
      }

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

      console.log("Wysłano wiadomość:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    } catch (error) {
      console.error("Błąd podczas wysyłania wiadomości:", error);
    }
  };

  const handleDeleteMessage = async (chatId, messageId) => {
    // Delete message on the backend
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/message`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: chatId,
            messageId: messageId,
          }),
          credentials: "include", // Send cookie with session token
        }
      );

      if (!response.ok) {
        throw new Error(response.status);
      } else {
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message.id !== messageId)
        );
        console.log("Usunięto wiadomość o id:", messageId);
      }
    } catch (error) {
      console.error("Błąd podczas usuwania wiadomości:", error);
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

        // Set first chat as selected if available
        if (data.length > 0) {
          setSelectedChatId(data[0].id);
        }

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

  // SignalR connection setup
  useEffect(() => {
    const setupSignalR = async () => {
      // Wait for userData and selectedChatId to be loaded
      if (!userData.id || !selectedChatId) {
        console.log("Czekanie na załadowanie danych użytkownika i czatu...");
        return;
      }

      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${process.env.REACT_APP_BACKEND_URL}/chatademia/chatHub`, {
          withCredentials: true,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Handle incoming messages
      connection.on("NEW MSG", async () => {
        console.log("Otrzymano nową wiadomość, odświeżanie...");
        if (selectedChatId) {
          await fetchMessages(selectedChatId);
        }
      });

      try {
        await connection.start();
        console.log("SignalR połączony");
        hubConnectionRef.current = connection;

        // Join initial chat subscription
        try {
          await connection.invoke("JoinChatSubscription", selectedChatId);

          // Load messages for the selected chat
          await fetchMessages(selectedChatId);
        } catch (error) {
          console.error("Błąd podczas przełączania czatów:", error);
        }
      } catch (error) {
        console.error("Błąd połączenia SignalR:", error);
      }
    };

    if (userData.id && selectedChatId) {
      setupSignalR();
    }

    // Cleanup on unmount
    return () => {
      if (hubConnectionRef.current) {
        hubConnectionRef.current.stop();
      }
    };
  }, [selectedChatId, userData.id]);

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
            {/* <ChevronDownIcon className="size-6" color="currentColor" /> */}
          </div>
          <div className="rounded-full bg-primary text-white overflow-visible h-8 w-8 flex justify-center items-center cursor-pointer">
            <PlusIcon className="size-6" color="currentColor" />
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
              onClick={() => handleChatSwitch(chat.id)}
            />
          ))}
        </div>
        <button
          className="h-[6.94%] flex p-5 gap-3 justify-start items-center"
          type="button"
          onClick={() => setLogoutBar((s) => !s)}
          aria-expanded={logoutBar}
          aria-label="Opcje użytkownika"
        >
          <div
            className={`rounded-xl text-white flex items-center justify-center w-10 h-10 focus:outline-none ${
              colors[userData.color]
            }`}
          >
            <h1 className="text-xl font-black">
              {(userData.firstName?.[0] || "").toUpperCase()}
              {(userData.lastName?.[0] || "").toUpperCase()}
            </h1>
          </div>

          <h1 className="font-semibold text-sm text-black">
            {userData.firstName} {userData.lastName}
          </h1>
        </button>

        {logoutBar && (
          <div className="absolute bottom-14 left-4 bg-white border rounded-lg shadow-lg w-72 z-10">
            <button
              className="flex gap-2 items-center justify-left px-4"
              onClick={() => handleLogout()}
            >
              <ArrowRightStartOnRectangleIcon
                className="size-6"
                color="#f87171"
              />
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
              const isMenuOpen = selectedMessageId === message.id;

              return (
                <div key={message.id} className="relative">
                  <MessageItem
                    message={message}
                    isOwnMessage={isOwnMessage}
                    senderShortName={sender?.shortName}
                    senderColor={colors[sender?.color]}
                    formatTimestamp={formatTimestamp}
                    onClick={() =>
                      isOwnMessage &&
                      setSelectedMessageId(isMenuOpen ? null : message.id)
                    }
                  />
                  {isMenuOpen && isOwnMessage && (
                    <div className="absolute bottom-10 right-10 bg-white border rounded-lg shadow-lg w-48 z-10">
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          handleDeleteMessage(selectedChatId, message.id);
                          setSelectedMessageId(null);
                        }}
                      >
                        <h1 className="font-semibold text-red-400 cursor-pointer">
                          Usuń wiadomość
                        </h1>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="h-[9.375%] p-5 flex gap-5 items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: "none" }}
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
          />
          <button onClick={() => fileInputRef.current?.click()}>
            <PaperClipIcon className="size-6" color="currentColor" />
          </button>
          <div className="relative w-full">
            <input
              className="w-full rounded-lg border border-gray-200 py-3 text-gray-700 text-xs px-2"
              placeholder="Wprowadź wiadomość"
              value={messageSent}
              onChange={(e) => setMessageSent(e.target.value)}
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => handleSendMessage(selectedChatId, messageSent)}
            >
              <PaperAirplaneIcon className="size-6" color="#5004e0" />
            </button>
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
              <EllipsisVerticalIcon className="size-6" color="currentColor" />
            </button>

            {groupBar && (
              <div className="absolute top-10 right-4 bg-white border rounded-lg shadow-lg w-72 z-10">
                <div className="py-2">
                  <div className="flex gap-2 items-center justify-left px-4">
                    <PencilSquareIcon className="size-6" color="currentColor" />

                    <h1 className="px-4 py-2 font-semibold hover:bg-gray-100 cursor-pointer">
                      Zmień nazwę grupy
                    </h1>
                  </div>
                  <div className="flex gap-2 items-center justify-left px-4">
                    <UserGroupIcon className="size-6" color="currentColor" />
                    <h1 className="px-4 py-2 font-semibold hover:bg-gray-100 cursor-pointer">
                      Zaproś inne osoby
                    </h1>
                  </div>
                  <div className="flex gap-2 items-center justify-left px-4">
                    <ArrowRightStartOnRectangleIcon
                      className="size-6"
                      color="#f87171"
                    />

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
