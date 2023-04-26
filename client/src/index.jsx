import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Myroutes from './Myroutes';
import "bootstrap/dist/css/bootstrap.min.css";
window.googleMapsApiIsReady = false;

function initGoogleMapsApi() {
  window.googleMapsApiIsReady = true;
}

window.initGoogleMapsApi = initGoogleMapsApi;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Myroutes />
    </BrowserRouter>
  
);

