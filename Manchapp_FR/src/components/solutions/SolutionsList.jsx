import { useState } from "react";
import SolutionItem from "./SolutionItem";
import Button from "../ui/Button";

const SolutionsList = ({
  solutions,
  onEdit,
  onDelete,
  showCompleteData = false,
}) => {
  const [displayCount, setDisplayCount] = useState(
    showCompleteData ? solutions.length : 6
  );

  const loadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 6, solutions.length));
  };

  if (solutions.length === 0) {
    return (
      <div className="solutions-list">
        <p>
          {showCompleteData
            ? "No se encontraron soluciones para esta combinación de material y mancha."
            : "No hay soluciones disponibles. Agrega una nueva solución para comenzar."}
        </p>
      </div>
    );
  }

  const displayedSolutions = solutions.slice(0, displayCount);
  const hasMore = displayCount < solutions.length;

  return (
    <>
      <div
        className="solutions-list"
        role="list"
        aria-label="Lista de soluciones de limpieza"
      >
        {displayedSolutions.map((solution) => (
          <SolutionItem
            key={solution.id}
            solution={solution}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {hasMore && !showCompleteData && (
        <div className="load-more-container">
          <Button variant="secondary" onClick={loadMore}>
            Cargar más soluciones ({solutions.length - displayCount} restantes)
          </Button>
        </div>
      )}
    </>
  );
};

export default SolutionsList;
