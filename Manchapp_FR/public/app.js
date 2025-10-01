// ManchApp Lavadora - JavaScript Application
class ManchAppLavadora {
    constructor() {
        this.state = {
            connected: false,
            authenticated: false,
            currentUser: null,
            solutions: [],
            currentEditingSolution: null
        };

        this.elements = this.initElements();
        this.initEventListeners();
        this.loadInitialData();
        this.updateUI();
    }

    // Inicializar referencias a elementos DOM
    initElements() {
        return {
            // Botones principales
            powerButton: document.getElementById('power-button'),
            loginForm: document.getElementById('login-form'),
            logoutBtn: document.getElementById('logout-btn'),
            
            // Secciones
            loginSection: document.getElementById('login-section'),
            solutionsSection: document.getElementById('solutions-section'),
            
            // Pantalla LCD
            screenText: document.getElementById('screen-text'),
            screenStatus: document.getElementById('screen-status'),
            
            // LEDs indicadores
            powerLed: document.getElementById('power-led'),
            connectionLed: document.getElementById('connection-led'),
            washingLed: document.getElementById('washing-led'),
            
            // Tambor
            drum: document.getElementById('drum'),
            
            // Estado de conexión
            connectionStatus: document.getElementById('connection-status'),
            connectionText: document.getElementById('connection-text'),
            
            // Soluciones
            addSolutionBtn: document.getElementById('add-solution-btn'),
            solutionsList: document.getElementById('solutions-list'),
            
            // Modal de solución
            solutionModal: document.getElementById('solution-modal'),
            modalTitle: document.getElementById('modal-title'),
            modalClose: document.getElementById('modal-close'),
            solutionForm: document.getElementById('solution-form'),
            cancelSolution: document.getElementById('cancel-solution'),
            
            // Modal de confirmación
            confirmModal: document.getElementById('confirm-modal'),
            confirmTitle: document.getElementById('confirm-title'),
            confirmMessage: document.getElementById('confirm-message'),
            confirmYes: document.getElementById('confirm-yes'),
            confirmNo: document.getElementById('confirm-no'),
            
            // Loading overlay
            loadingOverlay: document.getElementById('loading-overlay'),
            
            // Campos de formulario
            username: document.getElementById('username'),
            password: document.getElementById('password')
        };
    }

