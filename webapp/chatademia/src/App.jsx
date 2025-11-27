import WelcomePage from "./pages/Home.js";
import { Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat.jsx";


function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/chats" element={<Chat />} />
    </Routes>
    </>
  );
}

export default App;


