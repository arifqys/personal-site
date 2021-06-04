import { Box, Heading, Text } from '@chakra-ui/react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import dayjs from '@lib/dayjs';
import { gql } from '@apollo/client';
// eslint-disable-next-line sort-imports
import client from '@lib/apollo-client';

const Post = ({ data }) => (
  <>
    <Head>
      <title>{`${data.title} - Ahmad Rifqy Syarwani`}</title>

      <meta content={data.description} name="description" />
    </Head>

    <Box as="article">
      <Heading as="h1" my={2}>
        {data.title}
      </Heading>

      <Text>{data.description}</Text>

      <Text as="time" color="gray.500" dateTime={data._createdAt} fontSize="xs">
        {dayjs(data._createdAt).format('dddd, DD MMMM YYYY')}
      </Text>
    </Box>
  </>
);

Post.propTypes = {
  data: PropTypes.shape({
    _createdAt: PropTypes.string,
    description: PropTypes.string,
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
