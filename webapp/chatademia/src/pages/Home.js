import "../App.css";
import { useState, useRef, useEffect } from "react";
import appPreview from "../assets/app-preview.png";
import appIcon from "../assets/icon.png";

function Home() {
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const loginPopupRef = useRef(null);

  useEffect(() => {
    const handleCallback = (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "LOGIN_SUCCESS") {
        console.log("Logowanie zakończone sukcesem:", event.data);

        if (loginPopupRef.current && !loginPopupRef.current.closed) {
          loginPopupRef.current.close();
        }

        window.location.href = "/chats";
      }

      if (event.data.type === "LOGIN_ERROR") {
        console.error("Błąd logowania:", event.data.error);
        alert("Wystąpił błąd podczas logowania: " + event.data.error);
      }
    };

    window.addEventListener("message", handleCallback);

    return () => {
      window.removeEventListener("message", handleCallback);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const moveX = -deltaX * 0.01;
    const moveY = -deltaY * 0.01;

    setTransform({ x: moveX, y: moveY });
  };

  const handleMouseLeave = () => {
    setTransform({ x: 0, y: 0 });
  };

  const handleLoginRedirect = async () => {
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

  const handleGoogleLoginRedirect = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/google-login-url?callbackUrl=${process.env.REACT_APP_FRONTEND_URL}/auth/callback`,
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
      alert("Błąd logowania: " + error.message);
    }
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || "",
        callback: handleGoogleLoginRedirect,
      });
    }
  }, []);
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <header className="border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <img src={appIcon} alt="Ikona aplikacji" className="w-14 h-14" />
            <span
              className="text-3xl font-bold ml-2"
              style={{ color: "#5004E0" }}
            >
              Chatademia
            </span>
          </div>
        </div>
      </header>

      <main
        className="container mx-auto px-4 py-6"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 ml-16">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-gray-900">
                Rozmawiaj.
                <br />
                Współpracuj.
                <br />
                Ucz się razem.
              </h1>
            </div>

            <p className="text-xl font-medium text-gray-600 max-w-xl">
              Chatademia to uniwersytecka aplikacja czatowa,<br></br> która
              łączy studentów i ułatwia kontakt w ramach zajęć, projektów i grup
              studenckich.
            </p>

            <div className="flex gap-4 flex-wrap items-center">
              <button
                className="w-14 h-14 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center bg-white"
                onClick={handleGoogleLoginRedirect}
                title="Zaloguj się przez Google"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </button>
              <button
                className="px-8 py-4 bg-white font-semibold rounded-full hover:bg-purple-50 transition-colors"
                style={{
                  borderWidth: "3px",
                  color: "#5004E0",
                  borderColor: "#5004E0",
                }}
                onClick={handleLoginRedirect}
              >
                Zaloguj się
              </button>
              <button
                className="px-24 py-4 text-white font-semibold rounded-full transition-colors"
                style={{ backgroundColor: "#5004E0" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#4003B8")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#5004E0")
                }
              >
                Zaczynamy!
              </button>
            </div>
          </div>

          <div className="relative translate-x-20">
            <img
              ref={imageRef}
              src={appPreview}
              alt="Chat Preview"
              className="w-[150%] max-w-none transition-transform duration-200 ease-out"
              style={{
                transform: `translate(${transform.x}px, ${transform.y}px)`,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
