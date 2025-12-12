// src/actions/LibraryActions.js

import Dispatcher from '../dispatcher/Dispatcher';
import { api } from '../api/api';
import * as ActionTypes from './LibraryActionTypes';

/**
 * Action Creators para o domínio Library.
 * Funções que encapsulam a lógica de negócios e despacham ações para o Store.
 */
export const LibraryActions = {

    // =================================================================
    // UC2: Listar Bibliotecas (Fetch)
    // =================================================================
    loadLibraries: async () => {
        // 1. Notifica o início da operação (para mostrar um Loading Indicator)
        Dispatcher.dispatch({ type: ActionTypes.FETCH_LIBRARIES_START });

        try {
            // 2. Chama a API (assíncrona)
            const librariesDto = await api.getLibraries();

            // 3. Notifica o sucesso, enviando os dados (DTOs) recebidos da API
            Dispatcher.dispatch({
                type: ActionTypes.FETCH_LIBRARIES_SUCCESS,
                payload: librariesDto, // List<LibraryDto>
            });
        } catch (error) {
            // 3. Notifica o erro
            Dispatcher.dispatch({
                type: ActionTypes.FETCH_LIBRARIES_ERROR,
                payload: error.message,
            });
        }
    },

    // =================================================================
    // UC3: Criar Biblioteca (POST)
    // =================================================================
    createLibrary: async (libraryData) => {
        Dispatcher.dispatch({ type: ActionTypes.CREATE_LIBRARY_START });
        try {
            // Chama a API com os dados preenchidos pelo usuário
            const newLibraryDto = await api.createLibrary(libraryData);

            Dispatcher.dispatch({
                type: ActionTypes.CREATE_LIBRARY_SUCCESS,
                payload: newLibraryDto, // New LibraryDto
            });

            // Retorna o objeto (opcional, mas útil para mostrar uma confirmação imediata na UI)
            return newLibraryDto;
        } catch (error) {
            Dispatcher.dispatch({
                type: ActionTypes.CREATE_LIBRARY_ERROR,
                payload: error.message,
            });
            // Re-lança o erro para que a View possa exibir um Toast ou Alert específico (como no Android)
            throw error;
        }
    },

    // =================================================================
    // UC5: Apagar Biblioteca (DELETE)
    // =================================================================
    deleteLibrary: async (libraryId) => {
        Dispatcher.dispatch({ type: ActionTypes.DELETE_LIBRARY_START });
        try {
            // O endpoint de DELETE não retorna corpo, apenas status 202 Accepted.
            await api.deleteLibrary(libraryId);

            // Notifica o sucesso. O Store (reducer) usará o ID para remover o item da lista.
            Dispatcher.dispatch({
                type: ActionTypes.DELETE_LIBRARY_SUCCESS,
                payload: { libraryId },
            });
        } catch (error) {
            Dispatcher.dispatch({
                type: ActionTypes.DELETE_LIBRARY_ERROR,
                payload: error.message,
            });
            throw error;
        }
    },

    // UC4: Editar Biblioteca - Mapeia para RequestsService.updateLibrary()
    updateLibrary: async (libraryId, libraryData) => {
        Dispatcher.dispatch({ type: ActionTypes.UPDATE_LIBRARY_START });
        try {
            // O libraryData é o DTO com os novos campos
            const updatedLibraryDto = await api.updateLibrary(libraryId, libraryData);

            Dispatcher.dispatch({
                type: ActionTypes.UPDATE_LIBRARY_SUCCESS,
                payload: updatedLibraryDto, // Updated LibraryDto
            });

            return updatedLibraryDto;
        } catch (error) {
            Dispatcher.dispatch({
                type: ActionTypes.UPDATE_LIBRARY_ERROR,
                payload: error.message,
            });
            throw error;
        }
    }
};