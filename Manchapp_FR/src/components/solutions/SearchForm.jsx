import { useState, useEffect } from "react";
import Button from "../ui/Button";

const SearchForm = ({ onSearch, isLoading, isVisible, supabaseService }) => {
  const [materiales, setMateriales] = useState([]);
  const [sustancias, setSustancias] = useState([]);
  const [searchData, setSearchData] = useState({
    materialId: "",
    sustanciaId: "",
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        console.log("🔄 Iniciando carga de datos del formulario...");
        console.log("📡 supabaseService disponible:", !!supabaseService);
        setLoadingData(true);

        // Cargar materiales y sustancias en paralelo
        const [materialesResult, sustanciasResult] = await Promise.all([
          supabaseService.getMateriales(),
          supabaseService.getSustancias(),
        ]);

        console.log("📋 Resultado materiales:", materialesResult);
        console.log("🧪 Resultado sustancias:", sustanciasResult);

        if (materialesResult.data) {
          console.log("✅ Materiales cargados:", materialesResult.data.length);
          console.log("📋 Lista de materiales:", materialesResult.data);
          setMateriales(materialesResult.data);
        } else {
          console.warn("⚠️ No hay datos de materiales:", materialesResult);
        }

        if (sustanciasResult.data) {
          console.log("✅ Sustancias cargadas:", sustanciasResult.data.length);
          console.log("🧪 Lista de sustancias:", sustanciasResult.data);
          setSustancias(sustanciasResult.data);
        } else {
          console.warn("⚠️ No hay datos de sustancias:", sustanciasResult);
        }
      } catch (error) {
        console.error("❌ Error cargando datos del formulario:", error);
      } finally {
        setLoadingData(false);
      }
    };

    if (isVisible && supabaseService) {
      loadFormData();
    } else {
      console.log("⏸️ No se cargan datos:", {
        isVisible,
        supabaseService: !!supabaseService,
      });
    }
  }, [isVisible, supabaseService]);

  const handleRefreshData = async () => {
    try {
      console.log("🔄 Recargando datos del formulario...");
      setLoadingData(true);

      // Cargar materiales y sustancias en paralelo
      const [materialesResult, sustanciasResult] = await Promise.all([
        supabaseService.getMateriales(),
        supabaseService.getSustancias(),
      ]);

      if (materialesResult.data) {
        console.log("✅ Materiales recargados:", materialesResult.data.length);
        setMateriales(materialesResult.data);
      }

      if (sustanciasResult.data) {
        console.log("✅ Sustancias recargadas:", sustanciasResult.data.length);
        setSustancias(sustanciasResult.data);
      }
    } catch (error) {
      console.error("❌ Error recargando datos:", error);
      alert("Error al recargar los datos. Inténtalo de nuevo.");
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!searchData.materialId || !searchData.sustanciaId) {
      alert(
        "Por favor selecciona tanto el material como la sustancia de la mancha"
      );
      return;
    }

    onSearch(searchData.materialId, searchData.sustanciaId);
  };

  if (!isVisible) {
    return null;
  }

  if (loadingData) {
    return (
      <div className="modern-search-container">
        <div className="search-header">
          <div className="search-icon">🔍</div>
          <h2>Cargando datos...</h2>
          <p>Preparando formulario de búsqueda</p>
        </div>
        <style jsx>{`
          .modern-search-container {
            background: rgba(255, 255, 255, 0.5);
            border-radius: 24px;
            padding: 32px;
            max-width: 600px;
            width: 100%;
            margin: 16px auto;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.8);
            -webkit-backdrop-filter: blur(5px);
            backdrop-filter: blur(5px);
            box-sizing: border-box;
          }

          @media (max-width: 768px) {
            .modern-search-container {
              padding: 20px;
              margin: 12px;
              border-radius: 16px;
              max-width: calc(100vw - 24px);
            }
          }

          @media (max-width: 480px) {
            .modern-search-container {
              padding: 16px;
              margin: 8px;
              border-radius: 12px;
              max-width: calc(100vw - 16px);
            }
          }

          .search-header {
            text-align: center;
          }
          .search-icon {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.8;
          }

          @media (max-width: 480px) {
            .search-icon {
              font-size: 36px;
              margin-bottom: 12px;
            }
          }

          .search-header h2 {
            font-size: 28px;
            font-weight: 700;
            color: #1e293b;
            margin: 0 0 8px 0;
            line-height: 1.2;
          }

          @media (max-width: 768px) {
            .search-header h2 {
              font-size: 24px;
            }
          }

          @media (max-width: 480px) {
            .search-header h2 {
              font-size: 20px;
            }
          }

          .search-header p {
            font-size: 16px;
            color: #64748b;
            margin: 0;
            font-weight: 400;
          }
        `}</style>
      </div>
    );
  }

  // Si no hay datos después de cargar, mostrar mensaje de error
  if (!loadingData && materiales.length === 0 && sustancias.length === 0) {
    return (
      <div className="modern-search-container">
        <div className="search-header">
          <div className="search-icon">⚠️</div>
          <h2>Datos No Disponibles</h2>
          <p>
            No se pudieron cargar materiales y sustancias desde la base de datos
          </p>

          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              background: "rgba(59, 130, 246, 0.1)",
              borderRadius: "12px",
              textAlign: "left",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px 0",
                color: "#1e293b",
                fontSize: "16px",
              }}
            >
              📋 Pasos para solucionar:
            </h3>
            <ol
              style={{
                margin: "0",
                paddingLeft: "20px",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              <li>
                Haz clic en el botón <strong>"DEBUG"</strong> (esquina superior
                derecha)
              </li>
              <li>Espera a que se carguen los datos de ejemplo</li>
              <li>
                Usa el botón <strong>"🔄 Recargar Datos"</strong> de abajo
              </li>
              <li>¡Listo! Ya puedes seleccionar material y sustancia</li>
            </ol>
          </div>

          <button
            type="button"
            onClick={handleRefreshData}
            disabled={loadingData}
            style={{
              marginTop: "16px",
              padding: "12px 24px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            🔄 Recargar Datos
          </button>
        </div>
        <style jsx>{`
          .modern-search-container {
            background: rgba(255, 255, 255, 0.5);
            border-radius: 24px;
            padding: 32px;
            max-width: 600px;
            margin: 0 auto;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.8);
            -webkit-backdrop-filter: blur(5px);
            backdrop-filter: blur(5px);
          }
          .search-header {
            text-align: center;
          }
          .search-icon {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.8;
          }
          .search-header h2 {
            font-size: 28px;
            font-weight: 700;
            color: #dc2626;
            margin: 0 0 8px 0;
            line-height: 1.2;
          }
          .search-header p {
            font-size: 16px;
            color: #64748b;
            margin: 0;
            font-weight: 400;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="modern-search-container">
      <div className="search-header">
        <div className="search-icon">🔍</div>
        <h2>¿Qué necesitas limpiar?</h2>
        <p>Selecciona el tipo de mancha y la superficie afectada</p>
      </div>{" "}
      <form onSubmit={handleSubmit} className="modern-search-form">
        <div className="form-sections">
          {/* Sección de Mancha/Sustancia */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">🧪</div>
              <div className="section-info">
                <h3>Tipo de Mancha</h3>
                <p>¿Qué tipo de sustancia causó la mancha?</p>
              </div>
            </div>
            <div className="custom-select-container">
              <select
                id="sustancia"
                value={searchData.sustanciaId}
                onChange={(e) =>
                  handleInputChange("sustanciaId", e.target.value)
                }
                disabled={isLoading}
                required
                className="custom-select"
              >
                <option value="">Elige el tipo de mancha</option>
                {sustancias.length === 0 ? (
                  <option disabled>No hay sustancias disponibles</option>
                ) : (
                  sustancias.map((sustancia) => (
                    <option key={sustancia.id} value={sustancia.id}>
                      {sustancia.nombre}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Sección de Material */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">🧵</div>
              <div className="section-info">
                <h3>Tipo de Superficie</h3>
                <p>¿En qué material está la mancha?</p>
              </div>
            </div>
            <div className="custom-select-container">
              <select
                id="material"
                value={searchData.materialId}
                onChange={(e) =>
                  handleInputChange("materialId", e.target.value)
                }
                disabled={isLoading}
                required
                className="custom-select"
              >
                <option value="">Selecciona la superficie</option>
                {materiales.length === 0 ? (
                  <option disabled>No hay materiales disponibles</option>
                ) : (
                  materiales.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.nombre}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <Button
            type="submit"
            variant="primary"
            disabled={
              isLoading || !searchData.materialId || !searchData.sustanciaId
            }
            className="search-button"
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Buscando...
              </>
            ) : (
              <>Obtener Solución →</>
            )}
          </Button>
        </div>
      </form>
      <style jsx>{`
        .modern-search-container {
          background: rgba(255, 255, 255, 0.5);
          border-radius: 24px;
          padding: 32px;
          max-width: 600px;
          width: 100%;
          margin: 16px auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .modern-search-container {
            padding: 20px;
            margin: 12px;
            border-radius: 16px;
            max-width: calc(100vw - 24px);
          }
        }

        @media (max-width: 480px) {
          .modern-search-container {
            padding: 16px;
            margin: 8px;
            border-radius: 12px;
            max-width: calc(100vw - 16px);
          }
        }

        .search-header {
          text-align: center;
          margin-bottom: 40px;
        }

        @media (max-width: 768px) {
          .search-header {
            margin-bottom: 24px;
          }
        }

        .search-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.8;
        }

        @media (max-width: 480px) {
          .search-icon {
            font-size: 36px;
            margin-bottom: 12px;
          }
        }

        .search-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
          line-height: 1.2;
        }

        @media (max-width: 768px) {
          .search-header h2 {
            font-size: 24px;
          }
        }

        @media (max-width: 480px) {
          .search-header h2 {
            font-size: 20px;
          }
        }

        .search-header p {
          font-size: 16px;
          color: #64748b;
          margin: 0;
          font-weight: 400;
        }

        @media (max-width: 480px) {
          .search-header p {
            font-size: 14px;
          }
        }

        .modern-search-form {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        @media (max-width: 768px) {
          .modern-search-form {
            gap: 20px;
          }
        }

        .form-sections {
          display: grid;
          gap: 24px;
        }

        @media (max-width: 768px) {
          .form-sections {
            gap: 16px;
          }
        }

        .form-section {
          background: rgba(248, 250, 252, 0.7);
          border-radius: 16px;
          padding: 24px;
          border: 2px solid rgba(226, 232, 240, 0.8);
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .form-section {
            padding: 16px;
            border-radius: 12px;
          }
        }

        .form-section:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .section-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 16px;
        }

        @media (max-width: 600px) {
          .section-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 12px;
          }
        }

        .section-icon {
          font-size: 24px;
          width: 48px;
          height: 48px;
          background: #3b82f6;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: white;
        }

        @media (max-width: 600px) {
          .section-icon {
            font-size: 20px;
            width: 40px;
            height: 40px;
          }
        }

        .section-info h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        @media (max-width: 480px) {
          .section-info h3 {
            font-size: 16px;
          }
        }

        .section-info p {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        @media (max-width: 480px) {
          .section-info p {
            font-size: 12px;
          }
        }

        .custom-select-container {
          position: relative;
        }

        .custom-select {
          width: 100%;
          padding: 16px 20px;
          font-size: 16px;
          font-weight: 500;
          color: #1e293b;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 20px;
          padding-right: 50px;
          box-sizing: border-box;
        }

        @media (max-width: 480px) {
          .custom-select {
            padding: 14px 16px;
            font-size: 14px;
            padding-right: 44px;
            background-size: 18px;
            background-position: right 12px center;
          }
        }

        .custom-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .custom-select:disabled {
          background-color: rgba(241, 245, 249, 0.7);
          cursor: not-allowed;
          opacity: 0.7;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          margin-top: 8px;
        }

        .search-button {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          border: none;
          padding: 16px 32px;
          font-size: 18px;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .search-button {
            padding: 14px 24px;
            font-size: 16px;
            min-width: 180px;
          }
        }

        @media (max-width: 480px) {
          .search-button {
            padding: 12px 20px;
            font-size: 14px;
            min-width: 160px;
            width: 100%;
          }
        }

        .search-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        @media (hover: none) {
          .search-button:hover:not(:disabled) {
            transform: none;
          }
        }

        .search-button:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .modern-search-container {
            padding: 24px;
            margin: 16px;
          }

          .search-header h2 {
            font-size: 24px;
          }

          .section-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 12px;
          }

          .section-icon {
            font-size: 20px;
            width: 40px;
            height: 40px;
          }

          .search-button {
            font-size: 16px;
            padding: 14px 24px;
            min-width: 180px;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchForm;
