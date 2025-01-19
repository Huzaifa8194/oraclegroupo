import CountUp from "react-countup";
import ReactVisibilitySensor from "react-visibility-sensor";

const Counter = ({ end, decimals }) => {
  return (
    <CountUp
      end={end || 100} // Default to 100 if no 'end' prop is provided
      duration={3}
      decimals={decimals || 0} // Default to 0 decimals if not specified
    >
      {({ countUpRef, start }) => (
        <ReactVisibilitySensor onChange={start} delayedCall>
          <span ref={countUpRef}></span>
        </ReactVisibilitySensor>
      )}
    </CountUp>
  );
};

export default Counter;
