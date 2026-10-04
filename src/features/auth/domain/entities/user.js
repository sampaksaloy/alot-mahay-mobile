// Plain entity, walay dependency sa framework/API shape.
export class User {
  constructor({ id, name, email, phone, role, status }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.role = role; // CUSTOMER | STAFF | ADMIN
    this.status = status;
  }
}
