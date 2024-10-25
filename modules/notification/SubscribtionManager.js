class SubscriptionNode {
    constructor(value) {
        this.value = value;
        this.children = new Map();
        this.isSubscribed = false;
    }
}

class SubscriptionManager {
    constructor() {
        this.root = new SubscriptionNode(null);
    }

    addSubscription(pathSegments) {
        let node = this.root;
        let needsSubscription = false;

        for (let segment of pathSegments) {
            if (node.children.has('*') && node.children.get('*').isSubscribed) {
                return false;
            }

            if (!node.children.has(segment)) {
                node.children.set(segment, new SubscriptionNode(segment));
                needsSubscription = true;
            }

            node = node.children.get(segment);
        }

        if (node.isSubscribed) {
            return false;
        } else {
            node.isSubscribed = true;
            return needsSubscription;
        }
    }

    isSubscribed(pathSegments) {
        let node = this.root;

        for (let segment of pathSegments) {
            if (node.children.has('**') && node.children.get('**').isSubscribed) {
                return true;
            }

            if (node.children.has('*') && node.children.get('*').isSubscribed) {
                node = node.children.get('*');
            } else if (node.children.has(segment)) {
                node = node.children.get(segment);
            } else {
                return false;
            }

            if (node.isSubscribed) {
                return true;
            }
        }

        // Check if '**' wildcard is subscribed at this node
        if (node.children.has('**') && node.children.get('**').isSubscribed) {
            return true;
        }

        return node.isSubscribed;
    }

    removeSubscription(pathSegments) {
        this._removeSubscriptionRecursive(this.root, pathSegments, 0);
    }

    _removeSubscriptionRecursive(node, pathSegments, index) {
        if (index === pathSegments.length) {
            node.isSubscribed = false;
            return node.children.size === 0;
        }

        const segment = pathSegments[index];
        const childNode = node.children.get(segment) || node.children.get('*') || node.children.get('**');

        if (!childNode) {
            return false;
        }

        const shouldDeleteChild = this._removeSubscriptionRecursive(childNode, pathSegments, index + 1);

        if (shouldDeleteChild) {
            node.children.delete(segment);
        }

        return !node.isSubscribed && node.children.size === 0;
    }
}

module.exports = { SubscriptionManager };
