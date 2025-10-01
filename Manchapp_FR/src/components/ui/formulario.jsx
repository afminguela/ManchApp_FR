import React from 'react';

export default function Formulario() {
  return (

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
  );
}


