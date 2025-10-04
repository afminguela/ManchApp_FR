import LCDScreen from "./LCDScreen";
import PowerButton from "./PowerButton";
import IndicatorLights from "./IndicatorLights";

const ControlPanel = ({
  screenText,
  screenStatus,
  onPowerClick,
  leds = {},
}) => {
  return (
    <div className="control-panel">
      <LCDScreen mainText={screenText} statusText={screenStatus} />

      <div className="control-buttons">
        <PowerButton onClick={onPowerClick} isActive={leds.power} />

        <IndicatorLights
          powerActive={leds.power}
          connectionActive={leds.connection}
          washingActive={leds.washing}
        />
      </div>

      <div id="power-help" className="sr-only">
        Presiona para verificar la conexión a la base de datos
      </div>
    </div>
  );
};

export default ControlPanel;
