const { SubscriptionManager } = require('./SubscribtionManager.js');

class NotificationRouter {

    constructor(debounceRefreshTimeout) {
        if(NotificationRouter.instance){
           return NotificationRouter.instance;
        }
        this._debounceRefreshTimeout = debounceRefreshTimeout;
        this._refreshTimer = null;
        this._objectsToRefresh = {};
        this._connections = new Map();
        this.subscriptionManager = new SubscriptionManager();
        NotificationRouter.instance = this;
    }

    async _handleContentEvent(event, connectionId) {
        const parsedMessage = JSON.parse(event.data);
        const objectPath = parsedMessage.objectId;

        for (const [subscribedPath, callbacks] of Object.entries(this._objectsToRefresh)) {
            if (this._matchesSubscription(objectPath, subscribedPath)) {
                callbacks.forEach(callback => callback(parsedMessage.data, parsedMessage.type, connectionId));
            }
        }

        this.debounceRefresh();
    }

    async _handleDisconnectEvent(event, connectionId) {
        const disconnectReason = JSON.parse(event.data);
        clearTimeout(this._refreshTimer);
        const connectionInfo = this._connections.get(connectionId);
        if (connectionInfo) {
            connectionInfo.eventSource.close();
            if (connectionInfo.sseConfig.onDisconnect) {
                await connectionInfo.sseConfig.onDisconnect(disconnectReason);
            }
            this._connections.delete(connectionId);
        }
    }

    async _handleErrorEvent(err, connectionId) {
        clearTimeout(this._refreshTimer);
        const connectionInfo = this._connections.get(connectionId);
        if (connectionInfo) {
            connectionInfo.eventSource.close();
            if (connectionInfo.sseConfig.onError) {
                await connectionInfo.sseConfig.onError(err);
            }
            this._connections.delete(connectionId);
        }
    }

    _refresh() {
        for (const [objectId, callbacks] of Object.entries(this._objectsToRefresh)) {
            callbacks.forEach(callback => {
                callback(objectId);
            });
        }

        this._objectsToRefresh = {};
    }

    registerConnection(url, sseConfig = {}) {
        const connectionId = Symbol();

        const eventSource = new EventSource(url, { withCredentials: true });
        eventSource.addEventListener('content', (event) => this._handleContentEvent(event, connectionId));
        eventSource.addEventListener('disconnect', (event) => this._handleDisconnectEvent(event, connectionId));
        eventSource.onerror = (err) => this._handleErrorEvent(err, connectionId);

        this._connections.set(connectionId, { eventSource, sseConfig });
        return connectionId;
    }

    closeConnection(connectionId) {
        const connectionInfo = this._connections.get(connectionId);
        if (connectionInfo) {
            clearTimeout(this._refreshTimer);
            connectionInfo.eventSource.close();
            this._connections.delete(connectionId);
        }
    }

    debounceRefresh() {
        if (this._refreshTimer) {
            clearTimeout(this._refreshTimer);
        }

        this._refreshTimer = setTimeout(() => {
            this._refresh();
        }, this._debounceRefreshTimeout);
    }

    async subscribeToObject(path, callback) {
        const pathSegments = path.split('/');

        if (this.subscriptionManager.isSubscribed(pathSegments)) {
            if (!this._objectsToRefresh[path]) {
                this._objectsToRefresh[path] = [];
            }
            this._objectsToRefresh[path].push(callback);
            return;
        }

        const needsSubscription = this.subscriptionManager.addSubscription(pathSegments);

        if (needsSubscription) {
            await fetch('/events/subscribe', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ path })
            });
        }

        if (!this._objectsToRefresh[path]) {
            this._objectsToRefresh[path] = [];
        }
        this._objectsToRefresh[path].push(callback);
    }

    async unsubscribeFromObject(path, callback) {
        const pathSegments = path.split('/');

        if (this._objectsToRefresh[path]) {
            this._objectsToRefresh[path] = this._objectsToRefresh[path].filter(cb => cb !== callback);
            if (this._objectsToRefresh[path].length === 0) {
                delete this._objectsToRefresh[path];

                this.subscriptionManager.removeSubscription(pathSegments);

                await fetch('/events/unsubscribe', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ path })
                });
            }
        }
    }

    _matchesSubscription(objectPath, subscribedPath) {
        const objectParts = objectPath.split('/');
        const subscribedParts = subscribedPath.split('/');

        let i = 0;
        let j = 0;

        while (i < objectParts.length && j < subscribedParts.length) {
            if (subscribedParts[j] === '**') {
                return true;
            } else if (subscribedParts[j] === '*') {
                i++;
                j++;
            } else {
                if (objectParts[i].toLowerCase() !== subscribedParts[j].toLowerCase()) {
                    return false;
                }
                i++;
                j++;
            }
        }

        if (j < subscribedParts.length && subscribedParts[j] === '**') {
            return true;
        }

        return i === objectParts.length && j === subscribedParts.length;
    }
}

module.exports = {
    NotificationRouter:NotificationRouter
};
