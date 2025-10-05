import { useState, useEffect } from "react";
import "./index.css";
import { supabaseService } from "./supabaseClient";

// Componentes UI
import SkipLink from "./components/ui/SkipLink";
import LoadingOverlay from "./components/ui/LoadingOverlay";
import Modal from "./components/ui/Modal";
import ConfirmModal from "./components/ui/ConfirmModal";

// Componentes de layout
import ConnectionStatus from "./components/layout/ConnectionStatus";

// Componentes de la lavadora
import ControlPanel from "./components/washing-machine/ControlPanel";
import WashingDoor from "./components/washing-machine/WashingDoor";

// Componentes de autenticación
import LoginSection from "./components/auth/LoginSection";

// Componentes de soluciones
import SolutionsSection from "./components/solutions/SolutionsSection";
import SolutionForm from "./components/solutions/SolutionForm";
import SearchForm from "./components/solutions/SearchForm";

function App() {
  // Estados principales
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Procesando...");

  // Estados de la aplicación
  const [state, setState] = useState({
    connected: false,
    authenticated: false,
    currentUser: null,
    currentEditingSolution: null,
  });

  // Estados de la interfaz
  const [showLogin, setShowLogin] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);

  // Estados de la pantalla y LEDs
  const [screenDisplay, setScreenDisplay] = useState({
    mainText: "ManchApp 2025, presiona el boton → ",
    statusText: "Inicia sesión para empezar",
  });

  const [leds, setLeds] = useState({
    power: false,
    connection: false,
    washing: false,
  });

  // Estado de conexión
  const [connectionMessage, setConnectionMessage] = useState(
    "Estado de conexión: Desconocido"
  );

  // Estado de soluciones (se cargan desde Supabase)
  const [solutions, setSolutions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // Estado del modal de confirmación
  const [confirmModal, setConfirmModal] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });

  // Carga soluciones desde Supabase cuando el usuario está autenticado
  useEffect(() => {
    const loadSolutions = async () => {
      if (state.authenticated) {
        showLoading("Cargando soluciones...");
        try {
          const { data, error } = await supabaseService.getSolutions();
          if (error) throw error;
          setSolutions(data || []);
        } catch {
          alert("Error al cargar las soluciones desde la base de datos");
        }
        hideLoading();
      }
    };

    loadSolutions();
  }, [state.authenticated]);

  // Funciones helper
  const showLoading = (message = "Procesando...") => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  const updateScreen = (mainText, statusText = "") => {
    setScreenDisplay({ mainText, statusText });
  };

  const updateLeds = (newLeds) => {
    setLeds((prev) => ({ ...prev, ...newLeds }));
  };

  // Wrapper para operaciones asíncronas (reduce duplicación de código)
  const handleAsyncOperation = async (message, operation, onError) => {
    showLoading(message);
    updateLeds({ washing: true });
    try {
      await operation();
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      updateLeds({ washing: false });
      hideLoading();
    }
  };

  const handlePowerButton = async () => {
    if (!state.connected) {
      showLoading("Verificando conexión con Supabase...");
      updateLeds({ washing: true });

      try {
        // Verificar conexión real con Supabase
        const connectionResult = await supabaseService.checkConnection();

        if (connectionResult.connected) {
          setState((prev) => ({ ...prev, connected: true }));
          updateLeds({ power: true, connection: true, washing: false });
          setConnectionMessage(`Estado: Conectado a Supabase`);
          updateScreen("CONECTADO", "Base de datos lista para usar");
          setShowLogin(true);
        } else {
          throw new Error(connectionResult.error || "Error de conexión");
        }
      } catch (error) {
        updateLeds({ power: false, connection: false, washing: false });
        setConnectionMessage(`Estado: Error - ${error.message}`);
        updateScreen("ERROR", "Conexión fallida");
      }

      hideLoading();
    }
  };

  const handleLogin = (loginData) =>
    handleAsyncOperation(
      "Autenticando...",
      async () => {
        const { data, error } = await supabaseService.signIn(
          loginData.username,
          loginData.password
        );

        if (error) {
          throw new Error(error.message);
        }

        if (data.user) {
          const { data: profile } = await supabaseService.getUserProfile(
            data.user.id
          );

          const displayName =
            profile?.user ||
            data.user.user_metadata?.full_name ||
            data.user.email.split("@")[0];

          setState((prev) => ({
            ...prev,
            authenticated: true,
            currentUser: displayName,
          }));
          setShowLogin(false);
          setShowSearchForm(true);
          updateScreen("BIENVENIDO", `Usuario: ${displayName}`);
        } else {
          throw new Error("Credenciales inválidas");
        }
      },
      (error) => {
        let errorMessage = error.message;

        if (error.message === "Invalid login credentials") {
          errorMessage = "Credenciales inválidas";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage =
            "⚠️ Email no verificado. Ve a tu bandeja de entrada y confirma tu email.";
        }

        alert(`Error: ${errorMessage}`);
        updateScreen("ERROR LOGIN", "Verifica tus credenciales");
      }
    );

  const handleRegister = (registerData) =>
    handleAsyncOperation(
      "Registrando usuario...",
      async () => {
        const { error } = await supabaseService.signUp(
          registerData.name,
          registerData.email,
          registerData.password
        );

        if (error) {
          let errorMessage = "Error al registrar usuario";
          if (error.message.includes("already registered")) {
            errorMessage =
              "Este email ya está registrado. Intenta iniciar sesión.";
          } else if (error.message.includes("password")) {
            errorMessage =
              "La contraseña no cumple con los requisitos de seguridad.";
          } else if (error.message.includes("email")) {
            errorMessage = "Email inválido. Verifica el formato.";
          } else if (
            error.message.includes("Email not confirmed") ||
            error.message.includes("confirm")
          ) {
            errorMessage =
              "⚠️ Necesitas verificar tu email. Ve a tu bandeja de entrada y confirma tu email.";
          } else {
            errorMessage = error.message;
          }

          updateScreen("ERROR REGISTRO", errorMessage);
          throw new Error(errorMessage);
        }

        setState((prev) => ({
          ...prev,
          authenticated: true,
          currentUser: registerData.name,
        }));
        setShowLogin(false);
        setShowSearchForm(true);
        updateScreen("BIENVENIDO", `Usuario: ${registerData.name}`);

        alert("¡Registrado con éxito! 🎉\n\nBienvenido a ManchApp.");
      },
      (error) => {
        alert(`Error: ${error.message}`);
        updateScreen("ERROR", "Error inesperado");
      }
    );

  const handleLogout = () => {
    setState({
      connected: false,
      authenticated: false,
      currentUser: null,
      currentEditingSolution: null,
    });
    setShowLogin(false);
    setShowSolutions(false);
    setShowSearchForm(false);
    setSearchResults([]);
    updateLeds({ power: false, connection: false, washing: false });
    setConnectionMessage("Estado de conexión: Desconocido");
    updateScreen("ManchApp 2025", "");
  };

  const handleSearch = (materialId, sustanciaId) =>
    handleAsyncOperation(
      "Buscando soluciones...",
      async () => {
        const { data, error } =
          await supabaseService.searchSolucionesByMaterialAndSustancia(
            materialId,
            sustanciaId
          );

        if (error) throw error;

        setSearchResults(data || []);
        setShowSearchForm(false);
        setShowSolutions(true);
        updateScreen(
          "RESULTADOS",
          `${data?.length || 0} soluciones encontradas${
            data?.length === 0 ? " - mostrando todo el catálogo" : ""
          }`
        );
      },
      () => {
        alert("Error al buscar soluciones. Inténtalo de nuevo.");
        updateScreen("ERROR", "Búsqueda fallida");
      }
    );

  const handleBackToSearch = () => {
    setShowSolutions(false);
    setShowSearchForm(true);
    setSearchResults([]);
    updateScreen("BIENVENIDO", `Usuario: ${state.currentUser}`);
  };

  const handleAddSolution = () => {
    setState((prev) => ({ ...prev, currentEditingSolution: null }));
    setShowSolutionModal(true);
  };

  const handleEditSolution = (id) => {
    const solution = solutions.find((s) => s.id === id);
    setState((prev) => ({ ...prev, currentEditingSolution: solution }));
    setShowSolutionModal(true);
  };

  const handleDeleteSolution = (id) => {
    const solution = solutions.find((s) => s.id === id);
    setConfirmModal({
      title: "Eliminar Solución",
      message: `¿Estás seguro de que deseas eliminar "${solution?.title}"?`,
      onConfirm: () => confirmDeleteSolution(id),
    });
    setShowConfirmModal(true);
  };

  const confirmDeleteSolution = (id) =>
    handleAsyncOperation(
      "Eliminando solución...",
      async () => {
        const { error } = await supabaseService.deleteSolution(id);
        if (error) throw error;

        setSolutions((prev) => prev.filter((s) => s.id !== id));
        setShowConfirmModal(false);
        alert("Solución eliminada correctamente");
      },
      (error) => {
        alert(`Error al eliminar la solución: ${error.message}`);
      }
    );

  const handleSolutionSubmit = (solutionData) =>
    handleAsyncOperation(
      "Guardando solución...",
      async () => {
        if (state.currentEditingSolution) {
          // Editar solución existente
          const { data, error } = await supabaseService.updateSolution(
            state.currentEditingSolution.id,
            solutionData
          );
          if (error) throw error;

          setSolutions((prev) =>
            prev.map((s) =>
              s.id === state.currentEditingSolution.id ? data : s
            )
          );
        } else {
          // Agregar nueva solución
          const { data, error } = await supabaseService.createSolution(
            solutionData
          );
          if (error) throw error;

          
          const newSolution = Array.isArray(data) ? data[0] : data;
          setSolutions((prev) => [...prev, newSolution]);
        }

        setShowSolutionModal(false);
        setState((prev) => ({ ...prev, currentEditingSolution: null }));
        alert("Solución guardada correctamente");
      },
      (error) => {
        alert(`Error al guardar la solución: ${error.message}`);
      }
    );

  const handleCancelSolution = () => {
    setShowSolutionModal(false);
    setState((prev) => ({ ...prev, currentEditingSolution: null }));
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setConfirmModal({ title: "", message: "", onConfirm: null });
  };

  return (
    <>
      <SkipLink />

      <ConnectionStatus message={connectionMessage} />

      <main id="main-content" className="main-container">
        <h1 className="sr-only">
          ManchApp Lavadora - Gestión de Soluciones de Limpieza
        </h1>

        <div className="washing-machine-container">
          <div className="field-background">
            <div className="grass-texture"></div>
          </div>

          <div
            className="washing-machine"
            role="application"
            aria-label="Interfaz de lavadora ManchApp"
          >
            <ControlPanel
              screenText={screenDisplay.mainText}
              screenStatus={screenDisplay.statusText}
              onPowerClick={handlePowerButton}
              leds={leds}
            />

            <WashingDoor isSpinning={leds.washing} />

            <LoginSection
              isVisible={showLogin && !state.authenticated}
              onLogin={handleLogin}
              onRegister={handleRegister}
            />

            <SearchForm
              isVisible={showSearchForm && state.authenticated}
              onSearch={handleSearch}
              isLoading={isLoading}
              supabaseService={supabaseService}
            />

            <SolutionsSection
              isVisible={showSolutions && state.authenticated}
              solutions={searchResults.length > 0 ? searchResults : solutions}
              onAdd={handleAddSolution}
              onEdit={handleEditSolution}
              onDelete={handleDeleteSolution}
              onLogout={handleLogout}
              onBackToSearch={
                !showSearchForm && state.authenticated
                  ? handleBackToSearch
                  : null
              }
            />
          </div>
        </div>
      </main>

      {/* Modal de solución */}
      <Modal
        isVisible={showSolutionModal}
        title={
          state.currentEditingSolution ? "Editar Solución" : "Agregar Solución"
        }
        onClose={handleCancelSolution}
      >
        <SolutionForm
          onSubmit={handleSolutionSubmit}
          onCancel={handleCancelSolution}
          initialData={state.currentEditingSolution}
        />
      </Modal>

      {/* Modal de confirmación */}
      <ConfirmModal
        isVisible={showConfirmModal}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={handleCancelConfirm}
      />

      <LoadingOverlay isVisible={isLoading} message={loadingMessage} />
    </>
  );
}

export default App;
