import '@/styles/globals.scss';
import { useEffect } from 'react';
import Head from 'next/head';


function MyApp({ Component, pageProps }) {
  /*
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  */
  return (
    <>
      <Head>
        <title>Shogi Clock</title>
        <meta name="description" content="A chess clock, but for shogi!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
