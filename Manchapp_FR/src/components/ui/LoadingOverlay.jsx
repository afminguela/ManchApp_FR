const LoadingOverlay = ({ isVisible = false, message = "Procesando..." }) => {
  if (!isVisible) return null;

  return (
    <div className="loading-overlay" role="status" aria-label="Cargando">
      <div className="loading-spinner"></div>
      <div className="loading-text">{message}</div>
    </div>
  );
};

export default LoadingOverlay;
