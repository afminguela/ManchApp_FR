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
          solution.dificultad?.toLowerCase() ===
          filters.dificultad.toLowerCase()
      );
    }

    // Filtrar por tiempo máximo
    if (filters.tiempoMax) {
      const maxTime = parseInt(filters.tiempoMax);
      filtered = filtered.filter((solution) => {
        const solutionTime = parseInt(solution.tiempo_estimado) || 0;
        return solutionTime <= maxTime;
      });
    }

    // Filtrar por ingredientes (si contiene alguno de los seleccionados)
    if (filters.ingredientes.length > 0) {
      filtered = filtered.filter((solution) => {
        const solutionIngredients = solution.instrucciones?.toLowerCase() || "";
        return filters.ingredientes.some((ingredient) =>
          solutionIngredients.includes(ingredient.toLowerCase())
        );
      });
    }

    // Filtrar por utensilios (si contiene alguno de los seleccionados)
    if (filters.utensilios.length > 0) {
      filtered = filtered.filter((solution) => {
        const solutionInstructions =
          solution.instrucciones?.toLowerCase() || "";
        return filters.utensilios.some((utensilio) =>
          solutionInstructions.includes(utensilio.toLowerCase())
        );
      });
    }

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
