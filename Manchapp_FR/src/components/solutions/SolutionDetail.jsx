import DifficultyBadge from "./DifficultyBadge";
import Button from "../ui/Button";

const SolutionDetail = ({ solution, onEdit, onDelete, onBack }) => {
  // Mapear campos de la base de datos
  const solutionData = {
    id: solution.id,
    title: solution.titulo || solution.title,
    instructions: solution.instrucciones || solution.instructions,
    difficulty: solution.dificultad || solution.difficulty,
    time_minutes: solution.tiempo_minutos || solution.time_minutes,
    tips: solution.consejos || solution.tips,
  };

  return (
    <div className="solution-detail-view">
      <div className="solution-detail-header">
        <Button
          variant="outline"
          onClick={onBack}
          aria-label="Volver a la lista"
        >
          ← Atrás
        </Button>
        <h2 className="solution-detail-title">{solutionData.title}</h2>
      </div>

      <div className="solution-detail-content">
        {/* Metadata */}
        <div className="solution-detail-meta">
          <DifficultyBadge difficulty={solutionData.difficulty} />
          <span className="meta-item">
            <strong>⏱️ Tiempo:</strong> {solutionData.time_minutes} minutos
          </span>
          {solution.efectividad && (
            <span className="meta-item effectiveness">
              <strong>⭐ Efectividad:</strong> {solution.efectividad}/5
            </span>
          )}
        </div>

        {/* Instrucciones principales */}
        <section className="detail-section">
          <h3>📋 Instrucciones</h3>
          <p className="instructions-text">{solutionData.instructions}</p>
        </section>

        {/* Consejos */}
        {solutionData.tips && (
          <section className="detail-section tips-section">
            <h3>💡 Consejos útiles</h3>
            <p className="tips-text">{solutionData.tips}</p>
          </section>
        )}

        {/* Ingredientes */}
        {solution.soluciones_limpieza_ingredientes &&
          solution.soluciones_limpieza_ingredientes.length > 0 && (
            <section className="detail-section">
              <h3>🧪 Ingredientes necesarios</h3>
              <ul className="detail-list">
                {solution.soluciones_limpieza_ingredientes.map(
                  (item, index) => (
                    <li key={index} className="detail-list-item">
                      <strong>{item.ingredientes?.sustancias?.nombre}</strong>
                      {item.ingredientes?.tipo_ingrediente && (
                        <span className="item-meta">
                          {item.ingredientes.tipo_ingrediente}
                        </span>
                      )}
                      {item.ingredientes?.propiedades && (
                        <p className="item-description">
                          {item.ingredientes.propiedades}
                        </p>
                      )}
                    </li>
                  )
                )}
              </ul>
            </section>
          )}

        {/* Utensilios */}
        {solution.soluciones_limpieza_utensilios &&
          solution.soluciones_limpieza_utensilios.length > 0 && (
            <section className="detail-section">
              <h3>🔧 Utensilios necesarios</h3>
              <ul className="detail-list">
                {solution.soluciones_limpieza_utensilios.map((item, index) => (
                  <li key={index} className="detail-list-item">
                    <strong>{item.utensilios?.nombre}</strong>
                    {item.utensilios?.descripcion && (
                      <p className="item-description">
                        {item.utensilios.descripcion}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

        {/* Materiales */}
        {solution.solucion_materiales &&
          solution.solucion_materiales.length > 0 && (
            <section className="detail-section">
              <h3>🧵 Materiales aplicables</h3>
              <ul className="detail-list materials-list">
                {solution.solucion_materiales.map((item, index) => (
                  <li key={index} className="material-badge">
                    {item.materiales?.nombre}
                  </li>
                ))}
              </ul>
            </section>
          )}

        {/* Precauciones */}
        {solution.solucion_precauciones &&
          solution.solucion_precauciones.length > 0 && (
            <section className="detail-section warning-section">
              <h3>⚠️ Precauciones importantes</h3>
              <ul className="detail-list warnings-list">
                {solution.solucion_precauciones.map((item, index) => (
                  <li key={index} className="warning-item">
                    {item.precauciones?.descripcion}
                  </li>
                ))}
              </ul>
            </section>
          )}
      </div>

      {/* Acciones */}
      <div className="solution-detail-actions">
        <Button
          variant="primary"
          onClick={() => onEdit(solution.id)}
          aria-label={`Editar solución: ${solutionData.title}`}
        >
          ✏️ Editar
        </Button>
        <Button
          variant="outline"
          onClick={() => onDelete(solution.id)}
          aria-label={`Eliminar solución: ${solutionData.title}`}
          style={{
            color: "var(--color-error)",
            borderColor: "var(--color-error)",
          }}
        >
          🗑️ Eliminar
        </Button>
      </div>
    </div>
  );
};

export default SolutionDetail;
