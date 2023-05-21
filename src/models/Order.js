/**
 * Order model
 */
class Order {
    constructor(data = {}) {
        this.id = null;
        this.buyerId = null;
        this.sellerId = null;
        this.books = null;
        this.amount = null;
        this.date = null;
        this.status = null;
        Object.assign(this, data);
    }
}
export default Order;