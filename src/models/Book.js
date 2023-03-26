/**
 * Book model
 */
class Book {
    constructor(data = {}) {
        this.id = null;
        this.name = null;
        this.author = null;
        this.publisher = null;
        this.description = null;
        this.sellerid = null;
        this.status = null;
        this.buyerid = null;
        this.image = null;
        Object.assign(this, data);
    }
}
export default Book;