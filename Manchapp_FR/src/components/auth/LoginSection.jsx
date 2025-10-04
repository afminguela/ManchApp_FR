import LoginForm from "./LoginForm";

const LoginSection = ({ isVisible = false, onSubmit }) => {
  if (!isVisible) return null;

  return (
    <div className="login-section" role="region" aria-labelledby="login-title">
      <h2 id="login-title" className="section-title">
        Iniciar Sesión
      </h2>
      <LoginForm onSubmit={onSubmit} />
    </div>
  );
};

export default LoginSection;
