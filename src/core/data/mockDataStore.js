/**
 * Centralized Mock Data Store
 * ===========================
 * Single source of truth for all mock/demo data in the app.
 * All feature-specific mock datasources read/write from this store.
 * This makes cross-feature data consistency trivial.
 *
 * When a real FastAPI backend is available, replace the mock datasources
 * with real API calls — the screens and use cases remain unchanged.
 */

const QUEUE_STATUS = {
  WAITING: 'WAITING',
  CALLED: 'CALLED',
  IN_SERVICE: 'IN_SERVICE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  SKIPPED: 'SKIPPED',
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
let _nextId = 100;
function nextId() {
  return String(++_nextId);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function minutesAgo(m) {
  return new Date(Date.now() - m * 60000).toISOString();
}

// ─── USERS (1 demo account per role) ──────────────────────────────────────────
const users = [
  {
    id: '1',
    name: 'Juan Dela Cruz',
    email: 'customer@test.com',
    phone: '09171234567',
    password: '123456',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: '10',
    name: 'Carlos Barbero',
    email: 'staff@test.com',
    phone: '09271111111',
    password: '123456',
    role: 'STAFF',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: '20',
    name: 'Admin Owner',
    email: 'admin@test.com',
    phone: '09371234567',
    password: '123456',
    role: 'ADMIN',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
  },
];

// ─── STAFF records (1 staff member) ───────────────────────────────────────────
const staff = [
  {
    id: 's1',
    userId: '10',
    name: 'Carlos Barbero',
    staffType: 'Barber',
    specialization: 'Haircut & Styling',
    status: 'AVAILABLE',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  },
];

// ─── SERVICES (1 demo service) ────────────────────────────────────────────────
const services = [
  {
    id: 'svc1',
    name: 'Classic Haircut',
    category: 'Haircut',
    description: 'Traditional barber haircut with clippers, hot towel, and scissors.',
    price: 150,
    estimated_duration: 20,
    status: 'ACTIVE',
  },
];

// ─── QUEUE TICKETS (1 waiting, 1 completed) ───────────────────────────────────
let _queueCounter = 2;

const queueTickets = [
  {
    id: 'q1',
    queue_number: 'Q-001',
    status: QUEUE_STATUS.WAITING,
    customer_id: '1',
    customer_name: 'Juan Dela Cruz',
    service_id: 'svc1',
    service_name: 'Classic Haircut',
    service_duration: 20,
    staff_id: 's1',
    staff_name: 'Carlos Barbero',
    estimated_wait_time: 20,
    joined_at: minutesAgo(10),
    called_at: null,
    started_at: null,
    completed_at: null,
    date: todayStr(),
  },
  {
    id: 'q2',
    queue_number: 'Q-002',
    status: QUEUE_STATUS.COMPLETED,
    customer_id: '1',
    customer_name: 'Juan Dela Cruz',
    service_id: 'svc1',
    service_name: 'Classic Haircut',
    service_duration: 20,
    staff_id: 's1',
    staff_name: 'Carlos Barbero',
    estimated_wait_time: 0,
    joined_at: minutesAgo(120),
    called_at: minutesAgo(115),
    started_at: minutesAgo(110),
    completed_at: minutesAgo(90),
    date: todayStr(),
  },
];

// ─── RATINGS (1 demo rating) ──────────────────────────────────────────────────
const ratings = [
  {
    id: 'r1',
    queue_id: 'q2',
    customer_id: '1',
    customer_name: 'Juan Dela Cruz',
    service_name: 'Classic Haircut',
    staff_name: 'Carlos Barbero',
    rating: 5,
    feedback: 'Excellent service and friendly barber! Highly recommended.',
    created_at: minutesAgo(85),
  },
];

// ─── NOTIFICATIONS (1 per role) ───────────────────────────────────────────────
const notifications = [
  // Customer notification
  {
    id: 'n1',
    user_id: '1',
    title: 'Queue Joined',
    message: 'You have joined the queue. Your ticket number is Q-001 with Carlos Barbero.',
    read: false,
    created_at: minutesAgo(10),
  },
  // Staff notification
  {
    id: 'n2',
    user_id: '10', // Carlos Barbero
    title: 'Customer Waiting',
    message: 'Juan Dela Cruz (Q-001) is waiting in your queue for Classic Haircut.',
    read: false,
    created_at: minutesAgo(10),
  },
  // Admin notification
  {
    id: 'n3',
    user_id: '20', // Admin Owner
    title: 'Live Queue Alert',
    message: 'Juan Dela Cruz took ticket Q-001 for Classic Haircut with Carlos Barbero.',
    read: false,
    created_at: minutesAgo(10),
  },
];

// ─── SCHEDULES (1 demo schedule) ──────────────────────────────────────────────
const schedules = [
  {
    id: 'sch1',
    staff_id: 's1',
    staff_name: 'Carlos Barbero',
    date: todayStr(),
    start_time: '08:00',
    end_time: '17:00',
    available: true,
  },
];

// ─── Waiting Time Prediction ───────────────────────────────────────────────────
/**
 * Calculates estimated waiting time for a given queue ticket.
 * Uses a deterministic approach: sum of estimated durations of all
 * WAITING/CALLED tickets ahead in the same staff's queue.
 * For IN_SERVICE tickets, subtracts already elapsed time.
 */
function calculateWaitingTime(ticketId) {
  const ticket = queueTickets.find((t) => t.id === ticketId);
  if (!ticket) return 0;

  // If already completed/cancelled/skipped, no waiting
  if ([QUEUE_STATUS.COMPLETED, QUEUE_STATUS.CANCELLED, QUEUE_STATUS.SKIPPED].includes(ticket.status)) {
    return 0;
  }

  // If in service, estimate remaining time
  if (ticket.status === QUEUE_STATUS.IN_SERVICE) {
    if (ticket.started_at) {
      const elapsed = (Date.now() - new Date(ticket.started_at).getTime()) / 60000;
      return Math.max(0, Math.round(ticket.service_duration - elapsed));
    }
    return ticket.service_duration;
  }

  // Find tickets ahead in the same staff's queue
  const staffQueue = queueTickets.filter(
    (t) =>
      t.staff_id === ticket.staff_id &&
      t.date === ticket.date &&
      ![QUEUE_STATUS.COMPLETED, QUEUE_STATUS.CANCELLED, QUEUE_STATUS.SKIPPED].includes(t.status) &&
      new Date(t.joined_at) < new Date(ticket.joined_at)
  );

  let totalWait = 0;
  for (const ahead of staffQueue) {
    if (ahead.status === QUEUE_STATUS.IN_SERVICE && ahead.started_at) {
      const elapsed = (Date.now() - new Date(ahead.started_at).getTime()) / 60000;
      totalWait += Math.max(0, ahead.service_duration - elapsed);
    } else {
      totalWait += ahead.service_duration;
    }
  }

  return Math.round(totalWait);
}

/**
 * Calculate queue position (1-based) for a ticket
 */
function calculatePosition(ticketId) {
  const ticket = queueTickets.find((t) => t.id === ticketId);
  if (!ticket) return 0;

  if ([QUEUE_STATUS.COMPLETED, QUEUE_STATUS.CANCELLED, QUEUE_STATUS.SKIPPED].includes(ticket.status)) {
    return 0;
  }

  if (ticket.status === QUEUE_STATUS.IN_SERVICE) return 1;
  if (ticket.status === QUEUE_STATUS.CALLED) return 1;

  const ahead = queueTickets.filter(
    (t) =>
      t.staff_id === ticket.staff_id &&
      t.date === ticket.date &&
      ![QUEUE_STATUS.COMPLETED, QUEUE_STATUS.CANCELLED, QUEUE_STATUS.SKIPPED].includes(t.status) &&
      new Date(t.joined_at) < new Date(ticket.joined_at)
  );

  return ahead.length + 1;
}

// ─── Exported Store ────────────────────────────────────────────────────────────
export const mockDataStore = {
  // --- Users ---
  getUsers: () => [...users],
  getUserById: (id) => users.find((u) => u.id === id) || null,
  getUserByEmail: (email) =>
    users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null,
  addUser: (userData) => {
    const user = { ...userData, id: nextId(), status: 'ACTIVE' };
    users.push(user);
    return user;
  },
  updateUser: (id, data) => {
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...data };
    return users[idx];
  },
  getCustomers: () => users.filter((u) => u.role === 'CUSTOMER'),

  // --- Staff ---
  getStaff: () => [...staff],
  getStaffById: (id) => staff.find((s) => s.id === id) || null,
  getStaffByUserId: (userId) => staff.find((s) => s.userId === userId) || null,
  addStaff: (data) => {
    const s = { ...data, id: nextId() };
    staff.push(s);
    return s;
  },
  updateStaff: (id, data) => {
    const idx = staff.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    staff[idx] = { ...staff[idx], ...data };
    return staff[idx];
  },
  removeStaff: (id) => {
    const idx = staff.findIndex((s) => s.id === id);
    if (idx !== -1) staff.splice(idx, 1);
  },

  // --- Services ---
  getServices: () => services.filter((s) => s.status === 'ACTIVE'),
  getAllServices: () => [...services],
  getServiceById: (id) => services.find((s) => s.id === id) || null,
  addService: (data) => {
    const s = { ...data, id: nextId(), status: 'ACTIVE' };
    services.push(s);
    return s;
  },
  updateService: (id, data) => {
    const idx = services.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    services[idx] = { ...services[idx], ...data };
    return services[idx];
  },
  removeService: (id) => {
    const idx = services.findIndex((s) => s.id === id);
    if (idx !== -1) services[idx].status = 'INACTIVE';
  },

  // --- Queue ---
  getQueueTickets: () => [...queueTickets],
  getTodayQueue: () => queueTickets.filter((t) => t.date === todayStr()),
  getQueueByCustomerId: (customerId) =>
    queueTickets.filter((t) => t.customer_id === customerId),
  getQueueByStaffId: (staffId) =>
    queueTickets.filter((t) => t.staff_id === staffId && t.date === todayStr()),
  getQueueById: (id) => queueTickets.find((t) => t.id === id) || null,

  joinQueue: ({ customerId, customerName, serviceId, staffId }) => {
    const service = services.find((s) => s.id === serviceId);
    const staffMember = staff.find((s) => s.id === staffId);
    if (!service) throw new Error('Service not found');

    // Check for existing active ticket
    const existing = queueTickets.find(
      (t) =>
        t.customer_id === customerId &&
        t.date === todayStr() &&
        ![QUEUE_STATUS.COMPLETED, QUEUE_STATUS.CANCELLED, QUEUE_STATUS.SKIPPED].includes(t.status)
    );
    if (existing) throw new Error('You already have an active queue ticket');

    _queueCounter++;
    const ticket = {
      id: nextId(),
      queue_number: `Q-${String(_queueCounter).padStart(3, '0')}`,
      status: QUEUE_STATUS.WAITING,
      customer_id: customerId,
      customer_name: customerName,
      service_id: serviceId,
      service_name: service.name,
      service_duration: service.estimated_duration,
      staff_id: staffId,
      staff_name: staffMember?.name || 'Any Available',
      estimated_wait_time: 0,
      joined_at: new Date().toISOString(),
      called_at: null,
      started_at: null,
      completed_at: null,
      date: todayStr(),
    };
    queueTickets.push(ticket);
    // Calculate wait time after adding
    ticket.estimated_wait_time = calculateWaitingTime(ticket.id);

    // Add notification for customer
    notifications.push({
      id: nextId(),
      user_id: customerId,
      title: 'Queue Joined',
      message: `You've been added to the queue. Your number is ${ticket.queue_number}.`,
      read: false,
      created_at: new Date().toISOString(),
    });

    // Notify assigned staff
    if (staffMember && staffMember.userId) {
      notifications.push({
        id: nextId(),
        user_id: staffMember.userId,
        title: 'New Customer in Queue',
        message: `${customerName} joined queue for ${service.name} (${ticket.queue_number}).`,
        read: false,
        created_at: new Date().toISOString(),
      });
    }

    // Notify admin
    notifications.push({
      id: nextId(),
      user_id: '20', // Admin
      title: 'New Customer Booking',
      message: `${customerName} joined queue (${ticket.queue_number}) for ${ticket.service_name} with ${ticket.staff_name}.`,
      read: false,
      created_at: new Date().toISOString(),
    });

    return ticket;
  },

  updateQueueStatus: (id, newStatus) => {
    const ticket = queueTickets.find((t) => t.id === id);
    if (!ticket) throw new Error('Ticket not found');

    const now = new Date().toISOString();

    // Validate transitions
    const validTransitions = {
      [QUEUE_STATUS.WAITING]: [QUEUE_STATUS.CALLED, QUEUE_STATUS.CANCELLED, QUEUE_STATUS.SKIPPED],
      [QUEUE_STATUS.CALLED]: [QUEUE_STATUS.IN_SERVICE, QUEUE_STATUS.SKIPPED, QUEUE_STATUS.CANCELLED],
      [QUEUE_STATUS.IN_SERVICE]: [QUEUE_STATUS.COMPLETED],
      [QUEUE_STATUS.COMPLETED]: [],
      [QUEUE_STATUS.CANCELLED]: [],
      [QUEUE_STATUS.SKIPPED]: [],
    };

    const allowed = validTransitions[ticket.status] || [];
    if (!allowed.includes(newStatus)) {
      throw new Error(`Cannot transition from ${ticket.status} to ${newStatus}`);
    }

    ticket.status = newStatus;

    if (newStatus === QUEUE_STATUS.CALLED) ticket.called_at = now;
    if (newStatus === QUEUE_STATUS.IN_SERVICE) ticket.started_at = now;
    if (newStatus === QUEUE_STATUS.COMPLETED) ticket.completed_at = now;

    // Add notification for customer
    const messages = {
      [QUEUE_STATUS.CALLED]: `It's your turn! Please proceed to ${ticket.staff_name}.`,
      [QUEUE_STATUS.IN_SERVICE]: `Your ${ticket.service_name} service has started.`,
      [QUEUE_STATUS.COMPLETED]: `Your ${ticket.service_name} service is complete. Please rate your experience!`,
      [QUEUE_STATUS.SKIPPED]: `Your queue ticket ${ticket.queue_number} has been skipped.`,
      [QUEUE_STATUS.CANCELLED]: `Your queue ticket ${ticket.queue_number} has been cancelled.`,
    };

    notifications.push({
      id: nextId(),
      user_id: ticket.customer_id,
      title: newStatus.replace('_', ' '),
      message: messages[newStatus] || `Your queue status is now ${newStatus}.`,
      read: false,
      created_at: now,
    });

    // Notify admin about queue status changes
    notifications.push({
      id: nextId(),
      user_id: '20',
      title: `Queue Ticket ${newStatus.replace('_', ' ')}`,
      message: `${ticket.customer_name}'s ticket ${ticket.queue_number} is now ${newStatus.replace('_', ' ')} (${ticket.staff_name}).`,
      read: false,
      created_at: now,
    });

    return ticket;
  },

  cancelQueue: (id) => {
    const ticket = queueTickets.find((t) => t.id === id);
    if (!ticket) throw new Error('Ticket not found');
    if ([QUEUE_STATUS.COMPLETED, QUEUE_STATUS.CANCELLED].includes(ticket.status)) {
      throw new Error('Cannot cancel this ticket');
    }
    ticket.status = QUEUE_STATUS.CANCELLED;
    return ticket;
  },

  // --- Waiting time prediction ---
  calculateWaitingTime,
  calculatePosition,

  // Recalculate wait times for all active tickets
  recalculateAllWaitTimes: () => {
    for (const t of queueTickets) {
      if (![QUEUE_STATUS.COMPLETED, QUEUE_STATUS.CANCELLED, QUEUE_STATUS.SKIPPED].includes(t.status)) {
        t.estimated_wait_time = calculateWaitingTime(t.id);
      }
    }
  },

  // --- Ratings ---
  getRatings: () => [...ratings],
  getRatingByQueueId: (queueId) => ratings.find((r) => r.queue_id === queueId) || null,
  addRating: ({ queueId, customerId, customerName, rating, feedback }) => {
    const ticket = queueTickets.find((t) => t.id === queueId);
    const r = {
      id: nextId(),
      queue_id: queueId,
      customer_id: customerId,
      customer_name: customerName,
      service_name: ticket?.service_name || 'Unknown',
      staff_name: ticket?.staff_name || 'Unknown',
      rating,
      feedback,
      created_at: new Date().toISOString(),
    };
    ratings.push(r);
    return r;
  },

  // --- Notifications ---
  getNotificationsByUserId: (userId) =>
    notifications.filter((n) => n.user_id === userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
  markNotificationRead: (id) => {
    const n = notifications.find((x) => x.id === id);
    if (n) n.read = true;
    return n;
  },

  // --- Schedules ---
  getSchedules: () => [...schedules],
  getSchedulesByStaffId: (staffId) => schedules.filter((s) => s.staff_id === staffId),
  addSchedule: (data) => {
    const s = { ...data, id: nextId() };
    schedules.push(s);
    return s;
  },
  updateSchedule: (id, data) => {
    const idx = schedules.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    schedules[idx] = { ...schedules[idx], ...data };
    return schedules[idx];
  },
  removeSchedule: (id) => {
    const idx = schedules.findIndex((s) => s.id === id);
    if (idx !== -1) schedules.splice(idx, 1);
  },

  // --- Reports (computed from data) ---
  getDashboardStats: () => {
    const today = todayStr();
    const todayTickets = queueTickets.filter((t) => t.date === today);
    const completed = todayTickets.filter((t) => t.status === QUEUE_STATUS.COMPLETED);
    const waiting = todayTickets.filter((t) => t.status === QUEUE_STATUS.WAITING);
    const activeStaff = staff.filter((s) => s.status === 'AVAILABLE');

    // Average service duration from completed tickets
    let avgDuration = 0;
    if (completed.length > 0) {
      const totalDur = completed.reduce((sum, t) => {
        if (t.started_at && t.completed_at) {
          return sum + (new Date(t.completed_at) - new Date(t.started_at)) / 60000;
        }
        return sum + t.service_duration;
      }, 0);
      avgDuration = Math.round(totalDur / completed.length);
    }

    // Service popularity
    const serviceCount = {};
    todayTickets.forEach((t) => {
      serviceCount[t.service_name] = (serviceCount[t.service_name] || 0) + 1;
    });
    const popularServices = Object.entries(serviceCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Status distribution
    const statusDist = {};
    todayTickets.forEach((t) => {
      statusDist[t.status] = (statusDist[t.status] || 0) + 1;
    });

    return {
      totalCustomers: users.filter((u) => u.role === 'CUSTOMER').length,
      activeStaff: activeStaff.length,
      activeQueues: todayTickets.filter(
        (t) => ![QUEUE_STATUS.COMPLETED, QUEUE_STATUS.CANCELLED, QUEUE_STATUS.SKIPPED].includes(t.status)
      ).length,
      customersWaiting: waiting.length,
      completedToday: completed.length,
      avgDuration,
      popularServices,
      statusDistribution: statusDist,
      recentActivity: todayTickets.slice(-5).reverse(),
    };
  },
};
