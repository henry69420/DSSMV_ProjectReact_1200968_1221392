
import Dispatcher from '../dispatcher/Dispatcher';
import * as ActionTypes from '../actions/LibraryActionTypes';

class BookStore {
    constructor() {
        this._books = [];
        this._loading = false;
        this._error = null;
        this._listeners = [];
        Dispatcher.register(this.handleAction.bind(this));
    }

    getBooks() { return this._books; }
    isLoading() { return this._loading; }
    getError() { return this._error; }

    emitChange() { this._listeners.forEach(cb => cb()); }
    addChangeListener(cb) { this._listeners.push(cb); }
    removeChangeListener(cb) { this._listeners = this._listeners.filter(l => l !== cb); }

    handleAction(action) {
        switch (action.type) {
            case ActionTypes.SEARCH_BOOKS_START:
                this._loading = true;
                this._error = null;
                this._books = []; // Limpa pesquisa anterior
                this.emitChange();
                break;
            case ActionTypes.SEARCH_BOOKS_SUCCESS:
                this._books = action.payload; // Lista de BookDto
                this._loading = false;
                this.emitChange();
                break;
            case ActionTypes.SEARCH_BOOKS_ERROR:
                this._loading = false;
                this._error = action.payload;
                this.emitChange();
                break;
            default:
                return;
        }
    }
}

export default new BookStore();