import React, { useEffect, useState } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'
import './browse-hikes-style.css'

import { MapBrowseHike } from '../../components/map/MapBrowseHike';
import { useNavigate } from 'react-router';
import LOH_API from '../list-of-hikes/LOH-API';
import { Grid } from '@mui/material';
import HTNavbar from '../../components/HTNavbar/HTNavbar';

const HTBrowseHikes = (props) => {
  const navigate = useNavigate()
  const [listOfHikes, setListOfHikes] = useState([])
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
    <Grid container spacing={0} sx={{ backgroundColor: "#f2f2f2", minHeight: "100vh", height: "100%", minWidth: "100vw", width: "100%" }}>
      <HTNavbar isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} />
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <MapBrowseHike />
      </Grid>
    </Grid>
  );
}

export default HTBrowseHikes;
