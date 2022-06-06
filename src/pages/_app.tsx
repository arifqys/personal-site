import '@/styles/globals.scss';
import 'nprogress/nprogress.css';
import { Box, ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import NProgress from 'nprogress';
import Router from 'next/router';
import dayjs from '@/lib/dayjs';
import theme from '@/styles/theme';

Router.events.on(`routeChangeStart`, () => NProgress.start());
Router.events.on(`routeChangeComplete`, () => NProgress.done());
Router.events.on(`routeChangeError`, () => NProgress.done());

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => (
  <>
    <Head>
      <title>Ahmad Rifqy Syarwani</title>

      <meta
        content="Personal Site of Ahmad Rifqy Syarwani"
        name="description"
      />

      <link href="/favicon.ico" rel="icon" />
    </Head>

    <ChakraProvider theme={theme}>
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
