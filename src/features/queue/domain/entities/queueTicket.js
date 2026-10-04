export class QueueTicket {
  constructor({ id, queueNumber, status, serviceName, staffName, estimatedWaitTime }) {
    this.id = id;
    this.queueNumber = queueNumber;
    this.status = status; // WAITING | CALLED | IN_SERVICE | COMPLETED | CANCELLED | SKIPPED
    this.serviceName = serviceName;
    this.staffName = staffName;
    this.estimatedWaitTime = estimatedWaitTime; // minutes
  }
}
