export function staffModelFromJson(json) {
  return {
    id: json.id,
    userId: json.user_id,
    name: json.name,
    staffType: json.staff_type,
    specialization: json.specialization,
    status: json.status,
  };
}
