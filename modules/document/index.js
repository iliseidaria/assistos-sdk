const documentAPIs = require('./document.js');
const chapterAPIs = require('./chapter.js');
const paragraphAPIs = require('./paragraph.js');
module.exports = {
    ...documentAPIs,
    ...chapterAPIs,
    ...paragraphAPIs
};
