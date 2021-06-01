import 'dayjs/locale/id';
import {
  Badge, Box, Button, Flex, Heading, LinkBox, LinkOverlay, SimpleGrid, Stack, Text,
} from '@chakra-ui/react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { gql } from '@apollo/client';
import relativeTime from 'dayjs/plugin/relativeTime';
// eslint-disable-next-line sort-imports
import client from '../apollo-client';

const Home = ({ posts }) => {
  dayjs.locale('id');
  dayjs.extend(relativeTime);

  return (
    <>
      <Head>
        <title>Ahmad Rifqy Syarwani</title>
        <meta name="description" content="Personal Site of Ahmad Rifqy Syarwani" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box as="header" mb="20">
        <Heading as="h1" size="2xl">Ahmad Rifqy Syarwani</Heading>
      </Box>

      <Flex justify="space-between" align="center" wrap="wrap" mb="10">
        <Box>
          <Heading as="h3" size="lg" mb="2">Hi, welcome to my site 👋</Heading>

          <Text fontSize="xl" mr="5">
            I&apos;m a software engineer with specialty in frontend and JavaScript.
            <br />
            I do write blog posts as my personal notes and medium to share.
          </Text>

          <Stack direction="row" spacing={2} my={5}>
            <a href="https://linkedin.com/in/arifqys" target="_blank" rel="noreferrer">
              <Button colorScheme="linkedin" size="sm" leftIcon={<FaLinkedinIn />}>
                LinkedIn
              </Button>
            </a>

            <a href="https://github.com/arifqys" target="_blank" rel="noreferrer">
              <Button colorScheme="gray" size="sm" leftIcon={<FaGithub />}>
                Github
              </Button>
            </a>
          </Stack>
        </Box>

        <Image src="/img/profile.webp" alt="Picture of Ahmad Rifqy Syarwani" className="rounded" layout="fixed" width={150} height={150} />
      </Flex>

      <Box mb="10">
        <Heading as="h2" size="lg" mb="5">
          Blog
          {' '}
          <Badge>in Bahasa</Badge>
        </Heading>

        <SimpleGrid columns={[1, 2, 3]} spacing="20px">
          {
            posts.map((post) => (
              <LinkBox as="article" p="5" borderWidth="1px" rounded="md" key={post.id}>
                <Heading as="h3" size="md" mb="2">
                  <Link href={`/${post.slug}`} passHref>
                    <LinkOverlay>{post.title}</LinkOverlay>
                  </Link>
                </Heading>

                <Text color="gray.800" fontSize="sm">{post.description}</Text>

                <Text as="time" dateTime={post._createdAt} color="gray.500" fontSize="xs">
                  {dayjs(post._createdAt).fromNow()}
                </Text>
              </LinkBox>
            ))
          }
        </SimpleGrid>
      </Box>

      <Box as="footer">
        &copy;
        {' '}
        {dayjs().year()}
      </Box>
    </>
  );
};

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
