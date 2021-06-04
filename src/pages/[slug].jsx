import { Box, Heading, Text } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { StructuredText } from 'react-datocms';
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

    <Link href="/">
      <a>Back to Home</a>
    </Link>

    <Box as="section">
      <Heading as="h1" my={1}>
        {data.title}
      </Heading>

      <Text color="gray.800" fontSize="lg" my={1}>
        {data.description}
      </Text>

      <Text as="time" color="gray.500" dateTime={data._createdAt} fontSize="xs">
        {dayjs(data._createdAt).format('dddd, DD MMMM YYYY')}
      </Text>

      <Box as="article" className="dast-content" mt={5}>
        <StructuredText data={data.content} />
      </Box>
    </Box>
  </>
);

Post.propTypes = {
  data: PropTypes.shape({
    _createdAt: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    content: PropTypes.object,
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
