// Shape sa user object nga gikan sa API (raw JSON -> plain object para sa app)
export function userModelFromJson(json) {
  return {
    id: json.id,
    name: json.name,
    email: json.email,
    phone: json.phone,
    role: json.role,
    status: json.status,
  };
}
