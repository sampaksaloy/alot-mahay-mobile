

const MOCK_DELAY = 600; // simulate network delay

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Simple in-memory "database" para sa mock accounts.
const mockUsers = [
  {
    id: '1',
    name: 'Juan Dela Cruz',
    email: 'customer@test.com',
    phone: '09171234567',
    password: '123456',
    role: 'CUSTOMER',
    status: 'ACTIVE',
  },
];

export const authRemoteDataSource = {
  async login(email, password) {
    await delay(MOCK_DELAY);

    const found = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      throw new Error('Wrong email or password.');
    }

    const { password: _pw, ...userWithoutPassword } = found;
    return {
      access_token: 'mock-token-' + found.id,
      user: userWithoutPassword,
    };
  },

  async register({ name, email, phone, password }) {
    await delay(MOCK_DELAY);

    const exists = mockUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error('Email already registered.');
    }

    const newUser = {
      id: String(mockUsers.length + 1),
      name,
      email,
      phone,
      password,
      role: 'CUSTOMER',
      status: 'ACTIVE',
    };
    mockUsers.push(newUser);

    const { password: _pw, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword };
  },

  async logout() {
    await delay(200);
    return {};
  },

  async me() {
    await delay(200);
    const found = mockUsers[0];
    const { password: _pw, ...userWithoutPassword } = found;
    return userWithoutPassword;
  },
};