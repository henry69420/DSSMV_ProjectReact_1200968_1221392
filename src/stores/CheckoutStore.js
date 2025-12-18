import Dispatcher from '../dispatcher/Dispatcher';
import * as ActionTypes from '../actions/LibraryActionTypes';

class CheckoutStore {
    constructor() {
        this._checkouts = [];
        this._loading = false;
        this._hasSearched = false;
        this._recentSearches = [];
        this._listeners = [];
    }

    getCheckouts() { return this._checkouts; }
    isLoading() { return this._loading; }
    hasSearched() { return this._hasSearched; }
    getRecentSearches() { return this._recentSearches; }


    emitChange() { this._listeners.forEach(cb => cb()); }
    addChangeListener(cb) { this._listeners.push(cb); }
    removeChangeListener(cb) { this._listeners = this._listeners.filter(l => l !== cb); }

    handleAction(action) {
        switch (action.type) {
            case ActionTypes.FETCH_CHECKOUTS_START:
                this._loading = true;
                this.emitChange();
                break;
            case ActionTypes.FETCH_CHECKOUTS_SUCCESS:

                this._checkouts = action.payload || [];
                this._loading = false;
                this._hasSearched = true;
                this.emitChange();
                break;
            case ActionTypes.CHECKIN_BOOK_SUCCESS:
                this._checkouts = this._checkouts.filter(c => c.isbn !== action.payload.isbn);
                this.emitChange();
                break;
            case 'RESET_CHECKOUT_SEARCH':
                this._hasSearched = false;
                this._checkouts = [];
                this.emitChange();
                break;
            default:
                return;
        }
    }
}

const checkoutStore = new CheckoutStore();
Dispatcher.register(checkoutStore.handleAction.bind(checkoutStore));
export default checkoutStore;