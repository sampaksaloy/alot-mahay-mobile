// Interface (contract) ra ni. Ang data/repositories/authRepositoryImpl.js
// mao ang tinuod nga implementation. Gi-himo ni para testable/swappable.
export const AuthRepository = {
  login: async (_email, _password) => { throw new Error('Not implemented'); },
  register: async (_payload) => { throw new Error('Not implemented'); },
  logout: async () => { throw new Error('Not implemented'); },
  getCurrentUser: async () => { throw new Error('Not implemented'); },
};
