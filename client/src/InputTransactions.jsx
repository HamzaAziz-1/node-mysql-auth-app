import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import { isAuthenticated } from "./auth";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { useHistory } from "react-router-dom";
import GoogleMapAutocomplete from "./GoogleMapAutocomplete";

const InputTransactions = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [validated, setValidated] = useState(false);
  const [contacts, setContacts] = useState([]);
  const history = useHistory();
  const statenames = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];
  const [formValues, setFormValues] = useState({
    mls_vendor: "",
    mls_number: "",
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
    property_tax_id_number: "",
    lot: "",
    block: "",
    current_sales_price: "",
    closing_date: "",
    earnest_money_company_name: "",
    earnest_money_amount: "",
    deadline_after_emd_accepted: "",
    transaction_listing_notes: "",
    buyer_agent_name: "",
    buyer_agent_email: "",
    buyer_name: "",
    buyer_email_address: "",
    buyer_phone_number: "",
    buyer_current_address: "",
    seller_transaction_coordinator_first_name: "",
    seller_transaction_coordinator_last_name: "",
    seller_transaction_coordinator_email: "",
    seller_transaction_coordinator_phone_number: "",
    title_contact_first_name: "",
    title_contact_last_name: "",
    title_contact_company: "",
    title_contact_phone_number: "",
    lender_contact_first_name: "",
    lender_contact_last_name: "",
    lender_contact_email: "",
    lender_contact_phone_number: "",
  });

  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
    
  };
  const token = isAuthenticated().token;

  useEffect(() => {
    // Fetch the current user's information and update the form fields
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { id, name, email } = response.data;

        setId(id);
        setEmail(email);
        setName(name);
      } catch (error) {
        setErrorMessage(error.response.data.error);
      }
    };

    const getContacts = () => {
      const CLIENT_ID =
        "133522538881-2j9114vn23tf58143tvn348mivgeaqjr.apps.googleusercontent.com";
      const API_KEY = "AIzaSyBuI1lYP5WFHFOOQ8y55x4AjHiafJuXSho";
      const DISCOVERY_DOC =
        "https://www.googleapis.com/discovery/v1/apis/people/v1/rest";
      const SCOPES = "https://www.googleapis.com/auth/contacts.readonly";

      let tokenClient;
      let gapiInited = false;
      let gisInited = false;

      document.getElementById("authorize_button").style.visibility = "hidden";
      document.getElementById("signout_button").style.visibility = "hidden";

      const scriptGapi = document.createElement("script");
      scriptGapi.src = "https://apis.google.com/js/api.js";
      scriptGapi.async = true;
      scriptGapi.defer = true;
      scriptGapi.onload = () => {
        window.gapi.load("client", initializeGapiClient);
      };
      document.body.appendChild(scriptGapi);
      const scriptGis = document.createElement("script");
      scriptGis.src = "https://accounts.google.com/gsi/client";
      scriptGis.async = true;
      scriptGis.defer = true;
      scriptGis.onload = gisLoaded;
      document.body.appendChild(scriptGis);

      // Functions from the original HTML code
      async function initializeGapiClient() {
        await window.gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        maybeEnableButtons();
      }

      function gisLoaded() {
        tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: "", // defined later
        });
        gisInited = true;
        maybeEnableButtons();
      }

      function maybeEnableButtons() {
        if (gapiInited && gisInited) {
          document.getElementById("authorize_button").style.visibility =
            "visible";
        }
      }

      window.handleAuthClick = () => {
        tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            throw resp;
          }
          document.getElementById("signout_button").style.visibility =
            "visible";
          document.getElementById("authorize_button").innerText = "Refresh";
          await listConnectionNames();
        };

        if (window.gapi.client.getToken() === null) {
          tokenClient.requestAccessToken({ prompt: "consent" });
        } else {
          tokenClient.requestAccessToken({ prompt: "" });
        }
      };

      window.handleSignoutClick = () => {
        const token = window.gapi.client.getToken();
        if (token !== null) {
          window.google.accounts.oauth2.revoke(token.access_token);
          window.gapi.client.setToken("");
          document.getElementById("content").innerText = "";
          document.getElementById("authorize_button").innerText = "Authorize";
          document.getElementById("signout_button").style.visibility = "hidden";
        }
      };
    };
    fetchUser();
    getContacts();
    listConnectionNames();
  }, []);

  const listConnectionNames = async () => {
    let response;
    try {
      response = await window.gapi.client.people.people.connections.list({
        resourceName: "people/me",
        pageSize: 1000,
        personFields: "names,emailAddresses,phoneNumbers,addresses",
      });
    } catch (err) {
      return;
    }
    const connections = response.result.connections;

    if (!connections || connections.length === 0) {
      return;
    }
    const contactData = connections.map((person) => {
      const name =
        person.names && person.names.length > 0
          ? person.names[0].displayName
          : "Missing display name";
      const email =
        person.emailAddresses && person.emailAddresses.length > 0
          ? person.emailAddresses[0].value
          : "No email";
      const phoneNumber =
        person.phoneNumbers && person.phoneNumbers.length > 0
          ? person.phoneNumbers[0].value
          : "No phone number";
      const address =
        person.addresses && person.addresses.length > 0
          ? person.addresses[0].value
          : "No address";

      return { name, email, phoneNumber, address };
    });

    setContacts(contactData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formValues.mls_vendor === "Select MLS Vendor") {
      setErrorMessage("Please select an MLS Vendor");
      return;
    }
    if (formValues.state === "Select State") {
      setErrorMessage("Please select a state");
      return;
    }

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    axios({
      method: "post",
      url: "http://localhost:8000/transaction/inputs",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: formValues,
    })
      .then((response) => {
        // Reset formValues
        setFormValues({
          mls_vendor: "",
          mls_number: "",
          street_address: "",
          city: "",
          state: "",
          zip_code: "",
          property_tax_id_number: "",
          lot: "",
          block: "",
          current_sales_price: "",
          closing_date: "",
          earnest_money_company_name: "",
          earnest_money_amount: "",
          deadline_after_emd_accepted: "",
          transaction_listing_notes: "",
          buyer_agent_name: "",
          buyer_agent_email: "",
          buyer_name: "",
          buyer_email_address: "",
          buyer_phone_number: "",
          buyer_current_address: "",
          seller_transaction_coordinator_first_name: "",
          seller_transaction_coordinator_last_name: "",
          seller_transaction_coordinator_email: "",
          seller_transaction_coordinator_phone_number: "",
          title_contact_first_name: "",
          title_contact_last_name: "",
          title_contact_company: "",
          title_contact_phone_number: "",
          lender_contact_first_name: "",
          lender_contact_last_name: "",
          lender_contact_email: "",
          lender_contact_phone_number: "",
        });
        setSuccessMessage("Inputs added successfully!");
        setErrorMessage("");
        history.push("/dashboard");
      })
      .catch((error) => {
        setErrorMessage(error.response.data.error);
        setSuccessMessage("");
      });
  };
  const handleMakeMeTheAgent = () => {
    setFormValues({
      ...formValues,
      buyer_agent_email: email,
      buyer_agent_name: name,
    });
  };
 const handlePlaceSelected = (place) => {
   const addressComponents = place.address_components;
   const streetNumber = addressComponents.find((component) =>
     component.types.includes("street_number")
   );
   const streetName = addressComponents.find((component) =>
     component.types.includes("route")
   );
   const city = addressComponents.find((component) =>
     component.types.includes("locality")
   );
   const state = addressComponents.find((component) =>
     component.types.includes("administrative_area_level_1")
   );
   const zipCode = addressComponents.find((component) =>
     component.types.includes("postal_code")
   );

   setFormValues({
     ...formValues,
     street_address: `${streetNumber ? streetNumber.long_name + " " : ""}${
       streetName ? streetName.long_name : ""
     }`,
     city: city ? city.long_name : "",
     state: state ? state.short_name : "",
     zip_code: zipCode ? zipCode.long_name : "",
   });
  };
  
  



  const transactionForm = () => (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Label className="text font-weight-bold">Information</Form.Label>
      <Row className="mb-3">
        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom02"
          className="mt-2 mb-2"
        >
          <Form.Label className="text">MLS Vendor</Form.Label>
          <Form.Select
            value={formValues.mls_vendor}
            onChange={handleChange}
            name="mls_vendor"
            aria-label="Default select example"
          >
            <option>Select MLS Vendor</option>
            <option value="1">HAR</option>
            <option value="2">Zillow</option>
          </Form.Select>
          {errorMessage && (
            <div style={{ color: "red" }} className="error-message">
              {errorMessage}
            </div>
          )}
        </Form.Group>
        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom01"
          className="mt-2 mb-2"
        >
          <Form.Label>MLS Number</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="MLS Number"
            value={formValues.mls_number}
            name="mls_number"
            onChange={handleChange}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustomUsername"
          className="mt-2 mb-2"
        >
          <Form.Label>Property Tax ID Number</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="text"
              placeholder="Property Tax ID Number"
              required
              name="property_tax_id_number"
              value={formValues.property_tax_id_number}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please choose a Property Tax ID Number.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group
          as={Col}
          md="3"
          controlId="validationCustom02"
          className="mt-2 mb-2"
        >
          <Form.Label>Street Address</Form.Label>
          <GoogleMapAutocomplete
            onPlaceSelected={handlePlaceSelected}
            defaultValue={formValues.street_address}
            addressComponent="street_number"
          />

          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group
          as={Col}
          md="3"
          controlId="validationCustom03"
          className="mt-2 mb-2"
        >
          <Form.Label>City</Form.Label>
          <GoogleMapAutocomplete
            onPlaceSelected={handlePlaceSelected}
            defaultValue={formValues.city}
            addressComponent="locality"
          />

          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group
          as={Col}
          md="3"
          controlId="validationCustom03"
          className="mt-2 mb-2"
        >
          <Form.Label>State</Form.Label>
          <GoogleMapAutocomplete
            onPlaceSelected={handlePlaceSelected}
            defaultValue={formValues.state}
            addressComponent="administrative_area_level_1"
          />

          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          as={Col}
          md="3"
          controlId="validationCustom02"
          className="mt-2 mb-2"
        >
          <Form.Label>Zip Code</Form.Label>
          <GoogleMapAutocomplete
            onPlaceSelected={handlePlaceSelected}
            defaultValue={formValues.zip_code}
            addressComponent="postal_code"
          />

          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Lot</Form.Label>
          <Form.Control
            type="text"
            placeholder="Lot"
            name="lot"
            value={formValues.lot}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Lot.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Block</Form.Label>
          <Form.Control
            type="text"
            placeholder="Block"
            required
            name="block"
            value={formValues.block}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Block.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <div>
        <Form.Label className="text font-weight-bold">Event Dates</Form.Label>
      </div>
      <Row className="mb-4">
        <Form.Group
          as={Col}
          md="6"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Current Sales Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Current Sales Price"
            required
            name="current_sales_price"
            value={formValues.current_sales_price}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Current Sales Price.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Closing Date</Form.Label>
          <Form.Control
            type="date"
            placeholder="Closing Date"
            name="closing_date"
            value={formValues.closing_date}
            required
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Closing Date.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <div>
        <Form.Label className="text font-weight-bold">
          Earnest Money Details
        </Form.Label>
      </div>
      <Row className="mb-3">
        <Form.Group
          as={Col}
          md="6"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Earnest Money Company Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Earnest Money Company Name"
            required
            onChange={handleChange}
            name="earnest_money_company_name"
            value={formValues.earnest_money_company_name}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Earnest Money Company Name.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustomUsername"
          className="mt-2 mb-2"
        >
          <Form.Label>Earnest money amount</Form.Label>
          <InputGroup hasValidation>
            <InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
            <Form.Control
              type="number"
              placeholder="Earnest money amount"
              name="earnest_money_amount"
              value={formValues.earnest_money_amount}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please choose Earnest money amount.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group
          as={Col}
          md="6"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Deadline After EMD Accepted</Form.Label>
          <Form.Control
            type="date"
            placeholder="Deadline After EMD Accepted"
            required
            name="deadline_after_emd_accepted"
            value={formValues.deadline_after_emd_accepted}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Deadline After EMD Accepted.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <div>
          <Form.Label className="text font-weight-bold">
            Transaction/Listing Notes
          </Form.Label>
        </div>
        <Form.Group
          as={Col}
          md="12"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Transaction Listing Notes</Form.Label>
          <Form.Control
            type="text"
            as="textarea"
            placeholder="Transaction Listing Notes"
            required
            name="transaction_listing_notes"
            value={formValues.transaction_listing_notes}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Transaction Listing Notes.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <div>
          <Form.Label className="text font-weight-bold">
            Buyer's Agent
          </Form.Label>
        </div>
        <Form.Group
          as={Col}
          md="5"
          controlId="validationCustom05"
          name="buyer_agent_email"
          value={formValues.buyer_agent_email}
          className="mt-2 mb-2"
        >
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            required
            onChange={(event) =>
              setFormValues({
                ...formValues,
                buyer_agent_email: event.target.value,
              })
            }
            value={formValues.buyer_agent_email}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Email.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          as={Col}
          md="5"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Name"
            required
            name="buyer_agent_name"
            onChange={(event) =>
              setFormValues({
                ...formValues,
                buyer_agent_name: event.target.value,
              })
            }
            value={formValues.buyer_agent_name}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Name.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <div className="text-center">
        <Button variant="outline-success" onClick={handleMakeMeTheAgent}>
          Make me the agent
        </Button>
      </div>
      <Row className="mb-3">
        <div>
          <Form.Label className="text font-weight-bold">Buyer</Form.Label>
        </div>

        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Name"
            required
            name="buyer_name"
            value={formValues.buyer_name}
            onChange={handleChange}
            list="name-datalist"
          />
          <datalist id="name-datalist">
            {contacts.map((contact, index) => (
              <option key={index} value={contact.name} />
            ))}
          </datalist>
          <Form.Control.Feedback type="invalid">
            Please provide a valid Name.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            required
            name="buyer_email_address"
            value={formValues.buyer_email_address}
            onChange={handleChange}
            list="email-datalist"
          />
          <datalist id="email-datalist">
            {contacts.map((contact, index) => (
              <option key={index} value={contact.email} />
            ))}
          </datalist>
          <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Phone No</Form.Label>
          <Form.Control
            type="text"
            placeholder="Phone No"
            required
            name="buyer_phone_number"
            value={formValues.buyer_phone_number}
            onChange={handleChange}
            list="phone-datalist"
          />
          <datalist id="phone-datalist">
            {contacts.map((contact, index) => (
              <option key={index} value={contact.phoneNumber} />
            ))}
          </datalist>
          <Form.Control.Feedback type="invalid">
            Please provide a valid Phone No.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Current Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Current Address"
            required
            name="buyer_current_address"
            value={formValues.buyer_current_address}
            onChange={handleChange}
            list="address-datalist"
          />
          <datalist id="address-datalist">
            {contacts.map((contact, index) => (
              <option key={index} value={contact.address} />
            ))}
          </datalist>
          <Form.Control.Feedback type="invalid">
            Please provide a valid Current Address.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row className="mb-3 ">
        <div>
          <Form.Label className="text font-weight-bold">
            Seller's Transaction Coordinator
          </Form.Label>
        </div>

        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="First Name"
            required
            name="seller_transaction_coordinator_first_name"
            value={formValues.seller_transaction_coordinator_first_name}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid First Name.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Last Name"
            required
            name="seller_transaction_coordinator_last_name"
            value={formValues.seller_transaction_coordinator_last_name}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Last Name.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Name"
            required
            name="seller_transaction_coordinator_email"
            value={formValues.seller_transaction_coordinator_email}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Phone Number"
            required
            name="seller_transaction_coordinator_phone_number"
            value={formValues.seller_transaction_coordinator_phone_number}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Phone Number.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3 ">
        <div>
          <Form.Label className="text font-weight-bold">
            Title Contact
          </Form.Label>
        </div>

        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="First Name"
            required
            name="title_contact_first_name"
            value={formValues.title_contact_first_name}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid First Name.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Last Name"
            required
            name="title_contact_last_name"
            value={formValues.title_contact_last_name}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Last Name.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Company</Form.Label>
          <Form.Control
            type="text"
            placeholder="Company"
            required
            name="title_contact_company"
            value={formValues.title_contact_company}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Company.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Phone Number"
            required
            name="title_contact_phone_number"
            value={formValues.title_contact_phone_number}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Phone Number.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3 ">
        <div>
          <Form.Label className="text font-weight-bold">
            Lender Contact
          </Form.Label>
        </div>

        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="First Name"
            required
            name="lender_contact_first_name"
            value={formValues.lender_contact_first_name}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid First Name.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Last Name"
            required
            name="lender_contact_last_name"
            value={formValues.lender_contact_last_name}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Last Name.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            required
            name="lender_contact_email"
            value={formValues.lender_contact_email}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Email.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom05"
          className="mt-2 mb-2"
        >
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Phone Number"
            required
            name="lender_contact_phone_number"
            value={formValues.lender_contact_phone_number}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Phone Number.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <div className="text-center mt-5 mb-5">
        <Button variant="dark" type="submit">
          Submit
        </Button>
      </div>

      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
    </Form>
  );

  return (
    <Layout
      title="Add Inputs Page"
      description="Add the inputs"
      className="container col-md-8 offset-md-2"
    >
      {/* {updateForm()} */}
      <div>
        <p>Get Your Contacts from Google</p>

        {/* Render the buttons as React elements */}
        <Button id="authorize_button" onClick={() => window.handleAuthClick()}>
          Authorize
        </Button>
        <Button id="signout_button" onClick={() => window.handleSignoutClick()}>
          Sign Out
        </Button>

        <pre id="content" style={{ whiteSpace: "pre-wrap" }}></pre>
      </div>

      {transactionForm()}
    </Layout>
  );
};

export default InputTransactions;
