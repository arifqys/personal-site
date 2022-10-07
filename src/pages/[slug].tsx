import {
  Box,
  Button,
  HStack,
  Heading,
  SimpleGrid,
  Tag,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight, FaHome } from 'react-icons/fa';
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

type NextPrevPost = {
  title: string;
  slug: string;
} | null;

type BottomPostNavigationProps = {
  type: 'prev' | 'next' | 'home';
  data?: NextPrevPost;
};

const BOTTOM_POST_NAVIGATION_ICON = {
  prev: <FaChevronLeft />,
  next: <FaChevronRight />,
  home: <FaHome />,
};

const BOTTOM_POST_NAVIGATION_LABEL = {
  prev: `Prev Post`,
  next: `Next Post`,
  home: `Home`,
};

const BottomPostNavigation = ({
  type,
  data,
}: BottomPostNavigationProps): JSX.Element => {
  const isHome = type === `home`;
  const isNext = type === `next`;

  if (!isHome && !data) {
    return <Box />;
  }

  return (
    <Link href={isHome || !data ? `/` : `/${data.slug}`}>
      <Button>
        {!isNext && BOTTOM_POST_NAVIGATION_ICON[type]}
        <Text mx={1} noOfLines={1}>
          {BOTTOM_POST_NAVIGATION_LABEL[type]}
        </Text>
        {isNext && BOTTOM_POST_NAVIGATION_ICON[type]}
      </Button>
    </Link>
  );
};

type PostProps = {
  post: {
    title: string;
    description: string;
    _firstPublishedAt: string;
    tags: string[];
    content: any;
  };
  prevPost: NextPrevPost;
  nextPost: NextPrevPost;
};

const Post = ({ post, prevPost, nextPost }: PostProps): JSX.Element => {
  const { colorMode } = useColorMode();
  const descriptionColor = useColorModeValue(`gray.800`, `gray.300`);

  const ogImageUrl = encodeURI(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/og-image?title=${post.title}&subtitle=${post.description}`,
  );

  return (
    <>
      <Head>
        <title>{`${post.title} - Ahmad Rifqy Syarwani`}</title>

        <meta content={post.description} name="description" />

        <meta content={ogImageUrl} property="og:image" />
      </Head>

      <NavHeader backLabel="Home" backUrl="/" />

      <Box as="section">
        <Heading as="h1" my={1}>
          {post.title}
        </Heading>

        <Text color={descriptionColor} fontSize="lg" my={1}>
          {post.description}
        </Text>

        <Text
          as="time"
          color="gray.500"
          dateTime={post._firstPublishedAt}
          fontSize="xs"
        >
          {dayjs(post._firstPublishedAt).format(`dddd, DD MMMM YYYY`)}
        </Text>

        <HStack my="2" spacing={1}>
          {post.tags.map((tag) => (
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
            data={post.content}
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

      <SimpleGrid columns={[1, 3]} my={10} spacing={5}>
        <BottomPostNavigation type="prev" data={prevPost} />
        <BottomPostNavigation type="home" />
        <BottomPostNavigation type="next" data={nextPost} />
      </SimpleGrid>
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
      allBlogs(orderBy: _firstPublishedAt_ASC) {
        title
        slug
      }
    }
  `;

  const { data } = await client.query({
    query: GET_POST,
  });

  const { blog, allBlogs } = data;
  const currentIndex = allBlogs.findIndex(
    (blog: NextPrevPost) => blog?.slug === slug,
  );

  return {
    props: {
      post: blog,
      nextPost: allBlogs[currentIndex + 1] || null,
      prevPost: allBlogs[currentIndex - 1] || null,
    },
    revalidate: 900, // 15 minutes
  };
};

export default Post;
