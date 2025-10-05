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
        </div>
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
                <h2>🔍¿Qué necesitas limpiar?</h2>
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
    </div>
  );
};

export default SearchForm;
