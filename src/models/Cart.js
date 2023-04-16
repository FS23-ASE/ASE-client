/**
 * Cart model
 */
class Cart {
  constructor(data = {}) {
    this.id = null;
    this.books = null;
    this.quantity = null;
    this.prices = null;
    this.userId = null;
    Object.assign(this, data);
  }
}
export default Cart;