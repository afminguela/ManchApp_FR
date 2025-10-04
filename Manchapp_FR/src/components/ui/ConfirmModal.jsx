import Modal from "../ui/Modal";
import Button from "../ui/Button";

const ConfirmModal = ({
  isVisible = false,
  title = "Confirmar Acción",
  message = "¿Estás seguro de que deseas realizar esta acción?",
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal isVisible={isVisible} title={title} onClose={onCancel}>
      <p>{message}</p>
      <div className="modal-actions">
        <Button onClick={onConfirm}>Confirmar</Button>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
