import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function AuthCallback() {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // React dev mode workaround to prevent double execution
      if (hasRun.current) return;
      hasRun.current = true;
      try {
        const allowedOrigins = [process.env.REACT_APP_FRONTEND_URL];

        // Check if the origin is allowed
        if (!allowedOrigins.includes(window.location.origin)) {
          throw new Error("Nieautoryzowane źródło callbacku");
        }

        // Get OAuth parameters from URL
        const params = new URLSearchParams(window.location.search);
        const oauthToken = params.get("oauth_token");
        const oauthVerifier = params.get("oauth_verifier");

        if (!oauthToken || !oauthVerifier) {
          throw new Error("Brak wymaganych parametrów OAuth");
        }

        // Validate OAuth token and OAuth verifier format
        const tokenRegex = /^[a-zA-Z0-9]{20}$/;
        const verifierRegex = /^\d{8}$/;
        if (
          oauthToken.length === 0 ||
          oauthVerifier.length === 0 ||
          !tokenRegex.test(oauthToken) ||
          !verifierRegex.test(oauthVerifier)
        ) {
          throw new Error("Nieprawidłowe wartości parametrów OAuth");
        }

        //////////////// Debug ///////////////////
        if (process.env.REACT_APP_DEBUG_ALERTS === "true")
          alert("OAuth Token:" + oauthToken);
        if (process.env.REACT_APP_DEBUG_ALERTS === "true")
          alert("OAuth Verifier:" + oauthVerifier);
        //////////////// Debug ///////////////////

        // Send POST request with OAuth parameters to create session
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              OauthToken: oauthToken,
              OauthVerifier: oauthVerifier,
            }),
            credentials: "include", // Cookie is received from backend
          }
        );

        // Read response text
        const responseText = await response.text();

        if (!response.ok) {
          throw new Error("Błąd podczas tworzenia sesji: " + response.status);
        }

        // Parse response to JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error("Nieprawidłowa odpowiedź z serwera:", responseText);
          throw new Error("Serwer zwrócił nieprawidłowy format danych");
        }

        //////////////// Debug ///////////////////
        if (process.env.REACT_APP_DEBUG_ALERTS === "true")
          alert("Odpowiedź z serwera (session):" + JSON.stringify(data));
        //////////////// Debug ///////////////////

        // Extract session token from response
        const sessionToken = data.session;

        if (!sessionToken) {
          throw new Error("Nie otrzymano tokenu sesji");
        }

        // Validate session token format
        const sessionTokenRegex =
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (
          sessionToken.length === 0 ||
          !sessionTokenRegex.test(sessionToken)
        ) {
          throw new Error("Nieprawidłowy token sesji");
        }

        // Send message to the main window
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            { type: "LOGIN_SUCCESS", sessionToken },
            window.location.origin
          );
        }

        window.close();
      } catch (error) {
        console.error("Błąd podczas przetwarzania callbacku:", error);
        // Send error message to the main window
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            { type: "LOGIN_ERROR", error: error.message },
            window.location.origin
          );
        }

        window.close();
      }
    };

    handleOAuthCallback();
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
          Logowanie...
        </h2>
        <p className="text-gray-600">To potrwa tylko chwilę</p>
      </div>
    </div>
  );
}

export default AuthCallback;
