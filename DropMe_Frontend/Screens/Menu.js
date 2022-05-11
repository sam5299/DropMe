import { TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  Pressable,
  Stack,
  Text,
  VStack,
} from "native-base";
import { AuthContext } from "../Component/Context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Menu = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);

  return (
    <VStack space={0.5} mt={2}>
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="15%"
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
            <Text>Manage rides</Text>
          </Stack>
        </Box>
        <MaterialCommunityIcons
          name="arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="15%"
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
        <MaterialCommunityIcons
          name="arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="15%"
        bg="white"
        rounded="md"
        shadow={3}
        flexDir="row"
        alignItems={"center"}
        borderColor="#D0CFCF"
        borderWidth={1}
        onPress={() => navigation.navigate("Vehicles")}
      >
        <Box flexDir={"row"} alignItems={"center"} p="5">
          <MaterialCommunityIcons
            name="car-multiple"
            size={40}
            color="rgba(6,182,212,1.00)"
          />
          <Stack ml={"5"} space={1}>
            <Heading size="md">Vehicles</Heading>
            <Text>Manage vehicles</Text>
          </Stack>
        </Box>
        <MaterialCommunityIcons
          name="arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="15%"
        bg="white"
        rounded="md"
        shadow={3}
        flexDir="row"
        alignItems={"center"}
        borderColor="#D0CFCF"
        borderWidth={1}
        onPress={() => navigation.navigate("ViewProfile")}
      >
        <Box flexDir={"row"} alignItems={"center"} p="5">
          <MaterialCommunityIcons
            name="account-box-outline"
            size={40}
            color="rgba(6,182,212,1.00)"
          />
          <Stack ml={"5"} space={1}>
            <Heading size="md">Profile</Heading>
            <Text>View your profile</Text>
          </Stack>
        </Box>
        <MaterialCommunityIcons
          name="arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="15%"
        bg="white"
        rounded="md"
        shadow={3}
        flexDir="row"
        alignItems={"center"}
        borderColor="#D0CFCF"
        borderWidth={1}
        onPress={() => navigation.navigate("Balance")}
      >
        <Box flexDir={"row"} alignItems={"center"} p="5">
          <MaterialCommunityIcons
            name="wallet-outline"
            size={40}
            color="rgba(6,182,212,1.00)"
          />
          <Stack ml={"5"} space={1}>
            <Heading size="md">Wallet</Heading>
            <Text>Manage payments</Text>
          </Stack>
        </Box>
        <MaterialCommunityIcons
          name="arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
      <Button mx={2} onPress={() => signOut()}>
        Logout
      </Button>
    </VStack>
  );
};

export default Menu;