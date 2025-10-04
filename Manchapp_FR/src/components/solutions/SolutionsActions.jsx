import Button from "../ui/Button";

const SolutionsActions = ({
  onAdd,
  onLogout,
  onBackToSearch,
  onToggleFilters,
  showFilters,
  hasResults,
}) => {
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

      {hasResults && (
        <Button
          variant={showFilters ? "primary" : "secondary"}
          onClick={onToggleFilters}
          className="toggle-filters-btn"
          aria-expanded={showFilters}
          aria-controls="filter-panel"
        >
          <span aria-hidden="true">{showFilters ? "🔽" : "🔼"}</span>
          {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
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
