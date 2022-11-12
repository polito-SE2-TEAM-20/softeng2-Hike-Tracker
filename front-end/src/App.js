import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { LoginForm } from './Login/Login';
import API_Login from './Login/API_Login';
import { useState } from 'react';

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


  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginForm login={doLogIn} user={user} logout={doLogOut} />} />
      </Routes>
    </div>
  );
}


export default App;
