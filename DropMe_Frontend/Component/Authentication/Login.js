import { View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Icon,
  Input,
  Stack,
  Text,
  WarningOutlineIcon,
  Alert,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
} from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { AuthContext } from "../Context";
import axios from "axios";

const Login = ({ navigation }) => {
  const [userName, setUsername] = useState("");
  const [userPassword, setUserpassword] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = React.useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertField, setAlertField] = useState({
    status: "success",
    title: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, getUrl } = useContext(AuthContext);
  const url = getUrl();

  useEffect(() => {
    let mounted = true;
    return () => (mounted = false);
  }, []);

  let AlertField = (
    <Alert w="100%" status={alertField.status}>
      <VStack space={2} flexShrink={1} w="100%">
        <HStack flexShrink={1} space={2} justifyContent="space-between">
          <HStack space={2} flexShrink={1}>
            <Alert.Icon mt="1" />
            <Text fontSize="md" color="coolGray.800">
              {alertField.title}
            </Text>
          </HStack>
          <IconButton
            variant="unstyled"
            _focus={{
              borderWidth: 0,
            }}
            icon={<CloseIcon size="3" color="coolGray.600" />}
          />
        </HStack>
      </VStack>
    </Alert>
  );

  const handleLogin = async () => {
    if (userName === "" || userPassword === "") {
      setError(true);
      setTimeout(() => setError(false), 5000);
      return;
    }
    const details = { mobileNumber: userName, password: userPassword };
    try {
      setIsLoading(true);
      const result = await axios.post(url + "/user/login", details);
      console.log("Token", result.headers["x-auth-token"]);

      if (result.data) {
        setIsLoading(false);
        signIn(userName, result.data, result.headers["x-auth-token"]);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setAlertField({ status: "error", title: error.response.data });
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
  };
  return (
    <Box
      alignItems={"center"}
      justifyContent={"center"}
      flex="1"
      bg={"#F0F8FF"}
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
        {showAlert ? AlertField : ""}
        <FormControl m="5" isInvalid={error}>
          <Text color="rgba(6,182,212,1.00)" fontSize={"lg"} mb="2">
            Welcome!
          </Text>
          <Stack space={6} m="2">
            <Box>
              <Input
                maxLength={10}
                keyboardType="numeric"
                size={"md"}
                w="85%"
                InputLeftElement={
                  <Icon
                    as={<MaterialCommunityIcons name="account" />}
                    size={6}
                    ml="2"
                    color="rgba(6,182,212,1.00)"
                  />
                }
                placeholder="Mobile No"
                onChangeText={(value) => setUsername(value)}
              />
            </Box>
            <Box>
              <Input
                size={"md"}
                w="85%"
                type={show ? "text" : "password"}
                InputLeftElement={
                  <Icon
                    as={<MaterialCommunityIcons name={"security"} />}
                    size={6}
                    ml="2"
                    color="#06B6D4"
                  />
                }
                InputRightElement={
                  <Icon
                    as={
                      <MaterialCommunityIcons name={show ? "eye" : "eye-off"} />
                    }
                    size={6}
                    mr="2"
                    color="#06B6D4"
                    onPress={() => setShow(!show)}
                  />
                }
                placeholder="Password"
                onChangeText={(value) => setUserpassword(value)}
              />
            </Box>
            {/* <Button w="85%" onPress={handleLogin}>
              Sign In
            </Button> */}
            <Box>
              <Button
                isLoading={isLoading}
                isLoadingText="Signing in.."
                size="md"
                w={"85%"}
                onPress={handleLogin}
              >
                <Text fontSize={"lg"} color="white">
                  Sign In
                </Text>
              </Button>
            </Box>
          </Stack>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Invalid Mobile No or Password.
          </FormControl.ErrorMessage>
        </FormControl>
        <Box justifyContent={"space-between"} flexDirection="row">
          <Text m="2" fontSize={"sm"} color="#D0CFCF">
            {"Don't have an account? "}
            <Text
              bold
              color="rgba(6,182,212,1.00)"
              onPress={() => navigation.navigate("Registration")}
            >
              Sign Up
            </Text>
          </Text>
          <Text
            m="2"
            color="rgba(6,182,212,1.00)"
            onPress={() => navigation.navigate("Forgot Password")}
          >
            Forgot Password?
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
