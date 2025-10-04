import { useState, useEffect, useCallback } from "react";
import SolutionsActions from "./SolutionsActions";
import SolutionsList from "./SolutionsList";
import FilterPanel from "./FilterPanel";

const SolutionsSection = ({
  isVisible = false,
  solutions,
  onAdd,
  onEdit,
  onDelete,
  onLogout,
  onBackToSearch,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filteredSolutions, setFilteredSolutions] = useState(solutions);
  const [activeFilters, setActiveFilters] = useState({
    dificultad: "",
    tiempoMaximo: "",
    categoria: "",
    efectividad: "",
    ingredientes: [],
    utensilios: []
  });

  const applyActiveFilters = useCallback(
    (solutionsToFilter) => {
      let filtered = solutionsToFilter;

      // Filtrar por dificultad
      if (activeFilters.dificultad) {
        filtered = filtered.filter(
          (solution) =>
            solution.dificultad?.toLowerCase() ===
            activeFilters.dificultad.toLowerCase()
        );
      }

      // Filtrar por tiempo máximo
      if (activeFilters.tiempoMaximo) {
        const maxTime = parseInt(activeFilters.tiempoMaximo);
        filtered = filtered.filter((solution) => {
          const solutionTime = parseInt(solution.tiempo_minutos) || 0;
          return solutionTime <= maxTime;
        });
      }

      // Filtrar por categoría
      if (activeFilters.categoria) {
        const categoryValue = parseInt(activeFilters.categoria);
        filtered = filtered.filter((solution) => {
          return parseInt(solution.categoria) === categoryValue;
        });
      }

      // Filtrar por efectividad mínima
      if (activeFilters.efectividad) {
        const minEffectiveness = parseInt(activeFilters.efectividad);
        filtered = filtered.filter((solution) => {
          const solutionEffectiveness = parseInt(solution.efectividad) || 0;
          return solutionEffectiveness >= minEffectiveness;
        });
      }

      // Filtrar por ingredientes (usando relaciones reales)
      if (activeFilters.ingredientes.length > 0) {
        filtered = filtered.filter((solution) => {
          if (!solution.soluciones_limpieza_ingredientes) return false;

          return activeFilters.ingredientes.some((ingredientId) =>
            solution.soluciones_limpieza_ingredientes.some(
              (rel) => rel.ingredientes?.id === ingredientId
            )
          );
        });
      }

      // Filtrar por utensilios (usando relaciones reales)
      if (activeFilters.utensilios.length > 0) {
        filtered = filtered.filter((solution) => {
          if (!solution.soluciones_limpieza_utensilios) return false;

          return activeFilters.utensilios.some((utensilioId) =>
            solution.soluciones_limpieza_utensilios.some(
              (rel) => rel.utensilios?.id === utensilioId
            )
          );
        });
      }

      setFilteredSolutions(filtered);
    },
    [activeFilters]
  );

  // Aplicar filtros activos a las nuevas soluciones
  // pero manteniendo los filtros activos
  useEffect(() => {
    applyActiveFilters(solutions);
  }, [solutions, activeFilters, applyActiveFilters]);

  if (!isVisible) return null;

  const handleFiltersChange = (filters) => {
    console.log("🔍 Actualizando filtros activos:", filters);

    // Guardar los filtros activos permanentemente
    setActiveFilters(filters);

    // Aplicar filtros inmediatamente
    applyActiveFilters(solutions);
  };

  const handleClearFilters = () => {
    console.log("🧹 Limpiando todos los filtros");

    const emptyFilters = {
      dificultad: "",
      tiempoMaximo: "",
      categoria: "",
      efectividad: "",
      ingredientes: [],
      utensilios: [],
    };

    setActiveFilters(emptyFilters);
    setFilteredSolutions(solutions);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div
      className="solutions-section"
      role="region"
      aria-labelledby="solutions-title"
    >
      <h2 id="solutions-title" className="section-title">
        {onBackToSearch
          ? `Resultados de Búsqueda (${filteredSolutions.length} de ${solutions.length} soluciones)`
          : "Soluciones de Limpieza"}
      </h2>

      <SolutionsActions
        onAdd={onAdd}
        onLogout={onLogout}
        onBackToSearch={onBackToSearch}
        onToggleFilters={toggleFilters}
        showFilters={showFilters}
        hasResults={solutions.length > 0}
      />

      <FilterPanel
        isVisible={showFilters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        onClose={() => setShowFilters(false)}
        activeFilters={activeFilters}
      />

      <SolutionsList
        solutions={filteredSolutions}
        onEdit={onEdit}
        onDelete={onDelete}
        showCompleteData={!!onBackToSearch}
      />
    </div>
  );
};

export default SolutionsSection;
