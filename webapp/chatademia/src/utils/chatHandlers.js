export const handleCreateChat = async (chatName, setChats, setSelectedChatId, setInviteLink, setShowSuccessPopup) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/chat/create-chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: chatName,
          color: Math.floor(Math.random() * 10),
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

    console.log("Utworzono czat, odpowiedź z serwera:", data);

    // Add new chat to the list
    setChats((prevChats) => [data, ...prevChats]);

    // Set the new chat as selected
    setSelectedChatId(data.id);

    // Set invite link and show success popup
    setInviteLink(
      data.inviteLink || `${window.location.origin}/invite/${data.id}`
    );
    setShowSuccessPopup(true);
  } catch (error) {
    console.error("Błąd podczas tworzenia czatu:", error);
    alert("Nie udało się utworzyć czatu. Spróbuj ponownie.");
  }
};

export const handleChatSwitch = async (
  chatId,
  selectedChatId,
  hubConnectionRef,
  setSelectedChatId,
  fetchMessages
) => {
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
