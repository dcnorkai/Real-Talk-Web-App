import React from 'react'
import { IconButton, useDisclosure, Button, Image, Text } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
        {children ? (
            <span onClick={onOpen}>{children}</span>
        ) : (
            <IconButton display={{base:"flex"}} icon={<ViewIcon />} onClick={onOpen} />
            )}
            <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent height="400px">
                <ModalHeader
                fontSize="40px"
                fontFamily="gg sans Medium"
                display="flex"
                justifyContent="center"
                >
                    {user.name}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody
                    display="flex"
                    flexDir="column"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Image
                        borderRadius="full"
                        boxSize="150px"
                        src={user.pic}
                        alt={user.name}
                    />
                    <Text
                        fontSize={{base: "28px", md: "30px"}}
                        fontFamily="gg sans semibold"
                    >
                        Email: {user.email}
                    </Text>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                    Close
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );

};

export default ProfileModal
