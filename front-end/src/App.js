import React from 'react'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'

import HTBrowseHikes from './routes/browse-hikes/HTBrowseHikes.js'
import SingleHike from './components/single-hike/SingleHike.js';
import HTMainPage from './routes/main-page/HTMainPage';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LocalGuide } from './Visuals/localGuide';
import { NavigationBar } from './Visuals/Navbar'
import HTListOfHikes from './routes/list-of-hikes/HTListOfHikes';
import { HTAddHike } from './NewHike/HTAddHike';
import { NewHutForm } from './NewHut/NewHut';
import { NewParking } from './NewParkingLot/NewParking';
import HTListOfHuts from './routes/list-of-huts/HTListOfHuts'
import ShowHut from './routes/show-hut/ShowHut'

import { NewHikeStEnd } from './NewHike/NewHikeStEnd';

import LoginForm from './Login/Login';
import {SignUpForm} from './SignUp/SignUp';
import HTHutPage from './routes/hut-page/HTHutPage';

import API from './API/API';



import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import ShowHike from './routes/show-hike/ShowHike';
import API_NewParking from './NewParkingLot/API_NewParkingLot';
import { MyHutsPage } from './routes/hut/MyHutsPage';
import { MyHikesPage } from './routes/my-hikes/MyHikesPage';

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
    API.logIn(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        setShow(false);
        navigate('/')
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
    await API.logOut();
    localStorage.clear();
    setLoggedIn(false);
    setUser({});
    setRole();
    navigate('/');
  }

  const doRegister = (credentials, setShow, setErrorMessage, setInformationMessage, setShowInformation) => {
    API.signUp(credentials)
      .then(user => {
        setShow(false);
        setShowInformation(true);
        console.log(user);
        setInformationMessage("Check your email to validate your account, then you can login");

        //navigate('/login');
      })
      .catch(err => {
        console.log(err);

        console.log(credentials.role);
        setShow(true);
        setErrorMessage(err);
      }
      )
   }

   const addNewHut =(hut, setShow, setErrorMessage) =>{
    API.addNewHut(hut)
       .then(newHut => {
        setShow(false);
        console.log(newHut);
       })
       .catch(err=>{
        setShow(true);
        setErrorMessage(err);
       })
   }


  return (
    <>
      <Routes>
        <Route path="/" element={<HTMainPage user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} navigate={navigate}/>} />
        <Route path="/listofhikes" element={<HTListOfHikes user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
        <Route path="/listofhuts" element={<HTListOfHuts user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
        <Route path="/browsehikes" element={<HTBrowseHikes user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
        <Route path="/singlehike" element={<SingleHike user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
        <Route path="/navbar" element={<NavigationBar user={user} />} />
        <Route path="/login" element={<LoginForm login={doLogIn} user={user} logout={doLogOut}/>} />
        <Route path="/newHike" element={<HTAddHike addNewGpx={API.addNewGpx} isLoggedIn={loggedIn} doLogOut={doLogOut} user={user}/>} />
        <Route path="/signup" element={<SignUpForm doRegister={doRegister} />} />
        <Route path="/hutpage" element={<HTHutPage isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
        <Route path="/newHut" element={<NewHutForm isLoggedIn={loggedIn} doLogOut={doLogOut} addNewHut={addNewHut}/>}/>
        <Route path="/myHuts" element={<MyHutsPage isLoggedIn={loggedIn} doLogOut={doLogOut}/>}/>
        <Route path="/myHikes" element={<MyHikesPage user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />}/>
        <Route path="/showhike/:hikeid" element={<ShowHike user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />}/>
        <Route path="/showhut/:hutid" element={<ShowHut user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />}/>
        <Route path="/newParking" element={<NewParking isLoggedIn={loggedIn} doLogOut={doLogOut} addNewParkingLot={API.addNewParkingLot}/>}/>
        <Route path="/newHikeStEnd" element={<NewHikeStEnd addNewGpx={API.addNewGpx} isLoggedIn={loggedIn} doLogOut={doLogOut} user={user}/>} />
      </Routes>
    </>
  );
}

export default App;


