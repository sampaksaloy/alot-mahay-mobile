export class Service {
  constructor({ id, name, category, description, price, estimatedDuration, status }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.description = description;
    this.price = price;
    this.estimatedDuration = estimatedDuration; // minutes
    this.status = status;
  }
}
