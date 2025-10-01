import { useState } from 'react'
import './index.css'

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
        <div className="washing-machine-container">
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
                        <form className="solution-form" id="solution-form" novalidate>
                            <div className="form-group">
                                <label htmlFor="solution-title" className="form-label">Título</label>
                                <input type="text" id="solution-title" name="title" className="form-control" required />
                                <div id="title-error" className="error-message" role="alert"></div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="solution-instructions" className="form-label">Instrucciones</label>
                                <textarea id="solution-instructions" name="instructions" className="form-control" rows="4" required></textarea>
                                <div id="instructions-error" className="error-message" role="alert"></div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="solution-difficulty" className="form-label">Dificultad</label>
                                <select id="solution-difficulty" name="difficulty" className="form-control" required>
                                    <option value="">Seleccionar dificultad</option>
                                    <option value="LOW">Baja</option>
                                    <option value="MEDIUM">Media</option>
                                    <option value="HIGH">Alta</option>
                                    <option value="EXTREME">Extrema</option>
                                </select>
                                <div id="difficulty-error" class="error-message" role="alert"></div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="solution-time" className="form-label">Tiempo (minutos)</label>
                                <input type="number" id="solution-time" name="time_minutes" className="form-control" min="1" max="240" required />
                                <div id="time-error" className="error-message" role="alert"></div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="solution-tips" className="form-label">Consejos (opcional)</label>
                                <textarea id="solution-tips" name="tips" className="form-control" rows="2"></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn btn--primary">Guardar</button>
                                <button type="button" className="btn btn--outline" id="cancel-solution">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        {/* Modal de confirmación */}
        <div className="modal hidden" id="confirm-modal" role="dialog" aria-labelledby="confirm-title" aria-modal="true">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 id="confirm-title">Confirmar Acción</h3>
                </div>
                <div className="modal-body">
                    <p id="confirm-message">¿Estás seguro de que deseas realizar esta acción?</p>
                </div>
                <div className="modal-actions">
                    <button className="btn btn--primary" id="confirm-yes">Confirmar</button>
                    <button className="btn btn--outline" id="confirm-no">Cancelar</button>
                </div>
            </div>
        </div>
    </main>

    {/* Loading overlay */}
    <div className="loading-overlay hidden" id="loading-overlay" role="status" aria-label="Cargando">
        <div className="loading-spinner"></div>
        <div className="loading-text">Procesando...</div>
    </div>
    </>
  )
}

export default App
