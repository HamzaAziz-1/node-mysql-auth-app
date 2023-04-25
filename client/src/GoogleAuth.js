import React, { useEffect } from 'react';

const GoogleApiButtons = () => {
  useEffect(() => {
    // Initialization and configuration
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
        document.getElementById("signout_button").style.visibility = "visible";
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

    async function listConnectionNames() {
      let response;
      try {
        response = await window.gapi.client.people.people.connections.list({
          resourceName: "people/me",
          pageSize: 1000,
          personFields: "names,emailAddresses,phoneNumbers,addresses",
        });
      } catch (err) {
        document.getElementById("content").innerText = err.message;
        return;
      }
      const connections = response.result.connections;
      console.log(connections);
      if (!connections || connections.length === 0) {
        document.getElementById("content").innerText = "No connections found.";
        return;
      }

      // Flatten to string to display
      const output = connections.reduce((str, person) => {
        if (!person.names || person.names.length === 0) {
          return `${str}Missing display name\n`;
        }
        return `${str}${person.names[0].displayName}\n`;
      }, "Connections:\n");
      document.getElementById("content").innerText = output;
    }
  }, []);

  return (
    <div>
      <p>People API Quickstart</p>

      {/* Render the buttons as React elements */}
      <button id="authorize_button" onClick={() => window.handleAuthClick()}>
        Authorize
      </button>
      <button id="signout_button" onClick={() => window.handleSignoutClick()}>
        Sign Out
      </button>

      <pre id="content" style={{ whiteSpace: "pre-wrap" }}></pre>
    </div>
  );
};

export default GoogleApiButtons;

