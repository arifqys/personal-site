import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const link = createHttpLink({
  uri: process.env.DATOCMS_URL,
  headers: {
    authorization: `Bearer ${process.env.DATOCMS_TOKEN}`,
  },
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
