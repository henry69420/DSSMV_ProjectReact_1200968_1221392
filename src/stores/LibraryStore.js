// src/stores/LibraryStore.js

import Dispatcher from '../dispatcher/Dispatcher';
import * as ActionTypes from '../actions/LibraryActionTypes';

// =================================================================
// HELPERS (Mapeamento DTO -> Model)
// Simula a função do Mapper.java
// =================================================================

/**
 * Converte um objeto LibraryDto (vindo da API) em um objeto Library Model (interno ao front-end).
 * A estrutura baseia-se nos campos de LibraryDto.java e Library.java.
 */
const mapDtoToModel = (dto) => ({
    id: dto.id,
    name: dto.name,
    address: dto.address,
    open: dto.open,
    openDays: dto.openDays,
    openTime: dto.openTime,
    closeTime: dto.closeTime,
    openStatement: dto.openStatement,
});


// =================================================================
// LIBRARY STORE (O Store Singleton)
// =================================================================

class LibraryStore {
    constructor() {
        // 1. O Estado do Store (Única Fonte de Verdade para o domínio Library)
        this._libraries = [];
        this._loading = false;
        this._error = null;
        this._listeners = []; // Listeners (Callbacks das Views)

        // 2. Registra a função handleAction no Dispatcher
        Dispatcher.register(this.handleAction.bind(this));
    }

    // -------------------------------------------------------------
    // GETTERS (Acesso ao Estado)
    // -------------------------------------------------------------
    getLibraries() {
        return this._libraries;
    }

    isLoading() {
        return this._loading;
    }

    getError() {
        return this._error;
    }

    // -------------------------------------------------------------
    // LISTENER PATTERN (Binding com as Views)
    // -------------------------------------------------------------
    emitChange() {
        this._listeners.forEach(callback => callback());
    }

    addChangeListener(callback) {
        this._listeners.push(callback);
    }

    removeChangeListener(callback) {
        this._listeners = this._listeners.filter(l => l !== callback);
    }

    // -------------------------------------------------------------
    // REDUCER LOGIC (handleAction)
    // É o único local onde o estado interno pode ser alterado.
    // -------------------------------------------------------------
    handleAction(action) {
        switch (action.type) {

            // === ESTADO INICIAL / LOADING (UC2, UC3, UC4, UC5) ===
            case ActionTypes.FETCH_LIBRARIES_START:
            case ActionTypes.CREATE_LIBRARY_START:
            case ActionTypes.UPDATE_LIBRARY_START:
            case ActionTypes.DELETE_LIBRARY_START:
                this._loading = true;
                this._error = null;
                this.emitChange();
                break;

            // === UC2: Listar Bibliotecas (SUCCESS) ===
            case ActionTypes.FETCH_LIBRARIES_SUCCESS:
                // Mapeia DTOs para Models e atualiza o estado de forma IMUTÁVEL
                this._libraries = action.payload.map(mapDtoToModel);
                this._loading = false;
                this.emitChange();
                break;

            // === UC3: Criar Biblioteca (SUCCESS) ===
            case ActionTypes.CREATE_LIBRARY_SUCCESS:
                const newLibraryModel = mapDtoToModel(action.payload);
                // Adiciona o novo item ao array de forma IMUTÁVEL
                this._libraries = [...this._libraries, newLibraryModel];
                this._loading = false;
                this.emitChange();
                break;

            // === UC4: Editar Biblioteca (SUCCESS) ===
            case ActionTypes.UPDATE_LIBRARY_SUCCESS:
                const updatedLibraryModel = mapDtoToModel(action.payload);
                this._libraries = this._libraries.map(library =>
                    library.id === updatedLibraryModel.id ? updatedLibraryModel : library
                );
                this._loading = false;
                this.emitChange();
                break;

            // === UC5: Apagar Biblioteca (SUCCESS) ===
            case ActionTypes.DELETE_LIBRARY_SUCCESS:
                const deletedId = action.payload.libraryId;
                // Remove o item do array usando filter (operação IMUTÁVEL)
                this._libraries = this._libraries.filter(library => library.id !== deletedId);
                this._loading = false;
                this.emitChange();
                break;

            // === ERRO ===
            case ActionTypes.FETCH_LIBRARIES_ERROR:
            case ActionTypes.CREATE_LIBRARY_ERROR:
            case ActionTypes.UPDATE_LIBRARY_ERROR:
            case ActionTypes.DELETE_LIBRARY_ERROR:
                this._loading = false;
                this._error = action.payload;
                this.emitChange();
                break;

            // Ignorar outras actions (e.g., SEARCH_BOOKS, CHECKOUTS)
            default:
                return;
        }
    }
}

// Exporta uma instância única (Singleton)
export default new LibraryStore();