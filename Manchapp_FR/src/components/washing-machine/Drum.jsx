const Drum = ({ isSpinning = false }) => {
  return (
    <div className="drum-container">
      <div
        className={`drum ${isSpinning ? "spinning" : ""}`}
        role="img"
        aria-label="Tambor de la lavadora"
      >
        <div className="drum-holes">
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
        </div>
      </div>
    </div>
  );
};

export default Drum;
