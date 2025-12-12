

/**
 * O Hub Central do Flux. A única maneira de enviar Actions para os Stores.
 * Implementado como um Singleton.
 */
class Dispatcher {
    constructor() {
        this._callbacks = [];
    }

    /**
     * Registra a função de callback (handleAction) de um Store.
     * @param {function} callback - A função que será chamada com a Action.
     */
    register(callback) {
        this._callbacks.push(callback);
    }

    /**
     * Envia uma Action para todos os Stores registrados.
     * @param {object} action - O objeto Action (deve ter a propriedade 'type').
     */
    dispatch(action) {
        console.log('[Dispatcher] Action Dispatched:', action.type);

        // Dispara a action para todos os Stores
        this._callbacks.forEach(callback => {
            callback(action);
        });
    }
}

// Exporta uma instância única
export default new Dispatcher();