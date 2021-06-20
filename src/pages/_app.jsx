/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import '@styles/globals.scss';
import 'nprogress/nprogress.css';
import { Box, ChakraProvider } from '@chakra-ui/react';
import Head from 'next/head';
import NProgress from 'nprogress';
import Router from 'next/router';
import dayjs from '@lib/dayjs';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const MyApp = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Ahmad Rifqy Syarwani</title>

      <meta
        content="Personal Site of Ahmad Rifqy Syarwani"
        name="description"
      />

      <link href="/favicon.ico" rel="icon" />
    </Head>

    <ChakraProvider>
      <div className="container">
        <Component {...pageProps} />

        <Box as="footer" my={10}>
          &copy; {dayjs().year()} Ahmad Rifqy Syarwani
        </Box>
      </div>
    </ChakraProvider>
  </>
);

export default MyApp;
