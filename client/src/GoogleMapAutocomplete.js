import React, { useState, useEffect } from "react";
import { Autocomplete } from "@react-google-maps/api";
import Form from "react-bootstrap/Form";

const GoogleMapAutocomplete = ({
  onPlaceSelected,
  defaultValue,
  addressComponent,
}) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [apiReady, setApiReady] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    let intervalId;

    if (window.googleMapsApiIsReady) {
      setApiReady(true);
    } else {
      intervalId = setInterval(() => {
        if (window.googleMapsApiIsReady) {
          setApiReady(true);
          clearInterval(intervalId);
        }
      }, 100);
    }
    // Clean up interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [apiReady]);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  const onLoad = (autoC) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();

      let desiredAddressValue = "";
      if (addressComponent === "street_number_and_route") {
        const streetNumber = place.address_components.find((component) =>
          component.types.includes("street_number")
        );
        const streetName = place.address_components.find((component) =>
          component.types.includes("route")
        );
        desiredAddressValue = `${streetNumber ? streetNumber.long_name : ""} ${
          streetName ? streetName.long_name : ""
        }`.trim();
      } else {
        const desiredAddressComponent = place.address_components.find(
          (component) => component.types.includes(addressComponent)
        );
        desiredAddressValue = desiredAddressComponent
          ? desiredAddressComponent.long_name
          : "";
      }

      setInputValue(desiredAddressValue);
      onPlaceSelected(place);
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <Form.Control
        required
        type="text"
        placeholder="Enter the Location"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </Autocomplete>
  );
};

export default GoogleMapAutocomplete;
