import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    role: string;
    avatar?: string;
    phone?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: string;
      avatar?: string;
      phone?: string;
      image?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    avatar?: string;
    phone?: string;
  }
}
