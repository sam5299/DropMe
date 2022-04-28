// Vehicle, Vehicle Class and Vehicle Type

import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { Box, Select } from "native-base";
import axios from "axios";

const VehicleAndClass = ({ dispatch }) => {
  const [vehicles, setVehicles] = useState([]);
  const [service, setService] = useState("");
  const [vehicleClass, setVehicleClass] = useState("");
  const [capacity, setCapacity] = useState(0);

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
      <Box flexDirection="row" mt={5} ml={3} justifyContent="space-between">
        <Select
          w="175"
          selectedValue={service}
          accessibilityLabel="Select Vehicle"
          placeholder="Select Vehicle "
          onValueChange={(itemValue) => {
            setService(itemValue);
            dispatch({ type: "vehicle", payload: itemValue });
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
        <Select
          mr={1}
          w="175"
          selectedValue={vehicleClass}
          accessibilityLabel="Select Vehicle Class"
          placeholder="Select Vehicle Class "
          onValueChange={(itemValue) => {
            setVehicleClass(itemValue);
            dispatch({ type: "vehicleClass", payload: itemValue });
          }}
        >
          <Select.Item
            shadow={2}
            label="Select Vehicle Class"
            disabled={true}
          />
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
      <Box mt={5} ml={3} mr="2">
        <Select
          selectedValue={capacity}
          w="100%"
          accessibilityLabel="Select Capacity"
          placeholder="Select Capacity"
          onValueChange={(itemValue) => {
            setCapacity(itemValue);
            dispatch({ type: "vehicleCapacity", payload: itemValue });
          }}
        >
          <Select.Item shadow={2} label="Select Capacity" disabled={true} />
          <Select.Item shadow={2} label="1" value="1" />
          <Select.Item shadow={2} label="2" value="2" />
          <Select.Item shadow={2} label="3" value="3" />
          <Select.Item shadow={2} label="4" value="4" />
          <Select.Item shadow={2} label="5" value="5" />
        </Select>
      </Box>
    </Box>
  );
};

export default VehicleAndClass;
