import { mockDataStore } from '../../../../core/data/mockDataStore';

const MOCK_DELAY = 600;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const authRemoteDataSource = {
  async login(email, password) {
    await delay(MOCK_DELAY);

    const found = mockDataStore.getUserByEmail(email);

    if (!found || found.password !== password) {
      throw new Error('Wrong email or password.');
    }

    if (found.status !== 'ACTIVE') {
      throw new Error('Account is deactivated. Contact admin.');
    }

    const { password: _pw, ...userWithoutPassword } = found;
    return {
      access_token: 'mock-token-' + found.id,
      user: userWithoutPassword,
    };
  },

  async register({ name, email, phone, password, role = 'CUSTOMER', staffType, specialization }) {
    await delay(MOCK_DELAY);

    const exists = mockDataStore.getUserByEmail(email);
    if (exists) {
      throw new Error('Email already registered.');
    }

    const assignedRole = (role || 'CUSTOMER').toUpperCase();

    const newUser = mockDataStore.addUser({
      name,
      email,
      phone,
      password,
      role: assignedRole,
    });

    if (assignedRole === 'STAFF') {
      mockDataStore.addStaff({
        userId: newUser.id,
        name,
        staffType: staffType || 'Barber',
        specialization: specialization || 'Haircut, Grooming',
        status: 'AVAILABLE',
        avatar: null,
      });
    }

    const { password: _pw, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword };
  },

  async logout() {
    await delay(200);
    return {};
  },

  async me(userId) {
    await delay(200);
    const found = userId
      ? mockDataStore.getUserById(userId)
      : mockDataStore.getUsers()[0];
    if (!found) throw new Error('User not found');
    const { password: _pw, ...userWithoutPassword } = found;
    return userWithoutPassword;
  },
};