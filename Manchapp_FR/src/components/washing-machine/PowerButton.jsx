const PowerButton = ({ onClick, isActive = false }) => {
  return (
    <button
      className={`power-button ${isActive ? "active" : ""}`}
      onClick={onClick}
      type="button"
      aria-describedby="power-help"
    >
      <span className="power-icon"></span>
      <span className="sr-only">Botón de encendido - Verificar conexión</span>
    </button>
  );
};

export default PowerButton;
