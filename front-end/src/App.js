import React from 'react'
import { useState } from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'

import MainTitle from './components/main-title/MainTitle'
import MainPageLandscape from './components/main-page-landscape/MainPageLandscape';
import Button from './components/buttons/Button';
import { Row, Col, Container } from 'react-bootstrap'
import ListElement from './components/list-element/ListElement';
import { Map } from './components/map/Map';
import BrowseHikes from './browse-hikes/BrowseHikes'
import SearchBar from './components/searchbar/SearchBar'

import {
  BrowserRouter as Router,
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
    <BrowseHikes />
  );
}

export default App;
