/**
 * Order model
 */
class Order {
    constructor(data = {}) {
        this.id = null;
        this.userId = null;
        this.book_list = null;
        this.amount = null;
        this.date = null;
        this.status = null;
        Object.assign(this, data);
    }
}
export default Order;