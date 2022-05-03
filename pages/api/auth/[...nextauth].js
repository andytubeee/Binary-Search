import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      authorizationUrl:
        'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
    }),
    CredentialsProvider({
      name: 'EmailPassword',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'johndoe@gmail.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const auth = getAuth();
        const user = await signInWithEmailAndPassword(
          auth,
          credentials.email,
          credentials.password
        )
          .then((userCredential) => {
            // console.log(userCredential.user.uid);
            return {
              email: userCredential.user.email,
              name: userCredential.user.displayName,
            };
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            return null;
          });
        return user;
      },
    }),
  ],
  // site: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  session: {
    jwt: true,
  },
  jwt: {
    encryption: true,
  },
  callbacks: {
    async session({ session, token }) {
      return session;
    },
    async jwt(token, account) {
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token.token;
    },
    redirect: async (url, _baseUrl) => {
      if (url === '/profile') {
        return Promise.resolve('/');
      }
      return Promise.resolve('/');
    },
  },
});
