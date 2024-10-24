class NotificationRouter {
    #debounceRefreshTimeout;
    #refreshTimer;
    #objectsToRefresh;
    #eventSource;

    constructor(debounceRefreshTimeout, sseConfig) {
        this.#debounceRefreshTimeout = debounceRefreshTimeout;
        this.#refreshTimer = null;
        this.#objectsToRefresh = {};
        this.sseConfig = sseConfig;
    }

    async #handleContentEvent(event) {
        const parsedMessage = JSON.parse(event.data);
        this.#objectsToRefresh.push({
            objectId: parsedMessage.objectId,
            data: parsedMessage.data,
        });
        this.debounceRefresh();
    }

    async #handleDisconnectEvent(event) {
        const disconnectReason = JSON.parse(event.data);
        clearTimeout(this.#refreshTimer);
        this.#eventSource.close();
        await this.sseConfig.onDisconnect(disconnectReason);
    }

    async #handleErrorEvent(err) {
        clearTimeout(this.#refreshTimer);
        this.#eventSource.close();
        await this.sseConfig.onError(err);
    }

    registerConnection() {
        this.#eventSource = new EventSource(this.sseConfig.url, {withCredentials: true});
        this.#eventSource.addEventListener('content', this.#handleContentEvent.bind(this));
        this.#eventSource.addEventListener('disconnect', this.#handleDisconnectEvent.bind(this));
        this.#eventSource.onerror = this.#handleErrorEvent.bind(this);
        return this.#eventSource;
    }

    closeConnection() {
        clearTimeout(this.#refreshTimer);
        this.#eventSource.close();
    }

    debounceRefresh() {
        if (this.#refreshTimer) {
            clearTimeout(this.#refreshTimer);
        }

        this.#refreshTimer = setTimeout(() => {
            this.refresh();
            this.#objectsToRefresh = [];
        }, this.#debounceRefreshTimeout);
    }

    addObjectToRefresh(object) {
        this.#objectsToRefresh.push(object);
        this.debounceRefresh();
    }

    subscribeToEvent(objectId, event, callback) {
        if(!this.#objectsToRefresh[objectId]){
            this.#objectsToRefresh[objectId] = {};
        }
        if(!this.#objectsToRefresh[objectId][event]){
            this.#objectsToRefresh[objectId][event] = [];
        }
        this.#objectsToRefresh[objectId][event].push(callback);
    }
   unsubscribeFromEvent(objectId, event) {

       // Optionally, clean up the objectId if no events are left
       if (Object.keys(this.#objectsToRefresh[objectId]).length === 0) {
           delete this.#objectsToRefresh[objectId];
       }
   }
}

module.exports = NotificationRouter;
