const IndicatorLights = ({
  powerActive = false,
  connectionActive = false,
  washingActive = false,
}) => {
  return (
    <div className="indicator-lights">
      <div
        className={`led power-led ${powerActive ? "active" : ""}`}
        role="img"
        aria-label="Indicador de encendido"
      />
      <div
        className={`led connection-led ${connectionActive ? "active" : ""}`}
        role="img"
        aria-label="Indicador de conexión"
      />
      <div
        className={`led washing-led ${washingActive ? "active" : ""}`}
        role="img"
        aria-label="Indicador de lavado"
      />
    </div>
  );
};

export default IndicatorLights;
