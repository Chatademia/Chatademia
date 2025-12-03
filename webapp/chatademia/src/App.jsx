import WelcomePage from "./pages/Home.js";
import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat.jsx";
import AuthCallback from "./AuthCallback.js";
import { useEffect, useState } from "react";

function App() {
  const PublicRoute = ({ children }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isSessionValid, setIsSessionValid] = useState(false);

    // Get session token from cookies
    useEffect(() => {
      const checkSession = async () => {
        const sessionToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("session_token="))
          ?.split("=")[1];

        // If session token doesn't exist, set isSessionValid as false
        if (!sessionToken) {
          setIsSessionValid(false);
          setIsChecking(false);
          return;
        }

        // Check if session token is valid
        try {
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

          // If response is ok, set isSessionValid as true
          if (response.ok) setIsSessionValid(true);
          // If session is invalid (expired), clear cookie and set isSessionValid as false
          else if (response.status === 401) {
            document.cookie =
              "session_token=; path=/; max-age=0; SameSite=Strict";
            setIsSessionValid(false);
          } else {
            throw new Error(response.status);
          }
        } catch (error) {
          console.error("Błąd podczas sprawdzania sesji:", error);
          setIsSessionValid(false);
        } finally {
          // Set isChecking as false after checking session validity
          setIsChecking(false);
        }
      };

      checkSession();
    }, []);

    // While checking session validity, render nothing
    if (isChecking) {
      return null;
    }

    // If session is valid, redirect to /chats
    if (isSessionValid) {
      return <Navigate to="/chats" replace />;
    } else {
      return children;
    }
  };

  const ProtectedRoute = ({ children }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isSessionValid, setIsSessionValid] = useState(false);

    // Get session token from cookies
    useEffect(() => {
      const checkSession = async () => {
        const sessionToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("session_token="))
          ?.split("=")[1];

        // If session token doesn't exist, set isSessionValid as false
        if (!sessionToken) {
          setIsSessionValid(false);
          setIsChecking(false);
          return;
        }

        // Check if session token is valid
        try {
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

          // If response is ok, set isSessionValid as true
          if (response.ok) setIsSessionValid(true);
          // If session is invalid (expired), clear cookie and set isSessionValid as false
          else if (response.status === 401) {
            document.cookie =
              "session_token=; path=/; max-age=0; SameSite=Strict";
            setIsSessionValid(false);
          } else {
            throw new Error(response.status);
          }
        } catch (error) {
          console.error("Błąd podczas sprawdzania sesji:", error);
          setIsSessionValid(false);
        } finally {
          // Set isChecking as false after checking session validity
          setIsChecking(false);
        }
      };

      checkSession();
    }, []);

    // While checking session validity, render nothing
    if (isChecking) {
      return null;
    }

    // If session is valid, redirect to /chats
    if (isSessionValid) {
      return children;
    } else {
      return <Navigate to="/" replace />;
    }
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <WelcomePage />
            </PublicRoute>
          }
        />
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </>
  );
}

export default App;
