import { ScrollView } from "react-native";
import { React, useState } from "react";
import {
  Text,
  Box,
  Button,
  Center,
  PresenceTransition,
  Stack,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
const HelpPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // <Box>
    //     <Box >
    //         hii
    //     </Box>
    //     <Box>
    //         hello
    //     </Box>
    // </Box>

    <Box flex={1}>
      <ScrollView flex={1}>
        <Stack space={3} direction={"column"}>
          <Box
            mt={2}
            flex={1}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"flex-start"}
          >
            <Stack direction={"row"} bg="#aaa" h={"30%"}>
              <MaterialIcons
                name={isOpen ? "arrow-drop-down" : "arrow-drop-up"}
                size={30}
                color="black"
              />
              <Text onPress={() => setIsOpen(!isOpen)} fontSize={18}>
                Create ride
              </Text>
            </Stack>
            <PresenceTransition
              visible={isOpen}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
                transition: {
                  duration: 250,
                },
              }}
            >
              <Center
                mt="7"
                bg="teal.500"
                rounded="md"
                w="200"
                h="100"
                _text={{
                  color: "white",
                }}
              >
                <Text>Fade</Text>
              </Center>
            </PresenceTransition>
          </Box>
        </Stack>
      </ScrollView>
    </Box>
  );
};

export default HelpPage;
