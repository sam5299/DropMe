import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { Select } from "native-base";
import axios from "axios";

const Vehicle = () => {
  const [service, setService] = useState("");
  const [services, setServices] = useState([]);

  useEffect(async () => {
    try {
      const list = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setServices(list.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Select
      w="175"
      selectedValue={service}
      accessibilityLabel="Select Vehicle"
      placeholder="Select Vehicle "
      onValueChange={(itemValue) => setService(itemValue)}
    >
      {services.map((item) => (
        <Select.Item
          key={item.id}
          label={item.username}
          value={item.username}
        />
      ))}
    </Select>
  );
};

export default Vehicle;
