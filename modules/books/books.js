const request = require("../util").request;

async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}
async function getBooks(spaceId){
    return await this.sendRequest(`/books-generator/books/${spaceId}`, "GET");
}
async function getBook(spaceId, bookId){
    return await this.sendRequest(`/books-generator/books/${spaceId}/${bookId}`, "GET");
}
async function addBook(spaceId, data){
    return await this.sendRequest(`/books-generator/books/${spaceId}`, "POST", data);
}
async function updateBook(spaceId, bookId, data){
    return await this.sendRequest(`/books-generator/books/${spaceId}/${bookId}`, "PUT", data);
}
async function deleteBook(spaceId, bookId){
    return await this.sendRequest(`/books-generator/books/${spaceId}/${bookId}`, "DELETE");
}
async function generateBook(spaceId, templateId){
    return await this.sendRequest(`/books-generator/books/generate/${spaceId}/${templateId}`, "POST");
}
module.exports={
    sendRequest,
    getBooks,
    getBook,
    addBook,
    updateBook,
    deleteBook,
    generateBook
}
