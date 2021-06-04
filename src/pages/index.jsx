import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';
import dayjs from '@lib/dayjs';
import { gql } from '@apollo/client';
// eslint-disable-next-line sort-imports
import client from '@lib/apollo-client';

const Home = ({ posts }) => (
  <>
    <Box as="header" mb="20">
      <Heading as="h1" size="2xl">
        Ahmad Rifqy Syarwani
      </Heading>
    </Box>

    <Flex align="center" justify="space-between" mb="10" wrap="wrap">
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

    <Box mb="10">
      <Heading as="h2" mb="5" size="lg">
        Blog <Badge>in Bahasa</Badge>
      </Heading>

      <SimpleGrid columns={[1, 2, 3]} spacing="20px">
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
              dateTime={post._createdAt}
              fontSize="xs"
            >
              {dayjs(post._createdAt).fromNow()}
            </Text>
          </LinkBox>
        ))}
      </SimpleGrid>
    </Box>
  </>
);

Home.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export const getStaticProps = async () => {
  const GET_BLOG_POSTS = gql`
    query GetBlogs {
      allBlogs {
        id
        slug
        title
        description
        _createdAt
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
  };
};

export default Home;
