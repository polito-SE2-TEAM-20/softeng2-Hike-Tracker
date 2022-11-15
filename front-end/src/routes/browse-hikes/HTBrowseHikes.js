import React, { useEffect, useState } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'
import './browse-hikes-style.css'

import MainTitle from '../../components/main-title/MainTitle'
import HTButton from '../../components/buttons/Button'
import { Row, Container } from 'react-bootstrap'
import { MapBrowseHike } from '../../components/map/MapBrowseHike';
import SearchBar from '../../components/searchbar/SearchBar';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router';
import BH_API from './BH-API';
import LOH_API from '../list-of-hikes/LOH-API';
import { Grid } from '@mui/material';
import HTNavbar from '../../components/HTNavbar/HTNavbar';

const HTBrowseHikes = (props) => {
  const navigate = useNavigate()
  const [listOfHikes, setListOfHikes] = useState([])
  const gotoHome = () => {
    navigate("/", { replace: false })
  }
  const gotoLogin = () => {
    navigate("/login", { replace: false })
  }

  useEffect(() => {
    var loh = []
    const getHikes = async () => {
      loh = await LOH_API.getListOfHikes()
    }
    getHikes().then(() => {
      console.log(loh)
      setListOfHikes(loh)
    });
  }, [])

  return (
    <Grid container spacing={0}>
      <HTNavbar isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} />
      <Grid item xs={8}>
        <MapBrowseHike />
      </Grid>
    </Grid>
  );
}

export default HTBrowseHikes;
