import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import dayjs from '@/lib/dayjs';
import { gql } from '@apollo/client';
import client from '@/lib/apollo-client';

type HomeProps = {
  posts: {
    id: string;
    slug: string;
    title: string;
    description: string;
    _firstPublishedAt: string;
    tags: string[];
  }[];
};

const Home = ({ posts }: HomeProps): JSX.Element => (
  <>
    <Flex
      align="center"
      as="section"
      justify="space-between"
      mb="10"
      wrap="wrap"
    >
      <Box as="header" mb="20">
        <Heading as="h1" size="2xl">
          Ahmad Rifqy Syarwani
        </Heading>
      </Box>

      <Box>
        <Heading as="h3" mb="2" size="lg">
          Hi, welcome to my site 👋
        </Heading>

        <Text fontSize="xl" mr="5">
          I&apos;m a software engineer with specialty in frontend and
          JavaScript.
          <br />I do write blog posts as my personal notes and medium to share.
        </Text>

        <Stack direction="row" my={5} spacing={2}>
          <a
            href="https://linkedin.com/in/arifqys"
            rel="noreferrer"
            target="_blank"
          >
            <Button
              colorScheme="linkedin"
              leftIcon={<FaLinkedinIn />}
              size="sm"
            >
              LinkedIn
            </Button>
          </a>

          <a href="https://github.com/arifqys" rel="noreferrer" target="_blank">
            <Button colorScheme="gray" leftIcon={<FaGithub />} size="sm">
              Github
            </Button>
          </a>
        </Stack>
      </Box>

      <Image
        alt="Picture of Ahmad Rifqy Syarwani"
        className="rounded"
        height={150}
        layout="fixed"
        src="/img/profile.webp"
        width={150}
      />
    </Flex>

    <Box as="section" mb="10">
      <Heading as="h2" mb="5" size="lg">
        Blog <Badge>written in Bahasa</Badge>
      </Heading>

      <SimpleGrid columns={[1, 2]} spacing="20px">
        {posts.map((post) => (
          <LinkBox
            key={post.id}
            as="article"
            borderWidth="1px"
            p="5"
            rounded="md"
          >
            <Heading as="h3" mb="2" size="md">
              <Link href={`/${post.slug}`} passHref>
                <LinkOverlay>{post.title}</LinkOverlay>
              </Link>
            </Heading>

            <Text color="gray.800" fontSize="sm">
              {post.description}
            </Text>

            <Text
              as="time"
              color="gray.500"
              dateTime={post._firstPublishedAt}
              fontSize="xs"
            >
              {dayjs(post._firstPublishedAt).fromNow()}
            </Text>

            <HStack my="2" spacing={1}>
              {post.tags.map((tag) => (
                <Tag key={tag} size="sm" variant="outline">
                  {tag}
                </Tag>
              ))}
            </HStack>
          </LinkBox>
        ))}
      </SimpleGrid>
    </Box>
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  const GET_BLOG_POSTS = gql`
    query GetBlogs {
      allBlogs(orderBy: _firstPublishedAt_DESC) {
        id
        slug
        title
        description
        _firstPublishedAt
        tags
      }
    }
  `;

  const { data } = await client.query({
    query: GET_BLOG_POSTS,
  });

  return {
    props: {
      posts: data.allBlogs,
    },
    revalidate: 900, // 15 minutes
  };
};

export default Home;
