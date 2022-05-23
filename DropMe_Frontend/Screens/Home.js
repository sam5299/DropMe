import React from "react";
import BottomBar from "../Component/BottomBar";
import { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { AuthContext } from "../Component/Context";

const Home = () => {
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();
  const socket = io.connect(url);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("Home useffect called");
      // alert(data.message);
      console.log("data come:", data);
      if (data.tripRideObj) {
        console.log("tripRideId present in home.js");
      }
      toast.show({
        render: () => {
          return (
            <Box bg="green.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>{data.message}</Text>
            </Box>
          );
        },
        placement: "top",
      });
    });

    //check if data has tripRideId and if yes then show the Rating modal
  }, [socket]);
  return (
    <>
      <BottomBar />
    </>
  );
};

export default Home;
