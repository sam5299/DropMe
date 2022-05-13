import { TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  Pressable,
  ScrollView,
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
    <VStack space={0.5} mt={2}>
      <ScrollView>
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
              <Text>Manage Rides</Text>
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
              <Text>Manage Vehicles</Text>
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
              <Text>View Profile</Text>
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
              <Text>Manage Payments</Text>
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
          //onPress={() => alert("notification")}

          onPress={() => navigation.navigate("Notification")}
        >
          <Box flexDir={"row"} alignItems={"center"} p="5">
            <FontAwesome5 name="bell" size={40} color="rgba(6,182,212,1.00)" />
            <Stack ml={"5"} space={1}>
              <Heading size="md">Notification</Heading>
              <Text>View Notification</Text>
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
          h="13%"
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
            <MaterialIcons
              name="logout"
              size={40}
              color="rgba(6,182,212,1.00)"
            />

            <Stack ml={"5"} space={1}>
              <Heading size="md">Logout</Heading>
              <Text>Logout From Device</Text>
            </Stack>
          </Box>
        </Pressable>

        {/* <Button mx={2} onPress={() => signOut()}  >
        Logout
      <MaterialIcons name="logout" size={24} color="black" />
      </Button> */}
      </ScrollView>
    </VStack>
  );
};

export default Menu;
