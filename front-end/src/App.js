import React from 'react'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'
import HTBrowseHikes from './routes/browse-hikes/HTBrowseHikes.js'
import HTMainPage from './routes/main-page/HTMainPage';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HTListOfHikes from './routes/list-of-hikes/HTListOfHikes';
import { NewHutForm } from './NewHut/NewHut';
import { NewParking } from './NewParkingLot/NewParking';
import HTListOfHuts from './routes/list-of-huts/HTListOfHuts'
import ShowHut from './routes/show-hut/ShowHut'
import { EditHut } from './routes/edit-hut/EditHut'
import { NewHikeStEnd } from './NewHike/NewHikeStEnd';
import LoginForm from './routes/login/Login';
import { SignUpForm } from './routes/sign-up/SignUp';
import { HutWorkerHuts } from './routes/my-huts/HutWorkerHuts';
import { HikesLinked } from './routes/my-huts/HikesLinked';
import { HikeCondition } from './routes/my-huts/HikeConditionC';
import WeatherAlertHike from './routes/new-weather-alert-hike/WeatherAlertHike';
import WeatherAlertMap from './routes/new-weather-alert-map/WeatherAlertMap';
import HikerPerformance from './routes/hiker-performance/HikerPerformance';
import SavedHikes from './routes/saved-hikes/SavedHikes';
import { PopupUnfinishedHike } from './components/PopupUnfinishedHike/PopupUnfinishedHike';


