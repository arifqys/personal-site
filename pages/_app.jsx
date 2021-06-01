/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import '../styles/globals.css';
import 'nprogress/nprogress.css';
import { ChakraProvider } from '@chakra-ui/react';
import NProgress from 'nprogress';
import Router from 'next/router';

Router.events.on('routeChangeStart', () => NProgress.start()); Router.events.on('routeChangeComplete', () => NProgress.done()); Router.events.on('routeChangeError', () => NProgress.done());

const MyApp = ({ Component, pageProps }) => (
  <ChakraProvider>
    <div className="container">
      <Component {...pageProps} />
    </div>
  </ChakraProvider>
);

export default MyApp;
