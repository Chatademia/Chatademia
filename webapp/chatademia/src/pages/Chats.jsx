import MessageItem from "../components/Message.jsx";
import icon from "../assets/icon.png";
import ChatItem from "../components/Chat.jsx";
import ParticipantItem from "../components/Participant.jsx";
import CreateChatPopup from "../components/CreateChatPopup.jsx";
import CreateChatSuccessPopup from "../components/CreateChatSuccessPopup.jsx";
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr";

// Auth handlers
import {
  handleLogout,
  getUserData,
  getChatsData,
} from "../utils/authHandlers.js";

// Format utilities
import { formatTimestamp } from "../utils/formatTimestamp.js";

// File handlers
import { handleFileSelect } from "../utils/handleFileSelect.js";

// Chat handlers
import {
  handleCreateChat,
  handleChatSwitch,
  handleJoinChat,
} from "../utils/chatHandlers.js";

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
  ArrowRightEndOnRectangleIcon,
  TrashIcon,
  UserMinusIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import JoinChatPopup from "../components/JoinChatPopup.jsx";
import InviteCodePopup from "../components/InviteCodePopup.jsx";
import { XMarkIcon } from "@heroicons/react/24/outline";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/jpeg",
  "image/png",
  "image/gif",
];
const COLORS = {
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

function Chat({ devMode = false }) {
  const [messageSent, setMessageSent] = useState("");
  const [groupBar, setGroupBar] = useState(false);
  const [logoutBar, setLogoutBar] = useState(false);
  const [leaveChatConfirm, setLeaveChatConfirm] = useState(false);
  const [removeParticipantId, setRemoveParticipantId] = useState(null);
  const [removeParticipantConfirm, setRemoveParticipantConfirm] =
    useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const isFirstRender = useRef(true);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const fileInputRef = useRef(null);
  const hubConnectionRef = useRef(null);
  const groupBarRef = useRef(null);
  const newGroupPopupRef = useRef(null);
  const participantsAreaRef = useRef(null);
  const logoutBarRef = useRef(null);
  const [newGroupPopup, setNewGroupPopup] = useState(false);
  const [showCreateChatPopup, setShowCreateChatPopup] = useState(false);
  const [showJoinChatPopup, setShowJoinChatPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showInviteCodePopup, setShowInviteCodePopup] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [userData, setUserData] = useState({
    firstName: null,
    lastName: null,
    id: null,
    color: null,
  });
  const [chats, setChats] = useState([]);

  const [messages, setMessages] = useState([]);

  const [selectedChatId, setSelectedChatId] = useState(null);

  const { favoriteChats, nonFavoriteChats } = useMemo(() => {
    const favorites = chats.filter((chat) => chat.isFavorite);
    const nonFavorites = chats.filter((chat) => !chat.isFavorite);

    return {
      favoriteChats: favorites,
      nonFavoriteChats: nonFavorites,
    };
  }, [chats]);

  const selectedChat = useMemo(() => {
    return chats.find((chat) => chat.id === selectedChatId);
  }, [chats, selectedChatId]);

  const participantsMap = useMemo(() => {
    if (!selectedChat?.participants) return {};
    return selectedChat.participants.reduce((acc, participant) => {
      acc[participant.id] = participant;
      return acc;
    }, {});
  }, [selectedChat?.participants]);

  const handleSendAttachment = useCallback(async (chatId, file) => {
    if (!file || !chatId) {
      return;
    }
    // Send message with attachment to the backend
    try {
      const formData = new FormData();
      formData.append("chatId", chatId);
      formData.append("file", file);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/message`,
        {
          method: "POST",
          body: formData, // Send file and chatId as FormData
          credentials: "include", // Send cookie with session token
        }
      );

      const responseText = await response.text();

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

      // Add new message to the list
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log("Wysłano załącznik:", data);
    } catch (error) {
      console.error("Błąd podczas wysyłania załącznika:", error);
      alert("Nie udało się wysłać załącznika. Spróbuj ponownie.");
    }
  }, []);

  const handleShowInviteCodePopup = () => {
    if (!selectedChatId || !selectedChat?.inviteCode?.length > 0) return;
    else {
      setInviteCode(selectedChat.inviteCode);
      setShowInviteCodePopup(true);
    }
  };

  const fetchMessages = useCallback(async (chatId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/chat-messages/${chatId}`,
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

      console.log("Pobrano wiadomości:", data);
      setMessages(data);
    } catch (error) {
      console.error("Błąd podczas pobierania wiadomości:", error);
    }
  }, []);

  const handleSendMessage = useCallback(async (chatId, content) => {
    if (!content.trim() || !chatId) {
      return;
    }
    // Send message to the backend
    try {
      const formData = new FormData();
      formData.append("chatId", chatId);
      formData.append("content", content);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/message`,
        {
          method: "POST",
          body: formData, // Send chatId and message as FormData
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

      // Add new message to the list
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log("Wysłano wiadomość:", data);
    } catch (error) {
      console.error("Błąd podczas wysyłania wiadomości:", error);
    }
  }, []);

  const handleDeleteMessage = useCallback(async (chatId, messageId) => {
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
  }, []);

  const handleLeaveChatClick = () => {
    setLeaveChatConfirm(true);
  };

  const handleConfirmLeaveChat = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/leave-chat`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: selectedChatId,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(response.status);
      }

      // Remove chat from the list
      setChats((prevChats) =>
        prevChats.filter((chat) => chat.id !== selectedChatId)
      );

      // Reset states
      setLeaveChatConfirm(false);
      setGroupBar(false);
      setSelectedChatId(null);

      console.log("Opuszczono grupę o id:", selectedChatId);
    } catch (error) {
      console.error("Błąd podczas opuszczania grupy:", error);
      alert("Nie udało się opuścić grupy. Spróbuj ponownie.");
      setLeaveChatConfirm(false);
    }
  };

  const handleCancelLeaveChat = () => {
    setLeaveChatConfirm(false);
  };

  const handleRemoveParticipantClick = (participantId) => {
    // Tylko moderator może usuwać
    if (userData.id !== selectedChat?.moderatorId) {
      alert("Tylko moderator grupy może usuwać użytkowników");
      return;
    }
    // Moderator nie może usunąć siebie
    if (userData.id === participantId) {
      alert("Nie możesz usunąć siebie z grupy");
      return;
    }
    setRemoveParticipantId(participantId);
    setRemoveParticipantConfirm(false);
  };

  const handleConfirmRemoveParticipant = async (participantId) => {
    if (!removeParticipantConfirm) {
      setRemoveParticipantConfirm(true);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/remove-user-as-moderator`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            chatId: selectedChatId,
            userToRemoveId: participantId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Nie udało się usunąć uczestnika");
      }

      // Aktualizacja UI po pomyślnym usunięciu
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === selectedChatId) {
            return {
              ...chat,
              participants: chat.participants.filter(
                (p) => p.id !== participantId
              ),
            };
          }
          return chat;
        })
      );

      setRemoveParticipantId(null);
      setRemoveParticipantConfirm(false);
      alert("Użytkownik został usunięty z grupy");
    } catch (error) {
      console.error("Błąd podczas usuwania uczestnika:", error);
      alert(error.message || "Nie udało się usunąć uczestnika. Spróbuj ponownie.");
      setRemoveParticipantId(null);
      setRemoveParticipantConfirm(false);
    }
  };

  const handleCancelRemoveParticipant = () => {
    setRemoveParticipantId(null);
    setRemoveParticipantConfirm(false);
  };

  // Zamykaj popup usuwania przy kliknięciu poza listą uczestników
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        removeParticipantId &&
        participantsAreaRef.current &&
        !participantsAreaRef.current.contains(event.target)
      ) {
        handleCancelRemoveParticipant();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [removeParticipantId]);

  const handleToggleFavorite = async () => {
    if (!selectedChatId) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/favorite-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: selectedChatId,
            isFavorite: !selectedChat.isFavorite,
          }),
          credentials: "include",
        }
      );

      const responseText = await response.text();

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

      // Update chats list
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === selectedChatId) {
            return {
              ...chat,
              isFavorite: data.isFavorite,
            };
          }
          return chat;
        })
      );
    } catch (error) {
      console.error("Błąd podczas zmiany statusu ulubionych:", error);
      alert("Nie udało się zmienić statusu ulubionych. Spróbuj ponownie.");
    }
  };

  useEffect(() => {
    if (devMode) {
      return;
    }

    getUserData(setUserData, navigate);
    getChatsData(setChats, setSelectedChatId, navigate);
  }, [navigate, devMode]);

  // Close message menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedMessageId) {
        const messageElement = event.target.closest(
          `[data-message-id="${selectedMessageId}"]`
        );
        if (!messageElement) {
          setSelectedMessageId(null);
        }
      }
    };

    if (selectedMessageId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedMessageId]);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (groupBarRef.current && !groupBarRef.current.contains(event.target)) {
        setGroupBar(false);
      }
      if (
        newGroupPopupRef.current &&
        !newGroupPopupRef.current.contains(event.target)
      ) {
        setNewGroupPopup(false);
      }
      if (
        logoutBarRef.current &&
        !logoutBarRef.current.contains(event.target)
      ) {
        setLogoutBar(false);
      }
    };

    if (groupBar || newGroupPopup || logoutBar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [groupBar, newGroupPopup, logoutBar]);

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

      connection.on("MSG DEL", async () => {
        console.log("Otrzymano usunięcie wiadomości, odświeżanie...");
        if (selectedChatId) {
          await fetchMessages(selectedChatId);
          console.log("Wiadomość usunięta!");
        }
      });

      // connection.on("USER JOINED", async () => {
      //   console.log("Otrzymano nową wiadomość, odświeżanie...");
      //   if (selectedChatId) {
      //     await fetchChatDetails(selectedChatId);
      //     console.log("Nowy użytkownik dołączył!");
      //   }
      // });

      // connection.on("USER LEFT", async () => {
      //   console.log("Otrzymano nową wiadomość o wyjściu użytkownika, odświeżanie...");
      //   if (selectedChatId) {
      //     await fetchChatDetails(selectedChatId);
      //     console.log("Nowy użytkownik dołączył!");
      //   }
      // });


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
        <div
          className=" flex gap-2 pr-4 px-5 h-[7.74%] border-b items-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setSelectedChatId(null)}
        >
          <img src={icon} alt="Logo" className="h-12 w-12" />
          <h1 className="text-4xl font-bold text-primary overflow-hidden">
            Chatademia
          </h1>
        </div>
        <div className=" flex gap-2 h-[8.63%] justify-between border-b items-center p-5">
          <div className="flex gap-2 items-center overflow-hidden">
            <h1 className="font-semibold text-black text-xl overflow-hidden whitespace-nowrap text-ellipsis">
              Czaty grupowe
            </h1>
          </div>
          <button
            className="rounded-full bg-primary text-white overflow-hidden h-8 w-8 flex justify-center items-center cursor-pointer hover:scale-110 transition-all duration-200"
            type="button"
            onClick={() => setNewGroupPopup((s) => !s)}
          >
            <PlusIcon className="size-6" color="currentColor" />
          </button>
          {newGroupPopup && (
            <div
              ref={newGroupPopupRef}
              className="absolute top-36 left-16 bg-white border rounded-lg shadow-lg w-80 z-10"
            >
              <button
                className="flex gap-1 items-center justify-left w-full px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                onClick={() => {
                  setNewGroupPopup(false);
                  setShowCreateChatPopup(true);
                }}
              >
                <UserGroupIcon className="size-6" />
                <h1 className="px-4 py-2 font-semibold cursor-pointer line-clamp-1">
                  Utwórz czat niestandardowy
                </h1>
              </button>
              <button
                className="flex gap-1 items-center justify-left w-full px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                onClick={() => {
                  setNewGroupPopup(false);
                  setShowJoinChatPopup(true);
                }}
              >
                <ArrowRightEndOnRectangleIcon className="size-6" />
                <h1 className="px-4 py-2 font-semibold cursor-pointer line-clamp-1">
                  Dołącz do istniejącego czatu
                </h1>
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 p-5 border-b h-[76.77%] overflow-y-auto">
          {favoriteChats.length > 0 && (
            <>
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-gray-300"></div>
                <h2 className="text-sm font-semibold text-gray-500 px-2">
                  Ulubione
                </h2>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
              {favoriteChats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  isActive={chat.id === selectedChatId}
                  color={COLORS[chat.color]}
                  chatShortName={chat.shortName}
                  chatName={chat.name}
                  onClick={() =>
                    handleChatSwitch(
                      chat.id,
                      selectedChatId,
                      hubConnectionRef,
                      setSelectedChatId,
                      fetchMessages
                    )
                  }
                />
              ))}
            </>
          )}
          {nonFavoriteChats.map((chat, index) => {
            const showSemesterHeader =
              index === 0 ||
              chat.semester !== nonFavoriteChats[index - 1]?.semester;

            return (
              <React.Fragment key={chat.id}>
                {showSemesterHeader && (
                  <div className="flex items-center gap-3 my-2">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <h2 className="text-sm font-semibold text-gray-500 px-2">
                      {chat.semester ? `Semestr ${chat.semester}` : "Pozostałe"}
                    </h2>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>
                )}
                <ChatItem
                  isActive={chat.id === selectedChatId}
                  color={COLORS[chat.color]}
                  chatShortName={chat.shortName}
                  chatName={chat.name}
                  onClick={() =>
                    handleChatSwitch(
                      chat.id,
                      selectedChatId,
                      hubConnectionRef,
                      setSelectedChatId,
                      fetchMessages
                    )
                  }
                />
              </React.Fragment>
            );
          })}
        </div>
        <button
          className="h-[6.94%] flex p-5 gap-3 justify-start items-center hover:bg-gray-100 transition-colors duration-150 rounded-lg"
          type="button"
          onClick={() => setLogoutBar((s) => !s)}
          aria-expanded={logoutBar}
          aria-label="Opcje użytkownika"
        >
          <div
            className={`rounded-xl text-white flex items-center justify-center w-10 h-10 aspect-square focus:outline-none ${
              COLORS[userData.color]
            }`}
          >
            <h1 className="text-xl font-black">
              {(userData.firstName?.[0] || "").toUpperCase()}
              {(userData.lastName?.[0] || "").toUpperCase()}
            </h1>
          </div>

          <h1 className="font-semibold text-sm text-black overflow-hidden whitespace-nowrap text-ellipsis">
            {userData.firstName} {userData.lastName}
          </h1>
        </button>

        {logoutBar && (
          <div
            ref={logoutBarRef}
            className="absolute bottom-14 left-4 bg-white border rounded-lg shadow-lg w-72 z-10"
          >
            <button
              className="w-full flex gap-2 items-center justify-left px-4 py-2 hover:bg-red-50 rounded-lg transition-colors duration-150"
              onClick={() => handleLogout(navigate)}
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
      {selectedChatId ? (
        <>
          <div className="w-1/2 border">
            <div className=" flex gap-4  h-[7.74%] justify-center p-5 border-b items-center">
              <div
                className={`rounded-xl text-white aspect-square ${
                  COLORS[selectedChat?.color]
                }  flex items-center justify-center w-12 h-12`}
              >
                <h1 className="text-2xl font-black">
                  {selectedChat?.shortName}
                </h1>
              </div>
              <h1 className="font-semibold text-xl text-black overflow-hidden whitespace-nowrap text-ellipsis">
                {selectedChat?.name}
              </h1>
            </div>
            <div className="bg-white h-[82.885%] overflow-y-auto">
              <div className="p-5 flex flex-col gap-4">
                {messages.map((message) => {
                  const isOwnMessage = message.senderId === userData.id;
                  const sender = participantsMap[message.senderId];
                  const isMenuOpen = selectedMessageId === message.id;
                  return (
                    <div
                      key={message.id}
                      className="relative"
                      data-message-id={message.id}
                    >
                      <MessageItem
                        message={message}
                        isOwnMessage={isOwnMessage}
                        senderShortName={sender?.shortName}
                        senderColor={COLORS[sender?.color]}
                        formatTimestamp={formatTimestamp}
                        onClick={() => {
                          if (isOwnMessage) {
                            setSelectedMessageId(
                              isMenuOpen ? null : message.id
                            );
                          }
                        }}
                      />
                      {isMenuOpen && isOwnMessage && (
                        <div className="absolute bottom-10 right-10 bg-white border rounded-lg shadow-lg z-10">
                          <button
                            className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-red-50 rounded-lg transition-colors duration-150"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMessage(selectedChatId, message.id);
                              setSelectedMessageId(null);
                            }}
                          >
                            <TrashIcon className="size-5 text-red-400" />
                            <h1 className="font-semibold text-red-400 cursor-pointer">
                              Usuń wiadomość u wszystkich
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
                onChange={(event) =>
                  handleFileSelect(
                    event,
                    MAX_FILE_SIZE,
                    ALLOWED_FILE_TYPES,
                    setSelectedFile
                  )
                }
                style={{ display: "none" }}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              />
              {selectedFile ? (
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="hover:scale-110 transition-transform duration-200 cursor-pointer flex items-center justify-center w-fit h-fit text-red-400"
                  title="Usuń załącznik"
                >
                  <XMarkIcon className="size-6" color="currentColor" />
                </button>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="hover:scale-110 transition-transform duration-200 cursor-pointer flex items-center justify-center w-fit h-fit"
                >
                  <PaperClipIcon className="size-6" color="currentColor" />
                </button>
              )}
              <div className="flex gap-3 w-full items-center">
                <textarea
                  className="flex-1 rounded-lg border border-gray-200 py-3 text-gray-700 text-xs px-2 resize-none disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder={
                    selectedFile
                      ? `Wyślij załącznik: ${selectedFile.name}`
                      : "Wprowadź wiadomość"
                  }
                  value={selectedFile ? "" : messageSent}
                  onChange={(e) => setMessageSent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (selectedFile) {
                        handleSendAttachment(selectedChatId, selectedFile);
                        setSelectedFile(null);
                      } else if (messageSent.trim()) {
                        handleSendMessage(selectedChatId, messageSent);
                      }
                    }
                  }}
                  rows={1}
                  autoFocus
                  disabled={!!selectedFile}
                />
                <button
                  className="hover:scale-110 disabled:scale-100 disabled:opacity-50 transition-all duration-200 cursor-pointer flex-shrink-0"
                  onClick={() => {
                    if (selectedFile) {
                      handleSendAttachment(selectedChatId, selectedFile);
                      setSelectedFile(null);
                    } else {
                      handleSendMessage(selectedChatId, messageSent);
                    }
                  }}
                  disabled={!selectedFile && !messageSent.trim()}
                >
                  <PaperAirplaneIcon className="size-6" color="#5004e0" />
                </button>
              </div>
            </div>
          </div>
          <div className="w-1/4 border relative">
            <div className=" flex gap-2 pr-4 h-[7.74%] justify-between p-5 border-b items-center relative">
              <h1 className="font-semibold text-black text-xl">Grupa</h1>
              <div className="relative" ref={groupBarRef}>
                <button
                  onClick={() => setGroupBar((s) => !s)}
                  className="rounded-full h-8 w-8 bg-violet-50 flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-200"
                  aria-expanded={groupBar}
                  aria-label="Opcje grupy"
                >
                  <EllipsisVerticalIcon
                    className="size-6"
                    color="currentColor"
                  />
                </button>

                {groupBar && (
                  <div className="absolute top-10 right-4 bg-white border rounded-lg shadow-lg w-72 z-10">
                    <div className="py-2">
                      <button
                        className="w-full flex gap-2 items-center justify-left px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                        onClick={handleToggleFavorite}
                      >
                        <StarIcon className="size-6" color="currentColor" />
                        <h1 className="px-4 py-2 font-semibold cursor-pointer">
                          {selectedChat?.isFavorite
                            ? "Usuń z ulubionych"
                            : "Dodaj do ulubionych"}
                        </h1>
                      </button>
                      {selectedChat?.inviteCode && (
                        <button
                          className="w-full flex gap-2 items-center justify-left px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                          onClick={handleShowInviteCodePopup}
                        >
                          <UserGroupIcon
                            className="size-6"
                            color="currentColor"
                          />
                          <h1 className="px-4 py-2 font-semibold cursor-pointer">
                            Zaproś inne osoby
                          </h1>
                        </button>
                      )}
                      {!leaveChatConfirm ? (
                        <button
                          className="w-full flex gap-2 items-center justify-left px-4 py-2 hover:bg-red-50 rounded-lg transition-colors duration-150"
                          onClick={handleLeaveChatClick}
                        >
                          <ArrowRightStartOnRectangleIcon
                            className="size-6"
                            color="#f87171"
                          />
                          <h1 className="px-4 py-2 font-semibold text-red-400 cursor-pointer">
                            Opuść grupę
                          </h1>
                        </button>
                      ) : (
                        <div className="px-4 py-2 flex flex-col gap-2">
                          <h1 className="font-semibold text-red-400">
                            Czy na pewno chcesz opuścić grupę?
                          </h1>
                          <div className="flex gap-2">
                            <button
                              className="flex-1 px-3 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors duration-150 font-semibold text-sm"
                              onClick={handleConfirmLeaveChat}
                            >
                              Tak
                            </button>
                            <button
                              className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-150 font-semibold text-sm"
                              onClick={handleCancelLeaveChat}
                            >
                              Nie
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              ref={participantsAreaRef}
              className="flex flex-col gap-4 p-5 h-[92.26%] overflow-y-auto"
              onClick={() => {
                if (removeParticipantId) {
                  handleCancelRemoveParticipant();
                }
              }}
            >
              <div className="flex gap-2 items-center">
                <h1 className="font-medium text-black text-lg">Uczestnicy</h1>
                <span className="bg-purple-50 text-primary text-xs font-bold px-2 py-1 rounded-full">
                  {selectedChat?.participants?.length || 0}
                </span>
              </div>
              {selectedChat?.participants?.map((participant) => (
                <div
                  key={participant.id}
                  className="flex flex-col gap-0"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`rounded-xl aspect-square focus:outline-none ${
                        COLORS[participant.color]
                      } text-white flex items-center justify-center w-12 h-12 ${
                        userData.id === selectedChat?.moderatorId &&
                        userData.id !== participant.id
                          ? "cursor-pointer hover:opacity-80 transition-opacity"
                          : "cursor-default"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          userData.id === selectedChat?.moderatorId &&
                          userData.id !== participant.id
                        ) {
                          handleRemoveParticipantClick(participant.id);
                        }
                      }}
                    >
                      <h1 className="text-2xl font-black">
                        {participant.shortName}
                      </h1>
                    </div>
                    <div className="flex gap-3 flex-1 min-w-0 items-center">
                      <div className="flex gap-3 items-center flex-1 min-w-0">
                        <h1 className="font-semibold text-sm text-black overflow-hidden whitespace-nowrap text-ellipsis">
                          {participant.firstName} {participant.lastName}
                        </h1>
                        {selectedChat?.moderatorId === participant.id && (
                          <div className="inline-flex items-center justify-center bg-orange-100 text-orange-500 text-xs font-bold px-3 py-1 rounded-full w-fit">
                            Moderator
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {removeParticipantId === participant.id && (
                    <div
                      className="flex gap-2 items-center px-3 py-2 bg-white border shadow-md rounded-md cursor-pointer hover:bg-red-50 transition-colors whitespace-nowrap w-fit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmRemoveParticipant(participant.id);
                      }}
                    >
                      <UserMinusIcon className="size-4 text-red-500" />
                      <h1 className="text-xs font-semibold text-red-500">
                        {removeParticipantConfirm
                          ? "Czy na pewno?"
                          : "Wyrzuć uczestnika"}
                      </h1>
                    </div>
                  )}
                </div>
              ))}
              <div className="w-full mt-2">
                <hr className="border-t-1 border-gray-300" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-3/4 border flex items-center justify-center bg-gray-50">
          <h1 className="text-gray-400 text-xl overflow-hidden whitespace-nowrap text-ellipsis">
            Wybierz czat, aby rozpocząć konwersację
          </h1>
        </div>
      )}
      <CreateChatPopup
        isOpen={showCreateChatPopup}
        onClose={() => setShowCreateChatPopup(false)}
        onSubmit={(chatName) =>
          handleCreateChat(
            chatName,
            setChats,
            setSelectedChatId,
            setInviteCode,
            setShowSuccessPopup
          )
        }
      />
      <CreateChatSuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        inviteCode={inviteCode}
      />
      <JoinChatPopup
        isOpen={showJoinChatPopup}
        onClose={() => setShowJoinChatPopup(false)}
        onSubmit={(code) =>
          handleJoinChat(setChats, setSelectedChatId, code)
        }
      />
      <InviteCodePopup
        isOpen={showInviteCodePopup}
        onClose={() => setShowInviteCodePopup(false)}
        inviteCode={inviteCode}
      />
    </div>
  );
}

export default Chat;
