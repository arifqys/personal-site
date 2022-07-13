import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import theme from '@/styles/theme';

class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head />

        {/* eslint-disable-next-line @next/next/next-script-for-ga */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-N2F4DST');
            `,
          }}
        />

        <body>
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N2F4DST"
                height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />

          <ColorModeScript initialColorMode={theme.config.initialColorMode} />

          <Main />

          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
