import Dispatcher from '../dispatcher/Dispatcher';
import { ActionTypes } from '../actions/QuoteActions';

class QuoteStore {
    constructor() {
        this._quote = null;
        this._loading = false;
        this._listeners = [];
        Dispatcher.register(this.handleAction.bind(this));
    }

    getQuote() { return this._quote; }
    isLoading() { return this._loading; }

    addChangeListener(callback) { this._listeners.push(callback); }
    removeChangeListener(callback) { this._listeners = this._listeners.filter(l => l !== callback); }
    emitChange() { this._listeners.forEach(callback => callback()); }

    handleAction(action) {
        switch (action.type) {
            case ActionTypes.FETCH_QUOTE_START:
                this._loading = true;
                this.emitChange();
                break;
            case ActionTypes.FETCH_QUOTE_SUCCESS:
                this._quote = action.payload;
                this._loading = false;
                this.emitChange();
                break;
            default: break;
        }
    }
}
export default new QuoteStore();
