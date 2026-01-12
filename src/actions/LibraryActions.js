// src/actions/LibraryActions.js

import Dispatcher from '../dispatcher/Dispatcher';
import { api } from '../api/api';
import * as ActionTypes from './LibraryActionTypes';


export const LibraryActions = {

    loadLibraries: async () => {

        Dispatcher.dispatch({ type: ActionTypes.FETCH_LIBRARIES_START });

        try {

            const librariesDto = await api.getLibraries();

            Dispatcher.dispatch({
                type: ActionTypes.FETCH_LIBRARIES_SUCCESS,
                payload: librariesDto, // List<LibraryDto>
            });
        } catch (error) {

            Dispatcher.dispatch({
                type: ActionTypes.FETCH_LIBRARIES_ERROR,
                payload: error.message,
            });
        }
    },


    createLibrary: async (libraryData) => {
        Dispatcher.dispatch({ type: ActionTypes.CREATE_LIBRARY_START });
        try {

            const newLibraryDto = await api.createLibrary(libraryData);

            Dispatcher.dispatch({
                type: ActionTypes.CREATE_LIBRARY_SUCCESS,
                payload: newLibraryDto, // New LibraryDto
            });

            return newLibraryDto;
        } catch (error) {
            Dispatcher.dispatch({
                type: ActionTypes.CREATE_LIBRARY_ERROR,
                payload: error.message,
            });
            throw error;
        }
    },


    deleteLibrary: async (libraryId) => {
        Dispatcher.dispatch({ type: ActionTypes.DELETE_LIBRARY_START });
        try {
            await api.deleteLibrary(libraryId);

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


    updateLibrary: async (libraryId, libraryData) => {
        Dispatcher.dispatch({ type: ActionTypes.UPDATE_LIBRARY_START });
        try {
            const updatedLibraryDto = await api.updateLibrary(libraryId, libraryData);

            Dispatcher.dispatch({
                type: ActionTypes.UPDATE_LIBRARY_SUCCESS,
                payload: updatedLibraryDto,
            });

            return updatedLibraryDto;
        } catch (error) {
            Dispatcher.dispatch({
                type: ActionTypes.UPDATE_LIBRARY_ERROR,
                payload: error.message,
            });
            throw error;
        }
    },

    searchBooks: async (query) => {
        // Notifica o início da pesquisa para o BookStore
        Dispatcher.dispatch({ type: ActionTypes.SEARCH_BOOKS_START });
        try {
            const booksDto = await api.searchBooks(query);

            Dispatcher.dispatch({
                type: ActionTypes.SEARCH_BOOKS_SUCCESS,
                payload: booksDto,
            });
        } catch (error) {
            Dispatcher.dispatch({
                type: ActionTypes.SEARCH_BOOKS_ERROR,
                payload: error.message,
            });
            throw error;
        }
    },

    getCheckedOutBooks: async (userId) => {
        Dispatcher.dispatch({ type: ActionTypes.FETCH_CHECKOUTS_START });
        try {
            const checkoutsDto = await api.getCheckedOutBooks(userId);

            Dispatcher.dispatch({
                type: ActionTypes.FETCH_CHECKOUTS_SUCCESS,
                payload: checkoutsDto,
            });
        } catch (error) {
            Dispatcher.dispatch({
                type: ActionTypes.FETCH_CHECKOUTS_ERROR,
                payload: error.message,
            });
            throw error;
        }
    },

    resetSearch: () => {
        Dispatcher.dispatch({
            type: 'RESET_CHECKOUT_SEARCH'
        });
    },

    checkInBook: async (libraryId, isbn, userId) => {
        try {
            await api.checkInBook(libraryId, isbn, userId);
            Dispatcher.dispatch({
                type: ActionTypes.CHECKIN_BOOK_SUCCESS,
                payload: { libraryId, isbn, userId },
            });
        } catch (error) {
            throw error;
        }
    },

    extendCheckout: async (checkoutId) => {
        try {
            await api.extendCheckout(checkoutId);
            Dispatcher.dispatch({
                type: ActionTypes.EXTEND_CHECKOUT_SUCCESS,
                payload: { checkoutId },
            });
        } catch (error) {
            throw error;
        }
    }

};
