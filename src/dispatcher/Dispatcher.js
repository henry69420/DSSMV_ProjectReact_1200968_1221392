
class Dispatcher {
    constructor() {
        this._callbacks = [];
    }

    register(callback) {
        this._callbacks.push(callback);
    }

    dispatch(action) {
        console.log('[Dispatcher] Action Dispatched:', action.type);

        this._callbacks.forEach(callback => {
            callback(action);
        });
    }
}
export default new Dispatcher();
