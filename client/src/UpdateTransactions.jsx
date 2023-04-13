import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import { isAuthenticated } from "./auth";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { useParams,useHistory } from "react-router-dom";

const UpdateTransactions = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [validated, setValidated] = useState(false);
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
  const history = useHistory();

  const [formValues, setFormValues] = useState({
    mls_vendor: "",
    mls_number: "",
    street_address: "",
    city: "",
    state: "",
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
    const transactionId = useParams().id;
    console.log("Id is"+transactionId);
  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
    console.log(formValues);
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
        console.log(id);
      } catch (error) {
        console.log(error.response.data);
        setErrorMessage(error.response.data.error);
      }
    };
    fetchUser();
  }, []);
  useEffect(() => {
    // Fetch the current user's information and update the form fields
    
      axios
      .get(`http://localhost:8000/transaction/show/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFormValues(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data.error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    axios
      .put(`http://localhost:8000/transaction/update/${transactionId}`, formValues, {
        headers: { Authorization: `Bearer ${token}` }, // send the token through the headers
      })
      .then((response) => {
        console.log(response);
        setSuccessMessage("Transaction updated successfully");
        history.push("/show-transactions");
      })
      .catch((error) => {
        console.log(error.response.data);
        setErrorMessage(error.response.data.error);

      });
    
  };
  const handleMakeMeTheAgent = () => {
    setFormValues({
      ...formValues,
      buyer_agent_email: email,
      buyer_agent_name: name,
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
        <Form.Group as={Col} md="4" name="state">
          <Form.Label>State</Form.Label>
          <Form.Select
            onChange={handleChange}
            className="mt-2 mb-2"
            value={formValues.state}
            name="state"
          >
            <option>Select State</option>
            {statenames.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
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
          controlId="validationCustom03"
          className="mt-2 mb-2"
        >
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="City"
            value={formValues.city}
            name="city"
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group
          as={Col}
          md="4"
          controlId="validationCustom02"
          className="mt-2 mb-2"
        >
          <Form.Label>Street Address</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Street Address"
            value={formValues.street_address}
            name="street_address"
            onChange={handleChange}
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
            value={formValues.closing_date.slice(0, 10)}
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
            value={formValues.deadline_after_emd_accepted.slice(0, 10)}
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
      <Row className="mb-3 ">
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
          />
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
          />
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
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Phone nO.
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
          />
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
          Update
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
      {transactionForm()}
    </Layout>
  );
};

export default UpdateTransactions;
