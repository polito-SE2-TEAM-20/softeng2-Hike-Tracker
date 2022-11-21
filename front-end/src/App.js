import React from 'react'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'

import HTBrowseHikes from './routes/browse-hikes/HTBrowseHikes.js'
import HTListOfHikes from './routes/list-of-hikes/ListOfHikes.js';
import SingleHike from './components/single-hike/SingleHike.js';
import HTMainPage from './routes/main-page/HTMainPage';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API_Login from './Login/API_Login';
import API_NewHike from './NewHike/API_Newhike';
import { LocalGuide } from './Visuals/localGuide';
import { NavigationBar } from './Visuals/Navbar'
import API_SignUp from './SignUp/API_SignUp';

// import { AddHike } from './NewHike/proveAddHike';

import { AddHike } from './NewHike/AddHike';

import LoginForm from './Login/Login';
import {SignUpForm} from './SignUp/SignUp';
import HTHutPage from './routes/hut-page/HTHutPage';


import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

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
  const [role, setRole] = useState();
  const navigate = useNavigate();

  useEffect(()=>{
    if(localStorage.length!==0){
      setLoggedIn(true);
      setUser(JSON.parse(localStorage.getItem('user')));
    }
  }, []);


  const doLogIn = (credentials, setShow, setErrorMessage) => {
    API_Login.logIn(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        setShow(false);
        if(user.user.role === 0){
          navigate('/browsehikes')
        }else if(user.user.role=== 2){
          navigate('/localGuide');
        }
        setRole(user.user.role);
      })
      .catch(err => {
        console.log(err);
        setShow(true);
        setErrorMessage(err);
      }
      )
  }


  const doLogOut = async (returnToHome="true") => {
    await API_Login.logOut();
    setLoggedIn(false);
    setUser({});
    setRole();
    navigate('/');
  }

  const doRegister = (credentials, setShow, setErrorMessage) => {
    API_SignUp.signUp(credentials)
      .then(user => {
        setShow(false);
        console.log(user);
        navigate('/login');

      })
      .catch(err => {
        console.log(err);

        console.log(credentials.role);
        setShow(true);
        setErrorMessage(err);
      }
      )
  }
{/*
  const addNewGpx = async (formData, hike) => {
    try {
      API_NewHike.addNewGpx(formData)
        .then((newHike) => {
          console.log((newHike));
          console.log((newHike.gpxPath));
          API_NewHike.addHike({ id: newHike.id, ...hike })
            .then(() => { })
            .catch(err => { throw err })
        })
    } catch (err) {
      throw err;
      //setMessage({msg: err, type: 'danger'});
    }
  }
*/}

const addNewGpx = (formData) =>{
  API_NewHike.addNewGpx(formData)
    .then((newHike) =>{
      console.log(newHike);
    })
    .catch((err) => {
      throw err;
    });
}


  return (
    <>
      <Routes>
        <Route path="/" element={<HTMainPage user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} navigate={navigate}/>} />
        <Route path="/listofhikes" element={<HTListOfHikes user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
        <Route path="/browsehikes" element={<HTBrowseHikes user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
        <Route path="/singlehike" element={<SingleHike />} />
        <Route path="/localGuide" element={<LocalGuide isLoggedIn={loggedIn} doLogOut={doLogOut} user={user}/>} />
        <Route path="/navbar" element={<NavigationBar user={user} />} />
        <Route path="/login" element={<LoginForm login={doLogIn} user={user} logout={doLogOut}/>} />
        {/*<Route path="/hikeGpx" element={<AddHike addNewGpx={addNewGpx} isLoggedIn={loggedIn} doLogOut={doLogOut} user={user}/>} />*/}
        <Route path="/hikeGpx" element={<AddHike addNewGpx={addNewGpx} isLoggedIn={loggedIn} doLogOut={doLogOut} user={user}/>} />
        <Route path="/signup" element={<SignUpForm doRegister={doRegister} />} />
        <Route path="/hutpage" element={<HTHutPage isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
      </Routes>
    </>
  );
}

export default App;


