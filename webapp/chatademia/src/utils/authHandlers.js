export const handleLogout = async (navigate) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/session`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(response.status);
    }
  } catch (error) {
    console.error("Błąd podczas wylogowywania:", error);
  } finally {
    navigate("/");
  }
};

export const getUserData = async (setUserData, navigate) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/users/user`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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

    setUserData(data);
    console.log("User data:", data);
  } catch (error) {
    console.error("Błąd podczas pobierania danych użytkownika:", error);
    navigate("/");
  }
};

export const getChatsData = async (setChats, setSelectedChatId, navigate) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/users/chats`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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

    setChats(data);

    if (data.length > 0) {
      setSelectedChatId(data[0].id);
    }

    if (process.env.REACT_APP_DEBUG_ALERTS === "true")
      console.log("Odpowiedź z serwera (chats):" + JSON.stringify(data));
  } catch (error) {
    console.error("Błąd podczas pobierania danych użytkownika:", error);
    navigate("/");
  }
};
