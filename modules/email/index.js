const service = require('./api');
const fsPromises = require('fs').promises;
const path = require('path');
const data = (async () => {
    return {
        templates: {
            activationFailTemplate: require(path.join(__dirname, 'data/templates/html/activationFailTemplate.html'), 'utf8'),
            activationSuccessTemplate: require(path.join(__dirname, '/data/templates/html/activationSuccessTemplate.html'), 'utf8'),
            activationEmailTemplate: require(path.join(__dirname, 'data/templates/html/activationEmailTemplate.html'), 'utf8'),
        }
    };
})();

module.exports = {
    service,
    data
};
