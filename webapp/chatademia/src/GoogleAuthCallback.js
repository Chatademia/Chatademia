import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function GoogleAuthCallback() {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    const handleGoogleOAuthCallback = async () => {
      if (hasRun.current) return;
      hasRun.current = true;

      try {
        const allowedOrigins = [process.env.REACT_APP_FRONTEND_URL];

        if (!allowedOrigins.includes(window.location.origin)) {
          throw new Error("Nieautoryzowane źródło callbacku");
        }

        console.log("Google OAuth - callback otrzymany");

        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            {
              type: "LOGIN_SUCCESS",
            },
            window.location.origin
          );
        }

        window.close();
      } catch (error) {
        console.error("Błąd podczas przetwarzania Google callbacku:", error);

        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            { type: "LOGIN_ERROR", error: error.message },
            window.location.origin
          );
        }

        window.close();
      }
    };

    handleGoogleOAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div
          className="animate-spin rounded-full h-12 w-12 mx-auto mb-4"
          style={{
            borderBottomWidth: "3px",
            borderColor: "#5004E0",
          }}
        ></div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#5004E0" }}>
          Logowanie przez Google...
        </h2>
        <p className="text-gray-600">To potrwa tylko chwilę</p>
      </div>
    </div>
  );
}

export default GoogleAuthCallback;
