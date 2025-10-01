import React from 'react';

export default function ModalConfirmacion() {
  return (  

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
    );
}


    // Mostrar modal de confirmación
    showConfirmModal(title, message, onConfirm) {
        this.elements.confirmTitle.textContent = title;
        this.elements.confirmMessage.textContent = message;
        this.elements.confirmModal.classList.remove('hidden');
        
        // Remover listeners previos
        const newConfirmBtn = this.elements.confirmYes.cloneNode(true);
        this.elements.confirmYes.parentNode.replaceChild(newConfirmBtn, this.elements.confirmYes);
        this.elements.confirmYes = newConfirmBtn;
        
        // Agregar nuevo listener
        this.elements.confirmYes.addEventListener('click', onConfirm);
        this.elements.confirmYes.focus();
    }

    // Ocultar modal de confirmación
    hideConfirmModal() {
        this.elements.confirmModal.classList.add('hidden');
    }