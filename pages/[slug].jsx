import { Box, Heading } from '@chakra-ui/react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
// eslint-disable-next-line sort-imports
import client from '../apollo-client';

const Post = ({ data }) => (
  <>
    <Head>
      <title>{`${data.title} - Ahmad Rifqy Syarwani`}</title>
      <meta name="description" content="Personal Site of Ahmad Rifqy Syarwani" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Box as="article">
      <Heading as="h1">
        { data.title }
      </Heading>
    </Box>
  </>
);

Post.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
};

export const getStaticPaths = async () => {
  const GET_ALL_SLUGS = gql`
    query GetSlugs {
        allBlogs {
          slug
        }
      }
  `;

  const { data } = await client.query({
    query: GET_ALL_SLUGS,
  });

  const pathsData = data.allBlogs.map((post) => ({
    params: {
      slug: post.slug,
    },
  }));

  return {
    paths: pathsData,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const GET_POST = gql`
    query GetPost {
      blog(filter: {slug: {eq: "${params.slug}"}}) {
        title
        description
        _createdAt
        content {
          value
        }
      }
    }
  `;

  const { data } = await client.query({
    query: GET_POST,
  });

  return {
    props: {
      data: data.blog,
    },
  };
};

export default Post;
