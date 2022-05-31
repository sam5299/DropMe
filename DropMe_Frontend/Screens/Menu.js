import React, { useContext } from "react";
import {
  Badge,
  Box,
  Heading,
  Pressable,
  Stack,
  Text,
  VStack,
} from "native-base";
import { AuthContext } from "../Component/Context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
const Menu = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);

  return (
    <VStack flex={1} space={0.5} mt={1} bg={"#F0F8FF"}>
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="12%"
        bg="white"
        rounded="md"
        shadow={3}
        flexDir="row"
        alignItems={"center"}
        borderColor="#D0CFCF"
        borderWidth={1}
        onPress={() => navigation.navigate("RideStack")}
      >
        <Box flexDir={"row"} alignItems={"center"} p="5">
          <MaterialCommunityIcons
            name="bike"
            size={40}
            color="rgba(6,182,212,1.00)"
          />
          <Stack ml={"5"} space={1}>
            <Heading size="md">Rides</Heading>
            <Text>Manage Rides</Text>
          </Stack>
        </Box>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="12%"
        bg="white"
        rounded="md"
        shadow={3}
        flexDir="row"
        alignItems={"center"}
        borderColor="#D0CFCF"
        borderWidth={1}
        onPress={() => navigation.navigate("TripsStack")}
      >
        <Box flexDir={"row"} alignItems={"center"} p="5">
          <MaterialCommunityIcons
            name="car-settings"
            size={40}
            color="rgba(6,182,212,1.00)"
          />
          <Stack ml={"5"} space={1}>
            <Heading size="md">Trips</Heading>
            <Text>Manage Trips</Text>
          </Stack>
        </Box>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="12%"
        bg="white"
        rounded="md"
        shadow={3}
        flexDir="row"
        alignItems={"center"}
        borderColor="#D0CFCF"
        borderWidth={1}
        onPress={() => navigation.navigate("Vehicle")}
      >
        <Box flexDir={"row"} alignItems={"center"} p="5">
          <MaterialCommunityIcons
            name="car-multiple"
            size={40}
            color="rgba(6,182,212,1.00)"
          />
          <Stack ml={"5"} space={1}>
            <Heading size="md">Vehicles</Heading>
            <Text>Manage Vehicles</Text>
          </Stack>
        </Box>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="12%"
        bg="white"
        rounded="md"
        shadow={3}
        flexDir="row"
        alignItems={"center"}
        borderColor="#D0CFCF"
        borderWidth={1}
        onPress={() => navigation.navigate("Profile")}
      >
        <Box flexDir={"row"} alignItems={"center"} p="5">
          <MaterialCommunityIcons
            name="account-box-outline"
            size={40}
            color="rgba(6,182,212,1.00)"
          />
          <Stack ml={"5"} space={1}>
            <Heading size="md">Profile</Heading>
            <Text>View Profile</Text>
          </Stack>
        </Box>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="12%"
        bg="white"
        rounded="md"
        shadow={3}
        flexDir="row"
        alignItems={"center"}
        borderColor="#D0CFCF"
        borderWidth={1}
        onPress={() => navigation.navigate("WalletStack")}
      >
        <Box flexDir={"row"} alignItems={"center"} p="5">
          <MaterialCommunityIcons
            name="wallet-outline"
            size={40}
            color="rgba(6,182,212,1.00)"
          />
          <Stack ml={"5"} space={1}>
            <Heading size="md">Wallet</Heading>
            <Text>Manage Payments</Text>
          </Stack>
        </Box>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="12%"
        bg="white"
        rounded="md"
        shadow={3}
        flexDir="row"
        alignItems={"center"}
        borderColor="#D0CFCF"
        borderWidth={1}
        onPress={() => navigation.navigate("Help")}
      >
        <Box flexDir={"row"} alignItems={"center"} p="5">
          <MaterialCommunityIcons
            name="help-rhombus-outline"
            size={40}
            color="rgba(6,182,212,1.00)"
          />
          <Stack ml={"5"} space={1}>
            <Heading size="md">Help</Heading>
            <Text>Help page</Text>
          </Stack>
        </Box>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="12%"
        bg="white"
        rounded="md"
        shadow={3}
        flexDir="row"
        alignItems={"center"}
        borderColor="#D0CFCF"
        borderWidth={1}
        //onPress={() => alert("notification")}

        onPress={() => navigation.navigate("Notifications")}
      >
        <Box flexDir={"row"} alignItems={"center"} p="5">
          <VStack>
            <Badge // bg="red.400"
              colorScheme="green"
              rounded="full"
              mb={-4}
              mr={-4}
              zIndex={1}
              variant="solid"
              alignSelf="flex-end"
              _text={{
                fontSize: 12,
              }}
            >
              10
            </Badge>
            <FontAwesome5 name="bell" size={40} color="rgba(6,182,212,1.00)" />
          </VStack>

          <Stack ml={"5"} space={1} m={1}>
            <Heading size="md">Notifications</Heading>
            <Text>View Notification</Text>
          </Stack>
        </Box>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="12%"
        bg="white"
        rounded="md"
        shadow={3}
        flexDir="row"
        alignItems={"center"}
        borderColor="#D0CFCF"
        borderWidth={1}
        onPress={() => signOut()}
      >
        <Box flexDir={"row"} alignItems={"center"} p="5">
          <MaterialIcons name="logout" size={40} color="rgba(6,182,212,1.00)" />
          <Stack ml={"5"} space={1}>
            <Heading size="md">Logout</Heading>
            <Text>Logout From Device </Text>
          </Stack>
        </Box>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
    </VStack>
  );
};

export default Menu;
