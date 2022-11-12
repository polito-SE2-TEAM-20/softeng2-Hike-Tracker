import React from 'react'
import { useState } from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'

import MainTitle from './components/main-title/MainTitle'
import MainPageLandscape from './components/main-page-landscape/MainPageLandscape';
import Button from './components/buttons/Button';
import { Row, Col, Container } from 'react-bootstrap'
import { Map } from './components/map/Map';
import BrowseHikes from './browse-hikes/BrowseHikes'
import SearchBar from './components/searchbar/SearchBar'
import ListOfHikes from './list-of-hikes/ListOfHikes';

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useRouteMatch,
  useParams,
  Navigate,
  useNavigate
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
