import {
  Box,
  HStack,
  Heading,
  Tag,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Image, StructuredText, renderRule } from 'react-datocms';
import Head from 'next/head';
import Link from 'next/link';
import NavHeader from '@/components/NavHeader';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {
  a11yDark,
  a11yLight,
} from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import dayjs from '@/lib/dayjs';
import { gql } from '@apollo/client';
import { isCode } from 'datocms-structured-text-utils';
import client from '@/lib/apollo-client';

type PostProps = {
  data: {
    title: string;
    description: string;
    _firstPublishedAt: string;
    tags: string[];
    content: any;
  };
};

const Post = ({ data }: PostProps): JSX.Element => {
  const { colorMode } = useColorMode();
  const descriptionColor = useColorModeValue(`gray.800`, `gray.300`);

  const ogImageUrl = encodeURI(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/og-image?title=${data.title}&subtitle=${data.description}`,
  );

  return (
    <>
      <Head>
        <title>{`${data.title} - Ahmad Rifqy Syarwani`}</title>

        <meta content={data.description} name="description" />

        <meta content={ogImageUrl} property="og:image" />
      </Head>

      <NavHeader />

      <Link href="/">
        <a>Back to Home</a>
      </Link>

      <Box as="section">
        <Heading as="h1" my={1}>
          {data.title}
        </Heading>

        <Text color={descriptionColor} fontSize="lg" my={1}>
          {data.description}
        </Text>

        <Text
          as="time"
          color="gray.500"
          dateTime={data._firstPublishedAt}
          fontSize="xs"
        >
          {dayjs(data._firstPublishedAt).format(`dddd, DD MMMM YYYY`)}
        </Text>

        <HStack my="2" spacing={1}>
          {data.tags.map((tag) => (
            <Tag key={tag} size="sm" variant="outline">
              {tag}
            </Tag>
          ))}
        </HStack>

        <Box as="article" className="dast-content" mt={5}>
          <StructuredText
            customRules={[
              renderRule(isCode, ({ node, key }) => (
                <SyntaxHighlighter
                  key={key}
                  language={node.language}
                  showLineNumbers
                  style={colorMode === `light` ? a11yLight : a11yDark}
                >
                  {node.code}
                </SyntaxHighlighter>
              )),
            ]}
            data={data.content}
            renderBlock={({ record }) => {
              switch (record.__typename) {
                case `ImageRecord`:
                  return (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <Image
                      className="dast-image rounded"
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
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
};

export const getStaticPaths: GetStaticPaths = async () => {
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

  const pathsData = data.allBlogs.map((post: { slug: string }) => ({
    params: {
      slug: post.slug,
    },
  }));

  return {
    paths: pathsData,
    fallback: `blocking`,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { slug } = context.params!;
  const GET_POST = gql`
    query GetPost {
      blog(filter: {slug: {eq: "${slug}"}}) {
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
    revalidate: 900, // 15 minutes
  };
};

export default Post;
