import MainTitle from '../../components/main-title/MainTitle'
import Button from '../../components/buttons/Button';
import { Row, Col, Container } from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from "react-router-dom";
import MainPageLandscape from '../../components/main-page-landscape/MainPageLandscape';
import { useState } from 'react';

import { Grid } from '@mui/material';
import {Typography} from '@mui/material';
import HTButton from '../../components/buttons/Button';
import HTNavbar from '../../components/HTNavbar/HTNavbar'

const HTMainPage = (props) => {
    const navigate = useNavigate()

    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    const gotoSignup = () => {
        navigate("/signup", { replace: false })
    }

    const gotoBrowseHikes = () => {
        navigate("/browsehikes", { replace: false })
    }

    const gotoListOfHikes = () => {
        navigate("/listofhikes", { replace: false })
    }

    const gotoHome = () => {
        navigate("/", { replace: false })
    }

    return (
        <Grid container spacing={0}>
            <HTNavbar />
            <Grid item xs={12}>
                <Typography
                    variant="h2"
                    noWrap className="unselectable"
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: "Crimson Text, serif",
                        fontWeight: 700, justifyContent: "center",
                        textAlign: "center",
                        color: '#1a1a1a',
                        textDecoration: 'none',
                    }}
                >
                    where will your next adventure be?
                </Typography>
                <Typography
                    variant="h4"
                    noWrap className="unselectable"
                    sx={{
                        display: { xs: 'flex', md: 'none' },
                        fontFamily: "Crimson Text, serif",
                        fontWeight: 700, justifyContent: "center",
                        textAlign: "center",
                        color: '#1a1a1a',
                        textDecoration: 'none',
                    }}
                >
                    where will <br /> your next <br /> adventure be?
                </Typography>
            </Grid>
        </Grid >
    );
}

export default HTMainPage