import { useState } from "react";
import SolutionItem from "./SolutionItem";
import SolutionDetail from "./SolutionDetail";
import Button from "../ui/Button";

const SolutionsList = ({
  solutions,
  onEdit,
  onDelete,
  showCompleteData = false,
}) => {
  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSolution, setSelectedSolution] = useState(null);

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

  // Si hay una solución seleccionada, mostrar vista detallada
  if (selectedSolution) {
    return (
      <SolutionDetail
        solution={selectedSolution}
        onEdit={onEdit}
        onDelete={(id) => {
          onDelete(id);
          setSelectedSolution(null);
        }}
        onBack={() => setSelectedSolution(null)}
      />
    );
  }

  // Si showCompleteData es true, mostrar todas las soluciones sin paginación
  if (showCompleteData) {
    return (
      <div
        className="solutions-list"
        role="list"
        aria-label="Lista de soluciones de limpieza"
      >
        {solutions.map((solution) => (
          <SolutionItem
            key={solution.id}
            solution={solution}
            onEdit={onEdit}
            onDelete={onDelete}
            onClick={setSelectedSolution}
          />
        ))}
      </div>
    );
  }

  // Cálculos de paginación
  const totalPages = Math.ceil(solutions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSolutions = solutions.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div
        className="solutions-list"
        role="list"
        aria-label="Lista de soluciones de limpieza"
      >
        {currentSolutions.map((solution) => (
          <SolutionItem
            key={solution.id}
            solution={solution}
            onEdit={onEdit}
            onDelete={onDelete}
            onClick={setSelectedSolution}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div
          className="pagination-controls"
          role="navigation"
          aria-label="Paginación de soluciones"
        >
          <Button
            variant="secondary"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            aria-label="Página anterior"
          >
            ← Anterior
          </Button>

          <div className="pagination-info">
            <span className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`page-number ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => goToPage(page)}
                    aria-label={`Ir a página ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                )
              )}
            </span>
            <span className="page-info" aria-live="polite">
              Página {currentPage} de {totalPages} ({solutions.length}{" "}
              soluciones)
            </span>
          </div>

          <Button
            variant="secondary"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            aria-label="Página siguiente"
          >
            Siguiente →
          </Button>
        </div>
      )}
    </>
  );
};

export default SolutionsList;
