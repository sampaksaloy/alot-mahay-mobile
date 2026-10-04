export function serviceModelFromJson(json) {
  return {
    id: json.id,
    name: json.name,
    category: json.category,
    description: json.description,
    price: json.price,
    estimatedDuration: json.estimated_duration,
    status: json.status,
  };
}
