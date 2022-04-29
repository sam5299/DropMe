import { View } from "react-native";
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Icon,
  Input,
  Stack,
  Text,
  WarningOutlineIcon,
} from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Login = ({ navigation }) => {
  const [userName, setUsername] = useState("");
  const [userPassword, setUserpassword] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = React.useState(false);

  const handleLogin = () => {
    if (userName === "" || userPassword === "") {
      setError(true);
      setTimeout(() => setError(false), 5000);
      return;
    }
    navigation.navigate("Home");
  };
  return (
    <Box
      alignItems={"center"}
      justifyContent={"center"}
      flex="1"
      bg={"#8c92ac"}
    >
      <Box
        width={"90%"}
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        _dark={{
          borderColor: "coolGray.600",
          backgroundColor: "gray.700",
        }}
        _web={{
          shadow: 2,
          borderWidth: 0,
        }}
        _light={{
          backgroundColor: "gray.50",
        }}
      >
        <FormControl m="5" isInvalid={error}>
          <Stack space={6} m="2">
            <Text>Welcome</Text>
            <Input
              w="85%"
              InputLeftElement={
                <Icon
                  as={<MaterialCommunityIcons name="account" />}
                  size={6}
                  ml="2"
                  color="#00827f"
                />
              }
              placeholder="Username"
              onChangeText={(value) => setUsername(value)}
            />
            <Input
              w="85%"
              type={show ? "text" : "password"}
              InputRightElement={
                <Icon
                  as={
                    <MaterialCommunityIcons name={show ? "eye" : "eye-off"} />
                  }
                  size={6}
                  mr="2"
                  color="#00827f"
                  onPress={() => setShow(!show)}
                />
              }
              placeholder="Password"
              onChangeText={(value) => setUserpassword(value)}
            />
            <Button w="85%" onPress={handleLogin}>
              SignIn
            </Button>
          </Stack>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Incorrect Username or Password.
          </FormControl.ErrorMessage>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Login;
