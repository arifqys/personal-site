import { useRouter } from 'next/router';
import { Button, Flex, Heading, Text, useColorMode } from '@chakra-ui/react';
import { MdDarkMode, MdLightMode, MdArrowBack } from 'react-icons/md';

type NavHeaderProps = {
  backLabel?: string;
  backUrl?: string;
  isHome?: boolean;
};

const NavHeader = ({
  backLabel,
  backUrl,
  isHome = false,
}: NavHeaderProps): JSX.Element => {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  const navigateBack = () => {
    if (!!backUrl) {
      router.replace(backUrl);
    }
  };

  return (
    <Flex align="center" as="header" justify="space-between" mb={10}>
      {!!backUrl && (
        <Button aria-label="Back" mr={5} onClick={navigateBack} variant="link">
          <MdArrowBack /> {!!backLabel && <Text ml={2}>{backLabel}</Text>}
        </Button>
      )}
      {isHome && (
        <Heading as="h1" size="2xl">
          Ahmad Rifqy Syarwani
        </Heading>
      )}
      <Button aria-label="Toggle light or dark mode" onClick={toggleColorMode}>
        {colorMode === `light` ? <MdDarkMode /> : <MdLightMode />}
      </Button>
    </Flex>
  );
};

export default NavHeader;
