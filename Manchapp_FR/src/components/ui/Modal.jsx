import { useEffect } from "react";

const Modal = ({
  isVisible = false,
  title,
  children,
  onClose,
  className = "",
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isVisible) {
        onClose?.();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className={`modal ${className}`}
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h3 id="modal-title">{title}</h3>
          <button
            className="modal-close"
            onClick={onClose}
            type="button"
            aria-label="Cerrar modal"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
