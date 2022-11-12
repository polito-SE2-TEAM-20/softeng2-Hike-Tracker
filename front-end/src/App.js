import React from 'react'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'

import BrowseHikes from './browse-hikes/BrowseHikes'
import ListOfHikes from './routes/list-of-hikes/ListOfHikes';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/listofhikes" element={<ListOfHikes />} />
        <Route path="/browsehikes" element={<BrowseHikes />} />
      </Routes>
    </BrowserRouter >
  );
}

export default App;
