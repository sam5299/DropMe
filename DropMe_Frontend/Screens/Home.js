import React from "react";
import BottomBar from "../Component/BottomBar";
import { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { AuthContext } from "../Component/Context";
import { Modal, Text } from "native-base";
import AcceptRating from "./AcceptRating";
import RideCompleted from "./RideCompletedForHome";

const Home = () => {
  const { getUrl } = useContext(AuthContext);

  // const url = getUrl();
  // const socket = io.connect("http://192.168.43.195:3100");
  //defining states for rating
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState({});

  return (
    <>
      <BottomBar />
    </>
  );
};

export default Home;
