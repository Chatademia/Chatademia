import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import appIcon from "../assets/icon.png";
import onboarding1 from "../assets/onboarding_1.png";
import onboarding2 from "../assets/onboarding_2.png";
import onboarding3 from "../assets/onboarding_3.png";
import onboarding4 from "../assets/onboarding_4.png";
import {
  handleLoginRedirect,
  handleGoogleLoginRedirect,
} from "../utils/authHandlers";

function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const loginPopupRef = useRef(null);

  const steps = [
    {
      image: onboarding1,
      title: "Witaj w Chatademii!",
      description:
        "Chatademia to aplikacja stworzona dla studentów, aby ułatwić komunikację w ramach zajęć. Dołącz do grup swoich kursów, dyskutuj, współpracuj nad projektami i bądź na bieżąco z tym, co dzieje się na uczelni.",
    },
    {
      image: onboarding2,
      title: "Bądź na bieżąco!",
      description:
        "Rozmawiaj z osobami z grupy zajęciowej w automatycznie utworzonych czatach. Wysyłaj wiadomości, dziel się załącznikami i bądź na bieżąco!",
    },
    {
      image: onboarding3,
      title: "Korzystaj z grup zajęciowych lub twórz własne!",
      description:
        "Aplikacja automatycznie tworzy grupy na podstawie danych z USOSa, dodaje członków zajęć do wspólnego czatu i pozwala tworzyć własne niestandardowe grupy z pełną kontrolą nad uczestnikami.",
    },
    {
      image: onboarding4,
      title: "Twoje dane są bezpieczne!",
      description:
        "Za chwilę będziesz mógł zalogować się do aplikacji, używając swoich danych z USOSa.  Nie martw się — Twoje dane logowania są całkowicie bezpieczne, a my nie mamy do nich dostępu. Dzięki temu będziemy mogli odczytać Twoje grupy zajęciowe i umożliwić tworzenie czatów.",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

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

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #EDEEFF 0%, #CBCEFB 100%)",
      }}
    >
      <div
        className="bg-white rounded-3xl shadow-xl flex flex-col items-center p-0"
        style={{
          width: "95vw",
          height: "95vh",
        }}
      >
        <div className="w-full flex flex-row items-center justify-center pt-8 pb-2">
          <img src={appIcon} alt="Ikona aplikacji" className="w-10 h-10" />
          <span
            className="text-3xl ml-4 font-bold"
            style={{ color: "#5004E0" }}
          >
            Chatademia
          </span>
        </div>
        <div
          className="flex-1 w-full flex flex-col items-center px-8 pb-8 onboarding-content"
          key={currentStep}
        >
          <div className="flex-1 flex flex-col items-center justify-center">
            <img
              src={steps[currentStep].image}
              alt={steps[currentStep].title}
              className="w-full max-h-80 max-w-lg object-contain mb-2"
              style={{ minHeight: 220 }}
            />
            <h1
              className="text-4xl font-bold text-center mt-2 mb-2"
              style={{ color: "#5004E0" }}
            >
              {steps[currentStep].title}
            </h1>
            <p
              className="text-lg text-gray-500 text-center mb-4"
              style={{ maxWidth: 600 }}
            >
              {steps[currentStep].description}
            </p>
          </div>
          <div className="flex justify-center gap-2 mb-4">
            {steps.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Przejdź do ekranu ${index + 1}`}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all focus:outline-none ${
                  index === currentStep ? "w-8" : "w-2 cursor-default"
                }
                }`}
                style={{
                  backgroundColor:
                    index === currentStep ? "#5004E0" : "#D1D5DB",
                  border: index === currentStep ? "2px solid #5004E0" : "none",
                  boxShadow:
                    index === currentStep ? "0 0 0 2px #EDEEFF" : "none",
                  cursor: index === currentStep ? "default" : "pointer",
                  transition: "all 0.2s",
                }}
                disabled={index === currentStep}
              />
            ))}
          </div>
          {currentStep === steps.length - 1 ? (
            <div className="flex justify-center gap-4 flex-wrap mt-2 mb-4">
              <button
                onClick={() => handleGoogleLoginRedirect(loginPopupRef)}
                className="px-6 py-3 bg-white font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
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
                Kontynuuj z Google
              </button>
              <button
                onClick={() => handleLoginRedirect(loginPopupRef)}
                className="px-6 py-3 text-white font-semibold rounded-lg transition-colors"
                style={{ backgroundColor: "#5004E0" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#4003B8")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#5004E0")
                }
              >
                Zarejestruj się przez USOS
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center mt-2 mb-2">
              <button
                onClick={handleNext}
                className="px-12 py-3 text-white font-semibold rounded-lg transition-colors"
                style={{ backgroundColor: "#5004E0" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#4003B8")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#5004E0")
                }
              >
                Przejdź dalej
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
