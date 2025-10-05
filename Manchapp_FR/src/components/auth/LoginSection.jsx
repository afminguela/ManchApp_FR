import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const LoginSection = ({ isVisible = false, onLogin, onRegister }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  if (!isVisible) return null;

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
  };

  return (
    <div className="login-section" role="region" aria-labelledby="auth-title">
      <h2 id="auth-title" className="section-title">
        {isRegisterMode ? "Crear Cuenta" : "Iniciar Sesión"}
      </h2>

      {isRegisterMode ? (
        <RegisterForm
          onSubmit={onRegister}
          onSwitchToLogin={() => setIsRegisterMode(false)}
        />
      ) : (
        <>
          <LoginForm onSubmit={onLogin} />
          <div className="auth-switch">
            <p>
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="link-button"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginSection;
