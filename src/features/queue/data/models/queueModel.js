export function queueModelFromJson(json) {
  return {
    id: json.id,
    queueNumber: json.queue_number,
    status: json.status,
    serviceId: json.service_id,
    serviceName: json.service_name,
    staffId: json.staff_id,
    staffName: json.staff_name,
    estimatedWaitTime: json.estimated_wait_time,
    joinedAt: json.joined_at,
    calledAt: json.called_at,
    startedAt: json.started_at,
    completedAt: json.completed_at,
  };
}
