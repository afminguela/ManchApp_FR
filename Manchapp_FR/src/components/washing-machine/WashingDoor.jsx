import Drum from "./Drum";

const WashingDoor = ({ isSpinning = false }) => {
  return (
    <div className="washing-machine-door">
      <div className="door-frame">
        <div className="door-glass">
          <div className="door-seal"></div>
          <Drum isSpinning={isSpinning} />
        </div>
        <div
          className="door-handle"
          role="button"
          aria-label="Manija de la puerta"
          tabIndex="0"
        ></div>
      </div>
    </div>
  );
};

export default WashingDoor;
