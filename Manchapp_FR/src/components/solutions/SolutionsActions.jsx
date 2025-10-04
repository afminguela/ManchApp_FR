import Button from "../ui/Button";

const SolutionsActions = ({ onAdd, onLogout, onBackToSearch }) => {
  return (
    <div className="solutions-actions">
      {onBackToSearch && typeof onBackToSearch === "function" && (
        <Button
          variant="primary"
          onClick={onBackToSearch}
          className="back-to-search-btn"
        >
          ← Nueva Búsqueda
        </Button>
      )}
      <Button onClick={onAdd}>
        <span aria-hidden="true">+</span> Agregar Solución
      </Button>
      <Button variant="secondary" onClick={onLogout}>
        Cerrar Sesión
      </Button>
    </div>
  );
};
export default SolutionsActions;
