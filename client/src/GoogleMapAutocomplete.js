import React, { useState,useEffect } from "react";
import { Autocomplete } from "@react-google-maps/api";
import Form from "react-bootstrap/Form";

const GoogleMapAutocomplete = ({ onPlaceSelected, defaultValue }) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [apiReady, setApiReady] = useState(false);

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

  const onLoad = (autoC) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      onPlaceSelected(autocomplete.getPlace());
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  return (
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={onPlaceChanged}
      defaultValue={defaultValue}
    >
      <Form.Control
        required
        type="text"
        placeholder="Enter the Location"
        defaultValue={defaultValue}
      />
    </Autocomplete>
  );
};

export default GoogleMapAutocomplete;
