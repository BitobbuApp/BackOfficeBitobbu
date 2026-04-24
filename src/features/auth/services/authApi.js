import { mockAdminUsers } from '@/mocks/backofficeMockData';

export const authApi = {
  async login({ email, password }) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const admin = mockAdminUsers.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );

    if (!admin) {
      const error = new Error('Credenciales invalidas');
      error.response = { data: { message: 'Email o password incorrecto' } };
      throw error;
    }

    return {
      token: 'mock-admin-jwt-token',
      admin: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
      },
    };
  },

  async getMe() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return {
      admin: null,
    };
  },
};
