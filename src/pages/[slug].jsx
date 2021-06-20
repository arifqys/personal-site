import { Box, HStack, Heading, Tag, Text } from '@chakra-ui/react';
import { Image, StructuredText, renderRule } from 'react-datocms';
import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import dayjs from '@lib/dayjs';
import { gql } from '@apollo/client';
import { isCode } from 'datocms-structured-text-utils';
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

      <Text
        as="time"
        color="gray.500"
        dateTime={data._firstPublishedAt}
        fontSize="xs"
      >
        {dayjs(data._firstPublishedAt).format('dddd, DD MMMM YYYY')}
      </Text>

      <HStack my="2" spacing={1}>
        {data.tags?.map((tag) => (
          <Tag key={tag} size="sm" variant="outline">
            {tag}
          </Tag>
        ))}
      </HStack>

      <Box as="article" className="dast-content" mt={5}>
        <StructuredText
          customRules={[
            renderRule(isCode, ({ node }) => (
              <SyntaxHighlighter language={node.language} showLineNumbers>
                {node.code}
              </SyntaxHighlighter>
            )),
          ]}
          data={data.content}
          renderBlock={({ record }) => {
            switch (record.__typename) {
              case 'ImageRecord':
                return (
                  <Image
                    className="dast-image rounded"
                    data={record.image.responsiveImage}
                  />
                );
              default:
                return null;
            }
          }}
        />
      </Box>
    </Box>
  </>
);

Post.propTypes = {
  data: PropTypes.shape({
    _firstPublishedAt: PropTypes.string,
    content: PropTypes.objectOf(PropTypes.any),
    description: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
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
        _firstPublishedAt
        tags
        content {
          value
          blocks {
            id
            __typename
            ... on ImageRecord {
              image {
                responsiveImage(imgixParams: { fit: fill, w: 500, h: 500, auto: format }) {
                  srcSet
                  webpSrcSet
                  sizes
                  src
                  width
                  height
                  aspectRatio
                  alt
                  title
                  base64
                }
              }
            }
          }
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
