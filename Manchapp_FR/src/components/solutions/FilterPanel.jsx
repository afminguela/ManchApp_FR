import { useState } from "react";
import Button from "../ui/Button";

const FilterPanel = ({ onFiltersChange, onClearFilters, isVisible = false }) => {
  const [filters, setFilters] = useState({
    dificultad: "",
    tiempoMaximo: "",
    categoria: "",
    efectividad: "",
    ingredientes: [],
    utensilios: []
  });

  // Opciones basadas en el esquema de BD
  const dificultades = [
    { value: "", label: "Todas las dificultades" },
    { value: "baja", label: "Baja" },
    { value: "media", label: "Media" },
    { value: "alta", label: "Alta" }
  ];

  const tiemposEstimados = [
    { value: "", label: "Cualquier tiempo" },
    { value: "5", label: "Hasta 5 min" },
    { value: "15", label: "Hasta 15 min" },
    { value: "30", label: "Hasta 30 min" },
    { value: "60", label: "Hasta 1 hora" },
    { value: "120", label: "Hasta 2 horas" }
  ];

  // Categorías de soluciones según schema
  const categorias = [
    { value: "", label: "Todas las categorías" },
    { value: "1", label: "Doméstico" },
    { value: "2", label: "Profesional" },
    { value: "3", label: "Industrial" }
  ];

  // Niveles de efectividad
  const efectividades = [
    { value: "", label: "Cualquier efectividad" },
    { value: "1", label: "Baja efectividad" },
    { value: "2", label: "Media efectividad" },
    { value: "3", label: "Alta efectividad" },
    { value: "4", label: "Muy alta efectividad" },
    { value: "5", label: "Máxima efectividad" }
  ];

  // Lista ampliada de ingredientes comunes
  const ingredientesComunes = [
    "Bicarbonato de sodio",
    "Vinagre blanco",
    "Limón",
    "Sal",
    "Agua oxigenada",
    "Jabón neutro",
    "Alcohol isopropílico",
    "Detergente",
    "Amoníaco",
    "Agua caliente",
    "Aceite de oliva",
    "Pasta de dientes",
    "Coca-Cola"
  ];

  // Lista ampliada de utensilios
  const utensiliosComunes = [
    "Esponja suave",
    "Esponja abrasiva",
    "Paño de microfibra",
    "Cepillo de dientes",
    "Cepillo de cerdas duras",
    "Brocha",
    "Pulverizador",
    "Recipiente",
    "Guantes de goma",
    "Aspiradora",
    "Secador de pelo",
    "Espátula",
    "Rasqueta"
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleMultiSelectChange = (filterType, value, checked) => {
    const currentValues = filters[filterType];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(item => item !== value);
    
    const newFilters = { ...filters, [filterType]: newValues };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      dificultad: "",
      tiempoMaximo: "",
      categoria: "",
      efectividad: "",
      ingredientes: [],
      utensilios: []
    };
    setFilters(emptyFilters);
    onClearFilters();
  };

  const hasActiveFilters = () => {
    return filters.dificultad || 
           filters.tiempoMaximo || 
           filters.categoria ||
           filters.efectividad ||
           filters.ingredientes.length > 0 || 
           filters.utensilios.length > 0;
  };

  if (!isVisible) return null;

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filtrar Soluciones</h3>
        {hasActiveFilters() && (
          <Button variant="secondary" onClick={clearAllFilters} className="clear-filters-btn">
            Limpiar Filtros
          </Button>
        )}
      </div>

      <div className="filter-grid">
        {/* Filtro por Dificultad */}
        <div className="filter-group">
          <label htmlFor="dificultad-filter">Dificultad</label>
          <select
            id="dificultad-filter"
            value={filters.dificultad}
            onChange={(e) => handleFilterChange("dificultad", e.target.value)}
            className="filter-select"
          >
            {dificultades.map(diff => (
              <option key={diff.value} value={diff.value}>
                {diff.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Tiempo */}
        <div className="filter-group">
          <label htmlFor="tiempo-filter">Tiempo máximo</label>
          <select
            id="tiempo-filter"
            value={filters.tiempoMaximo}
            onChange={(e) => handleFilterChange("tiempoMaximo", e.target.value)}
            className="filter-select"
          >
            {tiemposEstimados.map(tiempo => (
              <option key={tiempo.value} value={tiempo.value}>
                {tiempo.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Categoría */}
        <div className="filter-group">
          <label htmlFor="categoria-filter">Categoría</label>
          <select
            id="categoria-filter"
            value={filters.categoria}
            onChange={(e) => handleFilterChange("categoria", e.target.value)}
            className="filter-select"
          >
            {categorias.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Efectividad */}
        <div className="filter-group">
          <label htmlFor="efectividad-filter">Efectividad mínima</label>
          <select
            id="efectividad-filter"
            value={filters.efectividad}
            onChange={(e) => handleFilterChange("efectividad", e.target.value)}
            className="filter-select"
          >
            {efectividades.map(efect => (
              <option key={efect.value} value={efect.value}>
                {efect.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Ingredientes */}
        <div className="filter-group filter-multi">
          <label>Ingredientes disponibles</label>
          <div className="multi-select-grid">
            {ingredientesComunes.map(ingrediente => (
              <label key={ingrediente} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={filters.ingredientes.includes(ingrediente)}
                  onChange={(e) => handleMultiSelectChange("ingredientes", ingrediente, e.target.checked)}
                />
                <span>{ingrediente}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filtro por Utensilios */}
        <div className="filter-group filter-multi">
          <label>Utensilios disponibles</label>
          <div className="multi-select-grid">
            {utensiliosComunes.map(utensilio => (
              <label key={utensilio} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={filters.utensilios.includes(utensilio)}
                  onChange={(e) => handleMultiSelectChange("utensilios", utensilio, e.target.checked)}
                />
                <span>{utensilio}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen de filtros activos */}
      {hasActiveFilters() && (
        <div className="active-filters-summary">
          <h4>Filtros activos:</h4>
          <div className="filter-tags">
            {filters.dificultad && (
              <span className="filter-tag">
                Dificultad: {dificultades.find(d => d.value === filters.dificultad)?.label}
              </span>
            )}
            {filters.tiempoMaximo && (
              <span className="filter-tag">
                Tiempo: {tiemposEstimados.find(t => t.value === filters.tiempoMaximo)?.label}
              </span>
            )}
            {filters.categoria && (
              <span className="filter-tag">
                Categoría: {categorias.find(c => c.value === filters.categoria)?.label}
              </span>
            )}
            {filters.efectividad && (
              <span className="filter-tag">
                Efectividad: {efectividades.find(e => e.value === filters.efectividad)?.label}
              </span>
            )}
            {filters.ingredientes.map(ing => (
              <span key={ing} className="filter-tag">Ingrediente: {ing}</span>
            ))}
            {filters.utensilios.map(uten => (
              <span key={uten} className="filter-tag">Utensilio: {uten}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;