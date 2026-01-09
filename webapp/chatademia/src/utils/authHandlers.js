export const handleLoginRedirect = async (loginPopupRef) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/login-url?callbackUrl=${process.env.REACT_APP_FRONTEND_URL}/auth/callback`,
      {
        method: "GET",
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Nie udało się pobrać URL logowania");
    }

    const data = await response.text();

    console.log("Otrzymany URL logowania: ", data);
    if (!data) {
      throw new Error("Nieprawidłowa odpowiedź z serwera");
    }

    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    loginPopupRef.current = window.open(
      data,
      "loginPopup",
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    );
  } catch (error) {
    console.error("Wystąpił błąd podczas pobierania URL logowania: ", error);
  }
};

export const handleGoogleLoginRedirect = async (loginPopupRef) => {
  try {
    const callbackUrl = `${process.env.REACT_APP_FRONTEND_URL}/auth/google/callback`;
    const response = await fetch(
      `${
        process.env.REACT_APP_BACKEND_URL
      }/api/auth/google/login-url?callbackUrl=${encodeURIComponent(
        callbackUrl
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Nie udało się pobrać URL logowania Google");
    }

    const data = await response.text();

    console.log("Otrzymany URL logowania Google: ", data);
    if (!data) {
      throw new Error("Nieprawidłowa odpowiedź z serwera");
    }

    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    loginPopupRef.current = window.open(
      data,
      "googleLoginPopup",
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    );
  } catch (error) {
    console.error(
      "Wystąpił błąd podczas pobierania URL logowania Google: ",
      error
    );
    alert("Wystąpił błąd podczas logowania. Spróbuj ponownie.");
  }
};

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

    // Sort chats by semester (descending), then alphabetically by name
    const sortedChats = [...data].sort((a, b) => {
      // First sort by semester (descending)
      const semesterDiff = (b.semester || 0) - (a.semester || 0);
      if (semesterDiff !== 0) return semesterDiff;
      // Then sort alphabetically by name
      if (!a.name || !b.name) return 0;
      return a.name.localeCompare(b.name, { sensitivity: "base" });
    });
    setChats(sortedChats);

    if (sortedChats.length > 0) {
      setSelectedChatId(sortedChats[0].id);
    }

    if (process.env.REACT_APP_DEBUG_ALERTS === "true")
      console.log("Odpowiedź z serwera (chats):" + JSON.stringify(data));
  } catch (error) {
    console.error("Błąd podczas pobierania danych użytkownika:", error);
    navigate("/");
  }
};
