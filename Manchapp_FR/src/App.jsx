import { useState } from 'react'
import './index.css'
import LoadingOverlay from './components/ui/LoadingOverlay'

import { Formulario, ModalConfirmacion } from './components/ui'

function App() {
   const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      {/** Skip link para accesibilidad */}
    <a href="#main-content" className="skip-link">Saltar al contenido principal</a>

    {/** Indicador de estado de conexión */}
    <div className="connection-status" id="connection-status" role="status" aria-live="polite">
        <span id="connection-text">Estado de conexión: Desconocido</span>
    </div>

    <main id="main-content" className="main-container">
        <h1 className="sr-only">ManchApp Lavadora - Gestión de Soluciones de Limpieza</h1>

        {/** Contenedor principal de la lavadora */}
        < className="washing-machine-container">
            <div className="field-background">
                <div className="grass-texture"></div>
            </div>

            {/** Lavadora */}
            <div className="washing-machine" role="application" aria-label="Interfaz de lavadora ManchApp">
                {/** Panel de control superior */}
                <div className="control-panel">
                    <div className="lcd-screen" role="region" aria-label="Pantalla de estado">
                        <div className="screen-content" id="screen-content">
                            <div className="screen-text" id="screen-text">ManchApp 2025</div>
                            <div className="screen-status" id="screen-status"></div>
                        </div>
                    </div>
                    
                    <div className="control-buttons">
                        <button className="power-button" id="power-button" type="button" aria-describedby="power-help">
                            <span className="power-icon"></span>
                            <span className="sr-only">Botón de encendido - Verificar conexión</span>
                        </button>
                        <div id="power-help" className="sr-only">Presiona para verificar la conexión a la base de datos</div>

                        <div className="indicator-lights">
                            <div className="led power-led" id="power-led" role="img" aria-label="Indicador de encendido"></div>
                            <div className="led connection-led" id="connection-led" role="img" aria-label="Indicador de conexión"></div>
                            <div className="led washing-led" id="washing-led" role="img" aria-label="Indicador de lavado"></div>
                        </div>
                    </div>
                </div>

                {/** Puerta de la lavadora */}
                <div className="washing-machine-door">
                    <div className="door-frame">
                        <div className="door-glass">
                            <div className="door-seal"></div>
                            <div className="drum-container">
                                <div className="drum" id="drum" role="img" aria-label="Tambor de la lavadora">
                                    <div className="drum-holes">
                                        <div className="hole"></div>
                                        <div className="hole"></div>
                                        <div className="hole"></div>
                                        <div className="hole"></div>
                                        <div className="hole"></div>
                                        <div className="hole"></div>
                                        <div className="hole"></div>
                                        <div className="hole"></div>
                                        <div className="hole"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="door-handle" role="button" aria-label="Manija de la puerta" tabIndex="0"></div>
                    </div>
                </div>

                {/** Formulario de login (inicialmente oculto) */}
                <div className="login-section hidden" id="login-section" role="region" aria-labelledby="login-title">
                    <h2 id="login-title" className="section-title">Iniciar Sesión</h2>
                    <form className="login-form" id="login-form" novalidate>
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">Usuario</label>
                            <input type="text" id="username" name="username" className="form-control" required aria-describedby="username-error" />
                            <div id="username-error" className="error-message" role="alert"></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input type="password" id="password" name="password" className="form-control" required aria-describedby="password-error" />
                            <div id="password-error" className="error-message" role="alert"></div>
                        </div>
                        <button type="submit" className="btn btn--primary btn--full-width">Ingresar</button>
                    </form>
                </div>

                {/** Panel de gestión de soluciones (inicialmente oculto) */}
                <div className="solutions-section hidden" id="solutions-section" role="region" aria-labelledby="solutions-title">
                    <h2 id="solutions-title" className="section-title">Soluciones de Limpieza</h2>

                    {/** Barra de acciones */}
                    <div className="solutions-actions">
                        <button className="btn btn--primary" id="add-solution-btn" type="button">
                            <span aria-hidden="true">+</span> Agregar Solución
                        </button>
                        <button className="btn btn--secondary" id="logout-btn" type="button">Cerrar Sesión</button>
                    </div>

                    {/** Lista de soluciones */}
                    <div className="solutions-list" id="solutions-list" role="list" aria-label="Lista de soluciones de limpieza">
                    </div>
                </div>

                {/** Formulario de solución (modal) */}
                <div className="modal hidden" id="solution-modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 id="modal-title">Agregar Solución</h3>
                            <button className="modal-close" id="modal-close" type="button" aria-label="Cerrar modal">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                       <Formulario />
                    </div>
                </div>
            </div>
        <</Z>
        {/* Modal de confirmación */}
        <ModalConfirmacion />
    </main>

    {/* Loading overlay */}
    <LoadingOverlay isLoading={isLoading} />
    </>
  )
}

export default App
