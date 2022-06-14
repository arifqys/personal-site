import { Button, Flex, Heading, useColorMode } from '@chakra-ui/react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

const NavHeader = (): JSX.Element => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex align="center" as="header" justify="space-between" mb="10">
      <Heading as="h1" size="2xl">
        Ahmad Rifqy Syarwani
      </Heading>
      <Button aria-label="Toggle light or dark mode" onClick={toggleColorMode}>
        {colorMode === `light` ? <MdDarkMode /> : <MdLightMode />}
      </Button>
    </Flex>
  );
};

export default NavHeader;
