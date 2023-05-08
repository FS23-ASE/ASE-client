/**
 * Contact Form model
 */
class Contact {
    constructor(data = {}) {
        this.id = null;
        this.sender = null;
        this.accepter = null;
        this.orderId = null;
        this.msg = null;
        Object.assign(this, data);
    }
}
export default Contact;