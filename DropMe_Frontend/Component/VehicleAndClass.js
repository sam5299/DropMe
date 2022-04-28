// Vehicle, Vehicle Class and Vehicle Type

import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { Box, Select, Slider } from "native-base";
import axios from "axios";

const VehicleAndClass = ({ dispatch }) => {
  const [vehicles, setVehicles] = useState([]);
  const [service, setService] = useState("");
  const [vehicleClass, setVehicleClass] = useState("");
  const [capacity, setCapacity] = useState(2);

  const vehicleCapacity = (v) => {
    const seats = Math.floor(v);
    setCapacity(seats);
    dispatch({ type: "vehicleSeats", payload: seats });
  };

  useEffect(async () => {
    try {
      const list = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setVehicles(list.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Box>
      <Box mt={5} ml={3} alignItems="center" justifyContent="center">
        <Select
          mr="1"
          w="100%"
          selectedValue={service}
          accessibilityLabel="Select Vehicle"
          placeholder="Select Vehicle "
          onValueChange={(itemValue) => {
            setService(itemValue);
            dispatch({ type: "vehicle", payload: itemValue });
            dispatch({ type: "vehicleClass", payload: "XUV" });
          }}
        >
          <Select.Item shadow={2} label="Select Vehicle" disabled={true} />
          {vehicles.map((item) => (
            <Select.Item
              shadow={2}
              key={item.id}
              label={item.username}
              value={item.username}
            />
          ))}
        </Select>
      </Box>
      <Box mt={5} alignItems={"center"}>
        <Text textAlign="center">Available Seats: {capacity}</Text>
        <Slider
          isDisabled={false}
          mt={"2"}
          w="300"
          maxW="300"
          defaultValue={0}
          minValue={0}
          maxValue={8}
          accessibilityLabel="Available Seats"
          step={1}
          onChange={(v) => {
            vehicleCapacity(v);
          }}
        >
          <Slider.Track>
            <Slider.FilledTrack />
          </Slider.Track>
          <Slider.Thumb />
        </Slider>
      </Box>
    </Box>
  );
};

export default VehicleAndClass;
