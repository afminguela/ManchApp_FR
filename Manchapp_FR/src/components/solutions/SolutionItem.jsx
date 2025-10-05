import DifficultyBadge from "./DifficultyBadge";
import Button from "../ui/Button";

const SolutionItem = ({ solution, onEdit, onDelete, onClick }) => {
  // Mapear campos de la base de datos a campos esperados por el componente
  const solutionData = {
    id: solution.id,
    title: solution.titulo || solution.title,
    instructions: solution.instrucciones || solution.instructions,
    difficulty: solution.dificultad || solution.difficulty,
    time_minutes: solution.tiempo_minutos || solution.time_minutes,
    tips: solution.consejos || solution.tips,
  };

  const handleCardClick = (e) => {
    // Solo activar onClick si no se hace click en los botones
    if (!e.target.closest("button")) {
      onClick?.(solution);
    }
  };

  return (
    <article
      className="solution-item clickable"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(solution);
        }
      }}
      aria-label={`Ver detalles de ${solutionData.title}`}
    >
      <div className="solution-content">
        <h3 className="solution-title">{solutionData.title}</h3>

        {/* Mostrar material y sustancia */}
        {((solution.solucion_materiales && solution.solucion_materiales.length > 0) || 
          solution.sustancias) && (
          <div className="solution-context">
            {solution.solucion_materiales &&
              solution.solucion_materiales.length > 0 && (
                <span className="context-badge material-context">
                  🧵{" "}
                  {solution.solucion_materiales
                    .map((m) => m.materiales?.nombre)
                    .filter(Boolean)
                    .join(", ")}
                </span>
              )}
            {solution.sustancias && solution.sustancias.nombre && (
              <span className="context-badge stain-context">
                🔴 {solution.sustancias.nombre}
              </span>
            )}
          </div>
        )}

        <div className="solution-meta">
          <DifficultyBadge difficulty={solutionData.difficulty} />
          <span>{solutionData.time_minutes} min</span>
          {solution.efectividad && (
            <span className="effectiveness">⭐ {solution.efectividad}/5</span>
          )}
        </div>
        <p className="solution-instructions">{solutionData.instructions}</p>

        {/* Mostrar solo un preview en la card */}
        <p className="solution-preview-hint">
          👉 Click para ver detalles completos
        </p>

        {solutionData.tips && (
          <p className="solution-tips">
            <strong>Consejos:</strong> {solutionData.tips}
          </p>
        )}

        {/* Ocultar detalles completos en la card - solo en vista detallada */}
        <div className="solution-details" style={{ display: "none" }}>
          {/* Ingredientes */}
          {solution.soluciones_limpieza_ingredientes &&
            solution.soluciones_limpieza_ingredientes.length > 0 && (
              <div className="detail-section">
                <h4>🧪 Ingredientes necesarios:</h4>
                <ul>
                  {solution.soluciones_limpieza_ingredientes.map(
                    (item, index) => (
                      <li key={index}>
                        <strong>{item.ingredientes?.sustancias?.nombre}</strong>
                        {item.ingredientes?.tipo_ingrediente &&
                          ` (${item.ingredientes.tipo_ingrediente})`}
                        {item.ingredientes?.propiedades &&
                          ` - ${item.ingredientes.propiedades}`}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

          {/* Utensilios */}
          {solution.soluciones_limpieza_utensilios &&
            solution.soluciones_limpieza_utensilios.length > 0 && (
              <div className="detail-section">
                <h4>🔧 Utensilios necesarios:</h4>
                <ul>
                  {solution.soluciones_limpieza_utensilios.map(
                    (item, index) => (
                      <li key={index}>
                        <strong>{item.utensilios?.nombre}</strong>
                        {item.utensilios?.descripcion &&
                          ` - ${item.utensilios.descripcion}`}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

          {/* Precauciones */}
          {solution.solucion_precauciones &&
            solution.solucion_precauciones.length > 0 && (
              <div className="detail-section">
                <h4>⚠️ Precauciones:</h4>
                <ul>
                  {solution.solucion_precauciones.map((item, index) => (
                    <li key={index} className="warning">
                      {item.precauciones?.descripcion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </div>

      <div className="solution-actions">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(solution.id)}
          aria-label={`Editar solución: ${solutionData.title}`}
        >
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(solution.id)}
          aria-label={`Eliminar solución: ${solutionData.title}`}
          style={{
            color: "var(--color-error)",
            borderColor: "var(--color-error)",
          }}
        >
          Eliminar
        </Button>
      </div>
    </article>
  );
};

export default SolutionItem;
