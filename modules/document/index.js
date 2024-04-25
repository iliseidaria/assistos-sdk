
const documentAPIs = require('./document.js');
const chapterAPIs = require('./chapter.js');
const paragraphAPIs = require('./chapter.js');
module.exports = {
    ...documentAPIs,
    ...chapterAPIs,
    ...paragraphAPIs
};
