/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.password = null;
    this.username = null;
    this.token = null;
    this.status = null;
    this.email = null;
    this.address = null;
    Object.assign(this, data);
  }
}
export default User;
