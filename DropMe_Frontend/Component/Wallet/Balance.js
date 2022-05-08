import { React, useState, useEffect } from "react";
import { Box, Stack, Text, Button } from "native-base";

const Balance = () => {
  // const {creditsPoints,safetyPoints} ={"creditsPoints":123 , "safetyPoints":55};
  const [wallet, setBalance] = useState({
    creditPoints: 123,
    safetyPoints: 55,
  });

  useEffect(() => {
    // console.log("rendered",wallet);
  }, [wallet]);
  return (
    <Box alignItems={"center"} display={"flex"} bg={"#F0F8FF"}>
      <Box
        bg={"#aaa"}
        justifyContent={"center"}
        borderRadius={10}
        flexDirection="row"
        rounded="lg"
        borderColor="coolGray.200"
        mt="30%"
        _dark={{
          borderColor: "coolGray.600",
          backgroundColor: "gray.500",
        }}
        _web={{
          shadow: 2,
          borderWidth: 0,
        }}
        _light={{
          backgroundColor: "gray.100",
        }}
      >
        <Stack space={5} direction={"column"} m="5">
          <Box
            backgroundColor={"blue.100"}
            borderRadius={10}
            alignContent="center"
            alignItems="center"
          >
            <Text fontWeight={"bold"} mx={5} fontSize={30}>
              {wallet.creditPoints}
            </Text>
            <Text fontWeight={"bold"} fontSize={15} mb={2}>
              Credit{"\n"}Points
            </Text>
          </Box>
          <Button
            onPress={() => {
              console.log("pressed");
              setBalance({ ...wallet, creditPoints: wallet.creditPoints + 1 });
            }}
          >
            <Text fontSize={"sm"} fontWeight={"bold"} color="white">
              Add Credits
            </Text>
          </Button>
          <Button
            onPress={() =>
              setBalance({
                safetyPoints: 0,
                creditPoints: wallet.creditPoints + wallet.safetyPoints,
              })
            }
          >
            <Text fontSize={"sm"} fontWeight={"bold"} color="white">
              Withdraw Credits
            </Text>
          </Button>
        </Stack>
        <Stack space={5} direction={"column"} m="5">
          <Box
            backgroundColor={"blue.100"}
            borderRadius={10}
            alignContent="center"
            alignItems="center"
          >
            <Text fontWeight={"bold"} mx={5} fontSize={30}>
              {wallet.safetyPoints}
            </Text>
            <Text fontWeight={"bold"} fontSize={15} mb={2}>
              Safety{"\n"}Points
            </Text>
          </Box>
          <Button
            onPress={() =>
              setBalance({
                safetyPoints:
                  wallet.safetyPoints > 0 ? wallet.safetyPoints - 2 : 0,
                creditPoints:
                  wallet.safetyPoints > 2
                    ? wallet.creditPoints + 2
                    : wallet.creditPoints,
              })
            }
          >
            <Text fontSize={"sm"} fontWeight={"bold"} color="white">
              Redeem Points
            </Text>
          </Button>
          <Button small primary>
            <Text fontSize={"sm"} fontWeight={"bold"} color="white">
              View History
            </Text>
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Balance;