import API from './API/API';
import {
	BrowserRouter,
	Routes,
	Route,
} from "react-router-dom";
import ShowHike from './routes/show-hike/ShowHike';
import { MyHikesPage } from './routes/my-hikes/MyHikesPage';
import { EditHikePage } from './routes/EditHike/EditHikePage';
import HikerDashboard from './routes/hiker-dashboard/HikerDashboard';
import AdminDashboard from './routes/admin-dashboard/AdminDashboard';
import { TrackingHikePage } from './routes/TrackHike/TrackHikePage';
import HTNavbar from './components/HTNavbar/HTNavbar';
import { HikerHikesPage } from './routes/HikerHikes/HikerHikesPage';
import WeatherAlertHikeEditStatus from './routes/new-weather-alert-hike/WeatherAlertHikeEditStatus';
import FriendTracking from './routes/friend-tracking/FriendTracking';
import Unauthorized from './routes/unauthorized/Unauthorized';
import VerifyKey from './components/share-hike/VerifyKey';
import { AlertPopup } from './components/alert-popup/AlertPopup';
import { UserRoles } from './lib/common/UserRoles';

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
	const [rowsAffected, setRowsAffected] = useState(false);
	const [hikeIDs, setHikeIDs] = useState([]);
	const [open, setOpen] = useState(false);
	const [started, setStarted] = useState(false);
	const [update, setUpdate] = useState(false);
	const [unfinishedAlert, setUnfinishedAlert] = useState(0);
	const navigate = useNavigate();

	// weather alert popup
	const [dirty, setDirty] = useState(false)
	const [alertOpen, setAlertOpen] = useState(false)
	const [listOfAlerts, setListOfAlerts] = useState([])
	const [loaded, setLoaded] = useState(false)
	const [alertTimeout, setAlertTimeout] = useState(0)


	useEffect(() => {
		if (localStorage.length !== 0) {
			setLoggedIn(true);
			setUser(JSON.parse(localStorage.getItem('user')));
		}
	}, []);

	useEffect(() => {
		if (loggedIn && user?.user.role === UserRoles.HIKER) {
			setAlertTimeout(3000)
		}
	}, [loggedIn, user])


	const alertsContainDangers = (list) => {
		for (let index = 0; index < list.length; index++) {
			const alert = list[index];
			if (alert.weatherStatus >= 4 && alert.weatherStatus < 7)
				return true
		}
		return false
	}

	/**
	 * Alert popup timeout
	 */
	useEffect(() => {
		if (alertTimeout !== 0 && !alertOpen) {
			setTimeout(() => {
				// fetch from the db
				let tmpListOfAlerts = []
				const apiGetAlerts = async () => {
					tmpListOfAlerts = await API.getMyAlerts()
				}

				apiGetAlerts().then(() => {
					setListOfAlerts(tmpListOfAlerts)
					if (tmpListOfAlerts.length !== 0 && alertsContainDangers(tmpListOfAlerts)) {
						setAlertOpen(true)
						setLoaded(true)
					}
				})

				// update
				setDirty(!dirty)
			}, alertTimeout);
		}
	}, [dirty, alertTimeout])


	const doLogIn = (credentials, setShow, setErrorMessage) => {
		API.logIn(credentials)
			.then(user => {
				setLoggedIn(true);
				setUser(user);
				setShow(false);
				navigate('/')
			})
			.catch(err => {
				console.log(err);
				setShow(true);
				setErrorMessage(err);
			}
			)
	}


	const doLogOut = async (returnToHome = "true") => {
		await API.logOut();
		localStorage.clear();
		setLoggedIn(false);
		setUser({});
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



	const deleteHike = (hikeID) => {
		API.deleteHikeId(hikeID)
			.then((rowsAffected) => {
				console.log(rowsAffected)
				setRowsAffected(true)
			})
			.catch((err) => { console.log(err) })
	}

	const gotoLogin = () => {
		navigate("/login", { replace: false })
	}

	useEffect(()=>{
		console.log(unfinishedAlert);
		console.log(started);
		if(loggedIn && user?.user.role === UserRoles.HIKER && started===true){
			setUnfinishedAlert(60*1000);
		  }else{
			setUnfinishedAlert(0);
		  }
		}, [loggedIn, user, started])
	
		useEffect(() => {
		   console.log(unfinishedAlert)
		  if (started===true  && unfinishedAlert!==0) {
			setTimeout(() => {
			  // fetch from the db
			console.log("inside the set interval if started = true call the API unfinished hikes:  started: " + started);
			API.getUnfinishedHikes()
				.then((HikeIDs) => {
					console.log("inside the call for API getUnfinishedHikes, started (should be true): " + started, "HikeIDs to finish " + HikeIDs)
					setHikeIDs(HikeIDs)
					if (open === false) {
						if (HikeIDs.length !== 0) {
							console.log("array of id's not empty should se the popup" + HikeIDs);
							setOpen(true);
						} else {
							setOpen(false);
						}
					}
		  })
				.catch((err) => { console.log(err) })
		  setUpdate(!update);
			}, unfinishedAlert);
		  }
		}, [update, unfinishedAlert, started])

	return (
		<>
			<PopupUnfinishedHike hikeIDs={hikeIDs} open={open} setOpen={setOpen} started={started} setStarted={setStarted} setUnfinishedAlert={setUnfinishedAlert}/>

			<HTNavbar user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} gotoLogin={gotoLogin} />
			{
				loaded ? <AlertPopup open={alertOpen} setOpen={setAlertOpen} listOfAlerts={listOfAlerts} setAlertTimeout={setAlertTimeout} /> : <></>
			}
			<Routes>
				<Route path="/" element={<HTMainPage user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} navigate={navigate} />} />
				<Route path="/listofhikes" element={<HTListOfHikes user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
				<Route path="/listofhuts" element={<HTListOfHuts user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
				<Route path="/browsehikes" element={<HTBrowseHikes user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
				<Route path="/login" element={<LoginForm login={doLogIn} user={user?.user}logout={doLogOut} />} />
				<Route path="/signup" element={<SignUpForm doRegister={doRegister} user={user?.user} />} />
				<Route path="/newHut" element={<NewHutForm user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} addNewHut={API.addNewHut} />} />
				<Route path="/myHikes" element={<MyHikesPage user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} deleteHike={deleteHike} rowsAffected={rowsAffected} setRowsAffected={setRowsAffected} />} />
				<Route path="/showhike/:hikeid" element={<ShowHike user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
				<Route path="/showhut/:hutid" element={<ShowHut user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
				<Route path="/newParking" element={<NewParking user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} addNewParkingLot={API.addNewParkingLot} />} />
				<Route path="/edithike/:hikeid" element={<EditHikePage user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
				<Route path="/newHike" element={<NewHikeStEnd addNewGpx={API.addNewGpx} isLoggedIn={loggedIn} doLogOut={doLogOut} user={user?.user} />} />
				<Route path="/hikerdashboard" element={<HikerDashboard user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
				<Route path="/admindashboard" element={<AdminDashboard user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
				<Route path="/hutWorkerHuts" element={<HutWorkerHuts user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
				<Route path="/edithut/:hutid" element={<EditHut user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} modifyHutInformation={API.modifyHutInformation} />} />
				<Route path="/hutWorkerHuts/linkedHikes" element={<HikesLinked user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
				<Route path="/trackhike/:hikeid" element={<TrackingHikePage user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} setStarted={setStarted} started={started} />} />
				<Route path="/modifyHikeCondition/:hikeid" element={<HikeCondition user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} updateHikeCondition={API.updateHikeCondition} />} />
				<Route path="/hikerhikes" element={<HikerHikesPage user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
				<Route path="/new-weather-alert-hike" element={<WeatherAlertHike user={user?.user} />} />
				<Route path="/new-weather-alert-map" element={<WeatherAlertMap user={user?.user} />} />
				<Route path="/hikerPerformance" element={<HikerPerformance user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
				<Route path="/weather-status-edit/:hikeID" element={<WeatherAlertHikeEditStatus user={user?.user} />} />
				<Route path="/friend-tracking/:userID/:hikeID/:friendCode" element={<FriendTracking />} />
				<Route path="/savedhikes" element={<SavedHikes user={user?.user} isLoggedIn={loggedIn} doLogOut={doLogOut} />} />
				<Route path="/unauthorized" element={<Unauthorized />} />
				<Route path="/friend-code" element={<VerifyKey />} />
			</Routes>
		</>
	);
}

export default App;


