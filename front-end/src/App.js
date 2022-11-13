import React from 'react'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'

import BrowseHikes from './routes/browse-hikes/BrowseHikes.js'
import ListOfHikes from './routes/list-of-hikes/ListOfHikes.js';
import SingleHike from './components/single-hike/SingleHike.js';


import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LoginForm } from './Login/Login';
import API_Login from './Login/API_Login';
import API_NewHike from './NewHike/API_Newhike';
import  FileUploader from './NewHike/addGpx';
import  {FormNewHike} from './NewHike/FormNewHike';
import {LocalGuide} from './Visuals/localGuide';
import {NavigationBar} from './Visuals/Navbar'
import {SignUp} from './SignUp/SignUp'
import API_SignUp from './SignUp/API_SignUp';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from './components/navbar/Navbar';

function App() {
  return (
    <BrowserRouter>
      <App2 />
    </BrowserRouter>
  )
}

function App2() {

   
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const doLogIn = (credentials, setShow, setErrorMessage) => {
    API_Login.logIn(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        setShow(false);
        console.log(user);
        navigate('/');
        //if user.role==...

      })
      .catch(err => {
        console.log(err);
        setShow(true);
        setErrorMessage(err);
      }
      )
  }

  const doLogOut = async () => {
    await API_Login.logOut();
    setLoggedIn(false);
    setUser({});
    console.log(user);
    console.log(localStorage);
    navigate('/');
  }

  const doRegister = (credentials, setShow, setErrorMessage) => {
    API_SignUp.signUp(credentials)
      .then(user => {
        setShow(false);
        console.log(user);
        navigate('/login');
        console.log(credentials.role);
        
      })
      .catch(err => {
        console.log(err);

        console.log(credentials.role);
        setShow(true);
        setErrorMessage(err);
      }
      )
  }

  function addHike(hike){
    API_NewHike.addHike(hike)
      .then(()=>{})
      .catch(err => console.log(err));
  }

  const addNewGpx = async (formData) => {
    try {
      const newH = await API_NewHike.addNewGpx(formData);
      console.log(newH);
    }  catch (err) {
      throw err;
      //setMessage({msg: err, type: 'danger'});
    }
  }

  return (
    <>
      <Routes>
        <Route path="/listofhikes" element={<ListOfHikes />} />
        <Route path="/browsehikes" element={<BrowseHikes />} />
        <Route path="/singlehike" element={<SingleHike />} />
        <Route path="/login" element={<LoginForm login={doLogIn} user={user} logout={doLogOut} />} />
        <Route path="/newHike2" element ={<FileUploader addNewGpx={addNewGpx}/>}/>
        <Route path="/newHike" element ={<FormNewHike addHike={addHike}/>}/>
        <Route path="/localGuide" element ={<LocalGuide />}/>
        <Route path ="/navbar" element = {<NavigationBar user={user} />}/>
        <Route path="/register" element={<SignUp doRegister={doRegister}/>}/>
      </Routes>
    </>
  );
}

export default App;

