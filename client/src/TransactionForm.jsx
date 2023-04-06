import React, { useState } from "react";
import axios from "axios";

const TransactionForm = () => {
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

  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("/inputs", formValues)
      .then((response) => {
        console.log(response.data);
        // Reset formValues
        setFormValues({
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Inputs for each field */}
      <label>
        MLS Vendor:
        <input
          type="text"
          name="mls_vendor"
          value={formValues.mls_vendor}
          onChange={handleChange}
        />
      </label>
      {/* ...more inputs for the other fields... */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default TransactionForm;
