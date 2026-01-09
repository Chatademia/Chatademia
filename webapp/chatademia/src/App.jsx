import WelcomePage from "./pages/Home.js";
import { Routes, Route, Navigate } from "react-router-dom";
import Chats from "./pages/Chats.jsx";
import AuthCallback from "./AuthCallback.js";
import GoogleAuthCallback from "./GoogleAuthCallback.js";
import { useEffect, useState } from "react";
import Onboarding from "./pages/Onboarding.jsx";

function App() {
  const PublicRoute = ({ children }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isSessionValid, setIsSessionValid] = useState(false);

    // Check if session is valid
    useEffect(() => {
      const checkSession = async () => {
        // Check if session token is valid by sending request with cookie containing session token
        try {
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

          // If response is ok, set isSessionValid as true
          if (response.ok) {
            setIsSessionValid(true);
          }
          // If session is invalid, set isSessionValid as false
          else if (response.status === 401 || response.status === 403) {
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

    // Check session validity using cookie with session token
    useEffect(() => {
      const checkSession = async () => {
        // Check if session token is valid by sending request with cookie containing session token
        try {
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

          // If response is ok, set isSessionValid as true
          if (response.ok) {
            setIsSessionValid(true);
          }
          // If session is invalid, set isSessionValid as false
          else if (response.status === 401 || response.status === 403) {
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
        <Route path="/dev/chats" element={<Chats devMode="true" />} />
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <Chats />
            </ProtectedRoute>
          }
        />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </>
  );
}

export default App;
