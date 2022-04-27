import { SessionProvider } from 'next-auth/react';
import { NextSeo } from 'next-seo';
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
      <NextSeo
        title='Binary Search'
        description='Binary Search is a platform for finding people with similar skills and interests. It is targeted towards CS and STEM major students, you can publish your side projects, and chat with other users.'
        openGraph={{
          type: 'website',
          locale: 'en_IE',
          url: 'https://www.binarysearch.club/',
          site_name: 'Binary Search',
        }}
      />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
