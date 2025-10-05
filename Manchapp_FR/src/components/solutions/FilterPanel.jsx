import { useState, useEffect, useRef } from "react";
import Button from "../ui/Button";
import { supabaseService } from "../../supabaseClient";

const FilterPanel = ({
  onFiltersChange,
  onClearFilters,
  isVisible = false,
  onClose,
  activeFilters,
}) => {
  const panelRef = useRef(null);
  const [filters, setFilters] = useState({
    dificultad: "",
    tiempoMaximo: "",
    categoria: "",
    efectividad: "",
    ingredientes: [],
    utensilios: [],
  });

  // Sincronizar filtros locales con filtros activos
  useEffect(() => {
    if (activeFilters) {
      setFilters(activeFilters);
    }
  }, [activeFilters]);

  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [availableUtensilios, setAvailableUtensilios] = useState([]);

  // Cargar ingredientes y utensilios reales de la BD
  useEffect(() => {
    const loadCatalogData = async () => {
      try {
        const [ingredientes, utensilios] = await Promise.all([
          supabaseService.getIngredientes(),
          supabaseService.getUtensilios(),
        ]);

        setAvailableIngredients(ingredientes || []);
        setAvailableUtensilios(utensilios || []);
      } catch {
        // Error al cargar catálogo
      }
    };

    if (isVisible) {
      loadCatalogData();
    }
  }, [isVisible]);

  // Cerrar panel al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        isVisible
      ) {
        onClose && onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isVisible, onClose]);

  // Opciones basadas en el esquema real de BD (enum en inglés)
  const dificultades = [
    { value: "", label: "Todas las dificultades" },
    { value: "easy", label: "Fácil" },
    { value: "medium", label: "Media" },
    { value: "hard", label: "Difícil" },
  ];

  const tiemposEstimados = [
    { value: "", label: "Cualquier tiempo" },
    { value: "5", label: "Hasta 5 min" },
    { value: "15", label: "Hasta 15 min" },
    { value: "30", label: "Hasta 30 min" },
    { value: "60", label: "Hasta 1 hora" },
    { value: "120", label: "Hasta 2 horas" },
  ];

  // Categorías según el esquema real (smallint)
  const categorias = [
    { value: "", label: "Todas las categorías" },
    { value: "1", label: "Categoría 1" },
    { value: "2", label: "Categoría 2" },
    { value: "3", label: "Categoría 3" },
  ];

  // Niveles de efectividad según el esquema real (smallint)
  const efectividades = [
    { value: "", label: "Cualquier efectividad" },
    { value: "1", label: "Efectividad 1" },
    { value: "2", label: "Efectividad 2" },
    { value: "3", label: "Efectividad 3" },
    { value: "4", label: "Efectividad 4" },
    { value: "5", label: "Efectividad 5" },
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
      : currentValues.filter((item) => item !== value);

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
      utensilios: [],
    };
    setFilters(emptyFilters);
    onClearFilters();
  };

  const hasActiveFilters = () => {
    return (
      filters.dificultad ||
      filters.tiempoMaximo ||
      filters.categoria ||
      filters.efectividad ||
      filters.ingredientes.length > 0 ||
      filters.utensilios.length > 0
    );
  };

  if (!isVisible) return null;

  return (
    <div className="filter-panel" id="filter-panel" ref={panelRef}>
      <div className="filter-header">
        <h3>Filtrar Soluciones</h3>
        {hasActiveFilters() && (
          <Button
            variant="secondary"
            onClick={clearAllFilters}
            className="clear-filters-btn"
          >
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
            {dificultades.map((diff) => (
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
            {tiemposEstimados.map((tiempo) => (
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
            {categorias.map((cat) => (
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
            {efectividades.map((efect) => (
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
            {availableIngredients.map((ingrediente) => (
              <label key={ingrediente.id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={filters.ingredientes.includes(ingrediente.id)}
                  onChange={(e) =>
                    handleMultiSelectChange(
                      "ingredientes",
                      ingrediente.id,
                      e.target.checked
                    )
                  }
                />
                <span>
                  {ingrediente.nombre || `Ingrediente ${ingrediente.id}`}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Filtro por Utensilios */}
        <div className="filter-group filter-multi">
          <label>Utensilios disponibles</label>
          <div className="multi-select-grid">
            {availableUtensilios.map((utensilio) => (
              <label key={utensilio.id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={filters.utensilios.includes(utensilio.id)}
                  onChange={(e) =>
                    handleMultiSelectChange(
                      "utensilios",
                      utensilio.id,
                      e.target.checked
                    )
                  }
                />
                <span>
                  {utensilio.nombre ||
                    utensilio.descripcion ||
                    `Utensilio ${utensilio.id}`}
                </span>
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
                Dificultad:{" "}
                {
                  dificultades.find((d) => d.value === filters.dificultad)
                    ?.label
                }
              </span>
            )}
            {filters.tiempoMaximo && (
              <span className="filter-tag">
                Tiempo:{" "}
                {
                  tiemposEstimados.find((t) => t.value === filters.tiempoMaximo)
                    ?.label
                }
              </span>
            )}
            {filters.categoria && (
              <span className="filter-tag">
                Categoría:{" "}
                {categorias.find((c) => c.value === filters.categoria)?.label}
              </span>
            )}
            {filters.efectividad && (
              <span className="filter-tag">
                Efectividad:{" "}
                {
                  efectividades.find((e) => e.value === filters.efectividad)
                    ?.label
                }
              </span>
            )}
            {filters.ingredientes.map((ingId) => {
              const ingrediente = availableIngredients.find(
                (ing) => ing.id === ingId
              );
              return (
                <span key={ingId} className="filter-tag">
                  Ingrediente: {ingrediente?.nombre || `ID: ${ingId}`}
                </span>
              );
            })}
            {filters.utensilios.map((utenId) => {
              const utensilio = availableUtensilios.find(
                (uten) => uten.id === utenId
              );
              return (
                <span key={utenId} className="filter-tag">
                  Utensilio:{" "}
                  {utensilio?.nombre ||
                    utensilio?.descripcion ||
                    `ID: ${utenId}`}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
