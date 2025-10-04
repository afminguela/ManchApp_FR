const ConnectionStatus = ({ message }) => {
  return (
    <div className="connection-status" role="status" aria-live="polite">
      <span>{message}</span>
    </div>
  );
};

export default ConnectionStatus;
