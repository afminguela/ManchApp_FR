const LCDScreen = ({ mainText = "ManchApp 2025", statusText = "" }) => {
  return (
    <div className="lcd-screen" role="region" aria-label="Pantalla de estado">
      <div className="screen-content">
        <div className="screen-text">{mainText}</div>
        <div className="screen-status">{statusText}</div>
      </div>
    </div>
  );
};

export default LCDScreen;
