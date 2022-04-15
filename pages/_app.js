import { SessionProvider } from 'next-auth/react';
import Error from '../components/Error';
import Navbar from '../components/Navbar';
import '../firebase.app';
import '../styles/globals.css';
import { useWindowSize } from '../utils/useWindowSize';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const size = useWindowSize();
  // if (size.width < 768) {
  //   return <Error errorMsg='Not optimized for mobile device' />;
  // }
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
