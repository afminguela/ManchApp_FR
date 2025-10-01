import React from 'react';

export default function LoadingOverlay() {

    
  return (


    <div className="loading-overlay hidden" id="loading-overlay" role="status" aria-label="Cargando">
        <div className="loading-spinner"></div>
        <div className="loading-text">Procesando...</div>
    </div>
    );

// Mostrar loading
    showLoading(message = 'Cargando...') {
        this.elements.loadingOverlay.querySelector('.loading-text').textContent = message;
        this.elements.loadingOverlay.classList.remove('hidden');
    }

    // Ocultar loading
    hideLoading() {
        this.elements.loadingOverlay.classList.add('hidden');
    }
}
