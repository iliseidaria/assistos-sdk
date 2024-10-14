const templateAPIS = require('./templates.js');
const booksAPIs = require('./books.js');

module.exports = {
    ...templateAPIS,
    ...booksAPIs
};
