import { withOGImage } from 'next-api-og-image';

interface QueryParams {
  title: string;
  subtitle: string;
}

export default withOGImage<'query', QueryParams>({
  template: {
    html: async ({ title, subtitle }: QueryParams) =>
      `
      <html>
        <body style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif">
          <h1 style="font-size: 3em">
            ${title || ``}
          </h1>
          <h3 style="font-size: 1.8em; font-weight: normal">
            ${subtitle || ``}
          </h3>
          <div style="background: black; padding: 10px 20px; position: absolute; bottom: 0">
            <span style="color: white; font-size: 1.5em">
              arifqys.com
            <span>
          </div>
        </body>
      </html>
      `,
  },
  cacheControl: `public, max-age=604800, immutable`,
  dev: {
    inspectHtml: false,
  },
});