    // Inicializar event listeners
    initEventListeners() {
        // Botón de encendido - Health check
        this.elements.powerButton.addEventListener('click', () => this.handlePowerButton());
        
        // Formulario de login
        this.elements.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Botón de logout
        this.elements.logoutBtn.addEventListener('click', () => this.handleLogout());
        
        // Botón agregar solución
        this.elements.addSolutionBtn.addEventListener('click', () => this.showSolutionModal());
        
        // Modal de solución
        this.elements.modalClose.addEventListener('click', () => this.hideSolutionModal());
        this.elements.cancelSolution.addEventListener('click', () => this.hideSolutionModal());
        this.elements.solutionForm.addEventListener('submit', (e) => this.handleSolutionSubmit(e));
        
        // Modal de confirmación
        this.elements.confirmNo.addEventListener('click', () => this.hideConfirmModal());
        
        // Cerrar modales con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideSolutionModal();
                this.hideConfirmModal();
            }
        });
        
        // Cerrar modales clickeando fuera
        this.elements.solutionModal.addEventListener('click', (e) => {
            if (e.target === this.elements.solutionModal) {
                this.hideSolutionModal();
            }
        });
        
        this.elements.confirmModal.addEventListener('click', (e) => {
            if (e.target === this.elements.confirmModal) {
                this.hideConfirmModal();
            }
        });
        
        // Validación en tiempo real
        this.elements.username.addEventListener('input', () => this.clearFieldError('username'));
        this.elements.password.addEventListener('input', () => this.clearFieldError('password'));
    }

    // Cargar datos iniciales
    loadInitialData() {
        // Datos mock de soluciones (simula los datos proporcionados)
        this.state.solutions = [
            {
                id: 1,
                title: "Quitar vino tinto de algodón",
                instructions: "Espolvorear sal sobre la mancha fresca, dejar absorber unos minutos, retirar la sal, enjuagar con agua fría y lavar con detergente suave.",
                difficulty: "LOW",
                time_minutes: 15,
                tips: "No dejar secar la mancha antes de limpiar. Si la mancha persiste, aplicar agua oxigenada diluida."
            },
            {
                id: 2,
                title: "Eliminar grasa de cuero",
                instructions: "Usar cepillo y detergente suave, frotar suavemente y limpiar con paño húmedo.",
                difficulty: "MEDIUM",
                time_minutes: 10,
                tips: "No mojar demasiado el cuero."
            },
            {
                id: 3,
                title: "Quitar café de lino",
                instructions: "Aplicar agua fría y jabón neutro, frotar suavemente y enjuagar.",
                difficulty: "LOW",
                time_minutes: 8,
                tips: "Actuar rápido antes de que se seque."
            },
            {
                id: 4,
                title: "Eliminar sangre de algodón",
                instructions: "Remojar en agua fría, aplicar detergente y frotar suavemente.",
                difficulty: "MEDIUM",
                time_minutes: 12,
                tips: "No usar agua caliente."
            },
            {
                id: 5,
                title: "Quitar chocolate de poliéster",
                instructions: "Raspar el exceso, aplicar agua tibia y jabón neutro.",
                difficulty: "LOW",
                time_minutes: 10,
                tips: "No frotar fuerte para no dañar la tela."
            }
        ];
    }

    // Manejar botón de encendido
    async handlePowerButton() {
        if (!this.state.connected) {
            await this.checkConnection();
        } else {
            this.showLoginForm();
        }
    }

    // Verificar conexión (simulado)
    async checkConnection() {
        this.showLoading('Verificando conexión...');
        this.startWashing();
        
        try {
            // Simular llamada a /api/health
            await this.simulateApiCall('/api/health', 1500);
            
            this.state.connected = true;
            this.updateConnectionStatus('Conexión abierta', true);
            this.elements.powerButton.classList.add('active');
            this.elements.powerLed.classList.add('active');
            this.elements.connectionLed.classList.add('active');
            
            this.updateScreen('CONECTADO', 'Sistema listo');
            
            // Mostrar formulario de login después de conectar
            setTimeout(() => {
                this.hideLoading();
                this.showLoginForm();
            }, 500);
            
        } catch (error) {
            this.state.connected = false;
            this.updateConnectionStatus('Sin conexión con la DB', false);
            this.updateScreen('ERROR', 'Conexión fallida');
            this.hideLoading();
            this.showAlert('Error de conexión. Intenta nuevamente.');
        }
        
        this.stopWashing();
    }

    // Mostrar formulario de login
    showLoginForm() {
        this.elements.loginSection.classList.remove('hidden');
        this.elements.username.focus();
        this.updateScreen('LOGIN', 'Ingrese credenciales');
    }

    // Manejar login
    async handleLogin(e) {
        e.preventDefault();
        
        const username = this.elements.username.value.trim();
        const password = this.elements.password.value.trim();
        
        // Validar campos
        if (!this.validateLoginForm(username, password)) {
            return;
        }
        
        this.showLoading('Autenticando...');
        this.startWashing();
        
        try {
            // Simular autenticación
            await this.simulateApiCall('/api/login', 1000);
            
            // Login exitoso (en una app real, validar credenciales)
            this.state.authenticated = true;
            this.state.currentUser = { name: username };
            
            this.hideLoading();
            this.hideLoginForm();
            this.showSolutionsSection();
            this.updateScreen('BIENVENIDO', `Hola ${username}`);
            
        } catch (error) {
            this.hideLoading();
            this.showAlert('Error de autenticación. Verifica tus credenciales.');
        }
        
        this.stopWashing();
    }

    // Validar formulario de login
    validateLoginForm(username, password) {
        let isValid = true;
        
        if (!username) {
            this.showFieldError('username', 'El usuario es requerido');
            isValid = false;
        }
        
        if (!password) {
            this.showFieldError('password', 'La contraseña es requerida');
            isValid = false;
        }
        
        return isValid;
    }

    // Ocultar formulario de login
    hideLoginForm() {
        this.elements.loginSection.classList.add('hidden');
        this.elements.loginForm.reset();
        this.clearAllFieldErrors();
    }

    // Mostrar sección de soluciones
    showSolutionsSection() {
        this.elements.solutionsSection.classList.remove('hidden');
        this.renderSolutions();
    }

    // Manejar logout
    handleLogout() {
        this.state.authenticated = false;
        this.state.currentUser = null;
        this.elements.solutionsSection.classList.add('hidden');
        this.hideLoginForm();
        
        // Reset de la lavadora
        this.state.connected = false;
        this.elements.powerButton.classList.remove('active');
        this.elements.powerLed.classList.remove('active');
        this.elements.connectionLed.classList.remove('active');
        
        this.updateConnectionStatus('Estado de conexión: Desconocido', false);
        this.updateScreen('ManchApp 2025', '');
        
        this.showAlert('Sesión cerrada correctamente.');
    }

    // Renderizar lista de soluciones
    renderSolutions() {
        const container = this.elements.solutionsList;
        container.innerHTML = '';
        
        if (this.state.solutions.length === 0) {
            container.innerHTML = '<p class="no-solutions">No hay soluciones disponibles.</p>';
            return;
        }
        
        this.state.solutions.forEach(solution => {
            const solutionElement = this.createSolutionElement(solution);
            container.appendChild(solutionElement);
        });
    }

    // Crear elemento de solución
    createSolutionElement(solution) {
        const article = document.createElement('article');
        article.className = 'solution-item';
        article.setAttribute('role', 'listitem');
        
        const difficultyClass = `difficulty-${solution.difficulty.toLowerCase()}`;
        const difficultyText = this.getDifficultyText(solution.difficulty);
        
        article.innerHTML = `
            <div class="solution-content">
                <h3 class="solution-title">${this.escapeHtml(solution.title)}</h3>
                <div class="solution-meta">
                    <span class="difficulty-badge ${difficultyClass}">${difficultyText}</span>
                    <span>${solution.time_minutes} min</span>
                </div>
                <p class="solution-instructions">${this.escapeHtml(solution.instructions)}</p>
                ${solution.tips ? `<p class="solution-tips"><strong>Consejo:</strong> ${this.escapeHtml(solution.tips)}</p>` : ''}
            </div>
            <div class="solution-actions">
                <button class="btn btn--sm btn--outline" onclick="manchApp.editSolution(${solution.id})" aria-label="Editar solución: ${this.escapeHtml(solution.title)}">
                    Editar
                </button>
                <button class="btn btn--sm btn--outline" onclick="manchApp.deleteSolution(${solution.id})" aria-label="Eliminar solución: ${this.escapeHtml(solution.title)}" style="color: var(--color-error); border-color: var(--color-error);">
                    Eliminar
                </button>
            </div>
        `;
        
        return article;
    }

    // Mostrar modal de solución
    showSolutionModal(solution = null) {
        this.state.currentEditingSolution = solution;
        
        if (solution) {
            this.elements.modalTitle.textContent = 'Editar Solución';
            this.populateSolutionForm(solution);
        } else {
            this.elements.modalTitle.textContent = 'Agregar Solución';
            this.elements.solutionForm.reset();
        }
        
        this.elements.solutionModal.classList.remove('hidden');
        this.elements.solutionForm.querySelector('input').focus();
        this.clearAllFieldErrors();
    }

    // Ocultar modal de solución
    hideSolutionModal() {
        this.elements.solutionModal.classList.add('hidden');
        this.state.currentEditingSolution = null;
        this.elements.solutionForm.reset();
        this.clearAllFieldErrors();
    }

    // Poblar formulario de solución
    populateSolutionForm(solution) {
        document.getElementById('solution-title').value = solution.title;
        document.getElementById('solution-instructions').value = solution.instructions;
        document.getElementById('solution-difficulty').value = solution.difficulty;
        document.getElementById('solution-time').value = solution.time_minutes;
        document.getElementById('solution-tips').value = solution.tips || '';
    }

    // Manejar envío de formulario de solución
    async handleSolutionSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.elements.solutionForm);
        const solutionData = {
            title: formData.get('title').trim(),
            instructions: formData.get('instructions').trim(),
            difficulty: formData.get('difficulty'),
            time_minutes: parseInt(formData.get('time_minutes')),
            tips: formData.get('tips').trim()
        };
        
        // Validar datos
        if (!this.validateSolutionForm(solutionData)) {
            return;
        }
        
        this.showLoading(this.state.currentEditingSolution ? 'Actualizando...' : 'Guardando...');
        this.startWashing();
        
        try {
            await this.simulateApiCall('/api/solutions', 800);
            
            if (this.state.currentEditingSolution) {
                // Actualizar solución existente
                const index = this.state.solutions.findIndex(s => s.id === this.state.currentEditingSolution.id);
                this.state.solutions[index] = { ...solutionData, id: this.state.currentEditingSolution.id };
            } else {
                // Agregar nueva solución
                const newId = Math.max(...this.state.solutions.map(s => s.id)) + 1;
                this.state.solutions.push({ ...solutionData, id: newId });
            }
            
            this.hideLoading();
            this.hideSolutionModal();
            this.renderSolutions();
            this.showAlert(this.state.currentEditingSolution ? 'Solución actualizada correctamente.' : 'Solución agregada correctamente.');
            
        } catch (error) {
            this.hideLoading();
            this.showAlert('Error al guardar la solución. Intenta nuevamente.');
        }
        
        this.stopWashing();
    }

    // Validar formulario de solución
    validateSolutionForm(data) {
        let isValid = true;
        
        if (!data.title) {
            this.showFieldError('title', 'El título es requerido');
            isValid = false;
        }
        
        if (!data.instructions) {
            this.showFieldError('instructions', 'Las instrucciones son requeridas');
            isValid = false;
        }
        
        if (!data.difficulty) {
            this.showFieldError('difficulty', 'La dificultad es requerida');
            isValid = false;
        }
        
        if (!data.time_minutes || data.time_minutes < 1 || data.time_minutes > 240) {
            this.showFieldError('time', 'El tiempo debe estar entre 1 y 240 minutos');
            isValid = false;
        }
        
        return isValid;
    }

    // Editar solución
    editSolution(id) {
        const solution = this.state.solutions.find(s => s.id === id);
        if (solution) {
            this.showSolutionModal(solution);
        }
    }

    // Eliminar solución
    deleteSolution(id) {
        const solution = this.state.solutions.find(s => s.id === id);
        if (!solution) return;
        
        this.showConfirmModal(
            'Confirmar Eliminación',
            `¿Estás seguro de que deseas eliminar la solución "${solution.title}"?`,
            () => this.confirmDeleteSolution(id)
        );
    }

    // Confirmar eliminación de solución
    async confirmDeleteSolution(id) {
        this.hideConfirmModal();
        this.showLoading('Eliminando...');
        this.startWashing();
        
        try {
            await this.simulateApiCall(`/api/solutions/${id}`, 600);
            
            this.state.solutions = this.state.solutions.filter(s => s.id !== id);
            this.hideLoading();
            this.renderSolutions();
            this.showAlert('Solución eliminada correctamente.');
            
        } catch (error) {
            this.hideLoading();
            this.showAlert('Error al eliminar la solución. Intenta nuevamente.');
        }
        
        this.stopWashing();
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

    // Iniciar animación de lavado
    startWashing() {
        this.elements.drum.classList.add('spinning');
        this.elements.washingLed.classList.add('active');
    }

    // Detener animación de lavado
    stopWashing() {
        this.elements.drum.classList.remove('spinning');
        this.elements.washingLed.classList.remove('active');
    }

    // Mostrar loading
    showLoading(message = 'Cargando...') {
        this.elements.loadingOverlay.querySelector('.loading-text').textContent = message;
        this.elements.loadingOverlay.classList.remove('hidden');
    }

    // Ocultar loading
    hideLoading() {
        this.elements.loadingOverlay.classList.add('hidden');
    }

    // Actualizar estado de conexión
    updateConnectionStatus(message, isConnected) {
        this.elements.connectionText.textContent = message;
        this.elements.connectionStatus.style.color = isConnected ? 'var(--color-success)' : 'var(--color-error)';
    }

    // Actualizar pantalla LCD
    updateScreen(mainText, subText = '') {
        this.elements.screenText.textContent = mainText;
        this.elements.screenStatus.textContent = subText;
    }

    // Simular llamada a API
    simulateApiCall(endpoint, delay = 1000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular éxito en el 90% de los casos
                if (Math.random() > 0.1) {
                    resolve({ success: true, endpoint });
                } else {
                    reject(new Error('Simulated API error'));
                }
            }, delay);
        });
    }

    // Utilidades
    getDifficultyText(difficulty) {
        const texts = {
            'LOW': 'Baja',
            'MEDIUM': 'Media',
            'HIGH': 'Alta',
            'EXTREME': 'Extrema'
        };
        return texts[difficulty] || difficulty;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showAlert(message) {
        // Usar alert nativo por simplicidad (en producción, usar modal personalizado)
        alert(message);
    }

    // Manejo de errores en campos
    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName) || document.getElementById(`solution-${fieldName}`);
        const errorElement = document.getElementById(`${fieldName}-error`) || document.getElementById(`${fieldName.replace('solution-', '')}-error`);
        
        if (field && errorElement) {
            field.classList.add('error');
            errorElement.textContent = message;
        }
    }

    clearFieldError(fieldName) {
        const field = document.getElementById(fieldName) || document.getElementById(`solution-${fieldName}`);
        const errorElement = document.getElementById(`${fieldName}-error`) || document.getElementById(`${fieldName.replace('solution-', '')}-error`);
        
        if (field && errorElement) {
            field.classList.remove('error');
            errorElement.textContent = '';
        }
    }

    clearAllFieldErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const errorFields = document.querySelectorAll('.form-control.error');
        
        errorElements.forEach(element => element.textContent = '');
        errorFields.forEach(field => field.classList.remove('error'));
    }

    // Actualizar UI según estado
    updateUI() {
        // Esta función se puede expandir para manejar más estados de UI
        if (this.state.authenticated) {
            this.showSolutionsSection();
        }
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.manchApp = new ManchAppLavadora();
});

// Asegurar accesibilidad con focus trap en modales
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        const activeModal = document.querySelector('.modal:not(.hidden)');
        if (activeModal) {
            const focusableElements = activeModal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
});