import {
  Box,
  Center,
  Modal,
  ScrollView,
  Stack,
  Text,
  Button,
} from "native-base";
import { React, useState } from "react";
import { VStack } from "native-base";
import {
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome,
  Octicons 
} from "@expo/vector-icons";
import HelpModal from "../Component/HelpModal";
const HelpPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  return (
    <Box bg={"#aaa"} w={"100%"} p={3}>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content w="90%" p={4}>
          <Modal.Header>
            <Text fontWeight={"bold"} fontSize={20}>
              {selectedField}
            </Text>
          </Modal.Header>
          <Modal.Body></Modal.Body>
          <HelpModal type={selectedField} />
          <Modal.Footer>
            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => {
                setShowModal(false);
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <VStack space={4} alignItems="center">
        <Center w="100%" h="20" bg="white" rounded="md" shadow={3}>
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"flex-start"}
            space={3}
          >
            <MaterialCommunityIcons name="bike-fast" size={30} color="black" />
            <Text
              fontSize={30}
              fontWeight={"bold"}
              onPress={() => {
                setSelectedField("Create Ride");
                setShowModal(true);
              }}
            >
              Create Ride
            </Text>
          </Box>
        </Center>
        <Center w="100%" h="20" bg="white" rounded="md" shadow={3}>
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"flex-start"}
            space={3}
          >
            <AntDesign name="car" size={24} color="black" />
            <Text
              fontSize={30}
              fontWeight={"bold"}
              onPress={() => {
                setSelectedField("Create Trip");
                setShowModal(true);
              }}
            >
              Create Trip
            </Text>
          </Box>
        </Center>
        <Center w="100%" h="20" bg="white" rounded="md" shadow={3}>
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"flex-start"}
            space={3}
          >
<Octicons name="bookmark" size={24} color="black" /><Text
              fontSize={30}
              fontWeight={"bold"}
              onPress={() => {
                setSelectedField("Book Ride");
                setShowModal(true);
              }}
            >
              Book Ride
            </Text>
          </Box>
        </Center>
        <Center w="100%" h="20" bg="white" rounded="md" shadow={3}>
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"flex-start"}
            space={3}
          >
            <FontAwesome name="rupee" size={30} color="black" />
            <Text
              fontSize={30}
              fontWeight={"bold"}
              onPress={() => {
                setSelectedField("Pricing");
                setShowModal(true);
              }}
            >
              Pricing
            </Text>
          </Box>
        </Center>
        {/* <Center w="100%" h="20" bg="white" rounded="md" shadow={3} />
      <Center w="100%" h="20" bg="white" rounded="md" shadow={3} /> */}
      </VStack>
    </Box>
  );
};

export default HelpPage;
