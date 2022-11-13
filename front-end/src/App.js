import React from 'react'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'

import BrowseHikes from './routes/browse-hikes/BrowseHikes.js'
import ListOfHikes from './routes/list-of-hikes/ListOfHikes.js';
import SingleHike from './components/single-hike/SingleHike.js';
import MainPage from './routes/main-page/MainPage';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from './components/navbar/Navbar';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/listofhikes" element={<ListOfHikes />} />
        <Route path="/browsehikes" element={<BrowseHikes />} />
        <Route path="/singlehike" element={<SingleHike />} />
      </Routes>
    </BrowserRouter >
  );
}

export default App;
