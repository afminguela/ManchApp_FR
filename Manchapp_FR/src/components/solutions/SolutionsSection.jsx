import { useState, useEffect } from "react";
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

  // Actualizar soluciones filtradas cuando cambien las soluciones originales
  useEffect(() => {
    if (!showFilters) {
      setFilteredSolutions(solutions);
    }
  }, [solutions, showFilters]);

  if (!isVisible) return null;

  const handleFiltersChange = (filters) => {
    let filtered = solutions;

    // Filtrar por dificultad
    if (filters.dificultad) {
      filtered = filtered.filter(
        (solution) =>
          solution.dificultad?.toLowerCase() === filters.dificultad.toLowerCase()
      );
    }

    // Filtrar por tiempo máximo
    if (filters.tiempoMaximo) {
      const maxTime = parseInt(filters.tiempoMaximo);
      filtered = filtered.filter((solution) => {
        const solutionTime = parseInt(solution.tiempo_minutos) || 0;
        return solutionTime <= maxTime;
      });
    }

    // Filtrar por categoría
    if (filters.categoria) {
      const categoryValue = parseInt(filters.categoria);
      filtered = filtered.filter((solution) => {
        return parseInt(solution.categoria) === categoryValue;
      });
    }

    // Filtrar por efectividad mínima
    if (filters.efectividad) {
      const minEffectiveness = parseInt(filters.efectividad);
      filtered = filtered.filter((solution) => {
        const solutionEffectiveness = parseInt(solution.efectividad) || 0;
        return solutionEffectiveness >= minEffectiveness;
      });
    }

    // Filtrar por ingredientes (usando relaciones reales)
    if (filters.ingredientes.length > 0) {
      filtered = filtered.filter((solution) => {
        if (!solution.soluciones_limpieza_ingredientes) return false;
        
        return filters.ingredientes.some((ingredientId) =>
          solution.soluciones_limpieza_ingredientes.some(
            (rel) => rel.ingredientes?.id === ingredientId
          )
        );
      });
    }

    // Filtrar por utensilios (usando relaciones reales)
    if (filters.utensilios.length > 0) {
      filtered = filtered.filter((solution) => {
        if (!solution.soluciones_limpieza_utensilios) return false;
        
        return filters.utensilios.some((utensilioId) =>
          solution.soluciones_limpieza_utensilios.some(
            (rel) => rel.utensilios?.id === utensilioId
          )
        );
      });
    }

    console.log("🔍 Filtros aplicados:", filters);
    console.log("📊 Soluciones filtradas:", filtered.length, "de", solutions.length);
    setFilteredSolutions(filtered);
  };

  const handleClearFilters = () => {
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
