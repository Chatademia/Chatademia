import WelcomePage from "./pages/Home.js";
import { Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat.jsx";
import AuthCallback from "./AuthCallback.js";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/chats" element={<Chat />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </>
  );
}

export default App;
