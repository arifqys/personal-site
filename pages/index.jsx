import { Box, Heading, Text } from '@chakra-ui/react';
import Head from 'next/head';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
// eslint-disable-next-line sort-imports
import client from '../apollo-client';

const Home = ({ posts }) => (
  <div className="container">
    <Head>
      <title>Ahmad Rifqy Syarwani</title>
      <meta name="description" content="Personal Site of Ahmad Rifqy Syarwani" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Box mb="20">
      <Heading as="h1" size="2xl">
        Ahmad Rifqy Syarwani
      </Heading>
    </Box>

    <Box mb="10">
      <Heading as="h2" size="xl" mb="5">
        About
      </Heading>
      <Text>
        Rifqy is a software engineer with specialty in frontend and JavaScript.
        Holds a bachelor’s degree from Information Systems, ITS.
      </Text>
    </Box>

    <Box mb="10">
      <Heading as="h2" size="xl" mb="5">
        Blog (in Bahasa)
      </Heading>
      {
        posts.map((post) => (
          <Heading as="h2" size="md" mb="3" key={post.id}>{post.title}</Heading>
        ))
      }

    </Box>

    <footer>
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by
        {' '}
        <span>
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </span>
      </a>
    </footer>
  </div>
);

Home.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export const getStaticProps = async () => {
  const GET_BLOG_POSTS = gql`
    query GetBlogs {
        allBlogs {
          title
          id
        }
      }
  `;

  const { data: posts } = await client.query({
    query: GET_BLOG_POSTS,
  });

  return {
    props: {
      posts: posts.allBlogs,
    },
  };
};

export default Home;
