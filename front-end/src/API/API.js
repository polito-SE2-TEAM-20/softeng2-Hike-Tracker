import { UserHikeState } from "../lib/common/Hike";

export const APIURL = process.env.REACT_APP_API_BASE || 'https://hiking-backend.germangorodnev.com';
export const WEBSITEURL = "https://hiking.germangorodnev.com"

async function getListOfHikes() {
    let response = await fetch((APIURL + '/hikes'), {
        method: 'GET'
    });
    if (response.ok) {
        const listOfHikes = await response.json();
        return listOfHikes
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function getFilteredListOfHikes(request) {
    let response = await fetch((APIURL + '/hikes/filteredHikes'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request.filter)
    });
    if (response.ok) {
        const listOfHikes = await response.json();
        return listOfHikes
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function getSingleHikeByID(hikeid) {
    let response = await fetch((APIURL + '/hikes/' + hikeid), {
        method: 'GET'
    });
    if (response.ok) {
        const hike = await response.json();
        return hike
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

//Antonio's API Function for getting list of hikes inserted by a local guide
async function getHikesForLocalGuide() {
    let response = await fetch((APIURL + '/me/hikes'), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*',
        }
    });
    if (response.ok) {
        const listOfHikes = await response.json();
        return listOfHikes
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function getListOfGPXFiles() {
    let response = await fetch((APIURL + '/hikes'), {
        method: 'GET'
    });
    if (response.ok) {
        const listOfHikes = await response.json();
        return listOfHikes.map(e => e.gpxPath)
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function getPathByID(path) {
    let response = await fetch((APIURL + path), {
        method: 'GET'
    });
    if (response.ok) {
        const gpxFile = await response.text();
        return gpxFile
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function getHikeByListOfPaths(listOfPaths) {
    const hikes = []
    for (let pathIndex in listOfPaths) {
        let response = await fetch((APIURL + listOfPaths[pathIndex]), {
            method: 'GET'
        });
        if (response.ok) {
            const gpxFile = await response.text();
            hikes.push(gpxFile)
        } else {
            const errDetail = await response.json();
            throw errDetail.message;
        }
    }
    return hikes
}

async function getHikePathByHike(hike) {
    let outHike = hike
    outHike.positions = []
    if (outHike.gpxPath === undefined || outHike.gpxPath === "")
        return outHike
    let response = await fetch((APIURL + hike.gpxPath), {
        method: 'GET'
    });
    if (response.ok) {
        const positions = await response.text();
        outHike.positions = positions
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
    return outHike;
}

async function getListOfHuts(filter) {
    let response = await fetch((APIURL + '/huts/filter'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filter)
    });
    if (response.ok) {
        const listOfHuts = await response.json();
        return listOfHuts
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function getSingleHutByID(hutid) {
    let response = await fetch((APIURL + '/huts/' + hutid), {
        method: 'GET'
    });
    if (response.ok) {
        const hut = await response.json();
        return hut
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}


async function getListOfHutsAndParkingLots(radius) {
    let response = await fetch((APIURL + '/hike-modification/hutsAndParkingLots'), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',

        },
        body: JSON.stringify(radius)
    });
    if (response.ok) {
        const hutsAndParkingLots = await response.json();
        return hutsAndParkingLots
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}
async function logIn(credentials) {
    let response = await fetch((APIURL + '/auth/login/'), {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(credentials),


    });
    if (response.ok) {


        const user = await response.json();
        localStorage.setItem('token', user.token);

        localStorage.setItem('user', JSON.stringify(user));
        console.log(localStorage);
        console.log(user);
        return user;

    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function logOut() {
    //Erfan: Here we need to call an API to logout from server too. the previous token should not be working.
    //Clearing the local storage should not be handled here!
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

async function signUp(credentials) {
    let response = await fetch((APIURL + '/auth/register/'), {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(credentials),


    });
    if (response.ok) {
        const user = await response.json();

        // localStorage.setItem('token', user.token);
        return user;

    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function addNewHut(hut) {
    console.log(hut)
    console.log(localStorage)
    let response = await fetch((APIURL + '/huts/createHut/'), {
        method: 'POST',

        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(hut)


    });
    if (response.ok) {
        const newHut = await response.json();
        console.log(newHut);
        return newHut;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function addNewParkingLot(parking) {
    console.log(parking)
    console.log(localStorage)
    let response = await fetch((APIURL + '/parkingLot/insertLot/'), {
        method: 'POST',

        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(parking)
    });
    if (response.ok) {
        const newParking = await response.json();
        console.log(newParking);
        return newParking;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function addNewGpx(formData) {
    let response = await fetch((APIURL + '/hikes/import/'), {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*',
        }

    });
    if (response.ok) {
        const newTrack = await response.json();
        console.log(newTrack);
        return newTrack;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

function addHike(hike) {
    return new Promise((resolve, reject) => {
        fetch((APIURL + '/hikes/' + hike.id), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ length: hike.length, ascent: hike.ascent, title: hike.title, difficulty: hike.difficulty, expectedTime: hike.expectedTime, description: hike.description }),

        }).then((response => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((message) => { reject(message); })
                    .catch(() => { reject({ error: "Cannot communicate with the server" }) });
            }
        }))
    })
}

const getNotApprovedLocalGuides = async () => {
    const response = await fetch((APIURL + '/auth/not_approved/local_guides'), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        }
    });
    if (response.ok) {
        const listOfNotApprovedLocalGuides = await response.json()
        return listOfNotApprovedLocalGuides
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

const getNotApprovedHutWorkers = async () => {
    const response = await fetch((APIURL + '/auth/not_approved/hut_workers'), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        }
    });
    if (response.ok) {
        const listOfNotApprovedHutWorkers = await response.json()
        return listOfNotApprovedHutWorkers
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

const approveUserByID = async (id) => {
    const response = await fetch((APIURL + '/auth/approve_user/' + id), {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        }
    });
    if (response.ok) {
        return true
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}


// Francesco Grande, [11/30/22 4:26 PM]
// GET me/preferences ti ritorna un oggetto json con tutte le preferenze dell'utente
const getPreferences = async () => {
    const response = await fetch((APIURL + "/me/preferences"), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        }
    })
    if (response.ok) {
        const preferences = await response.json()
        return preferences
    } else if (response.status === 404) {
        return null
    } else {
        const errDetail = await response.json()
        throw errDetail.message
    }
}


// Francesco Grande, [11/30/22 4:27 PM]
// POST me/set_preferences ti permette di salvare o modificare le preferenze, il body è fatto tipo così: 
// {
//     "lat": 5.005,
//     "lon": 5.004,
//     "radiusKms": 10,
//     "minLength": 4010,
//     "maxLength": 6000,
//     "expectedTimeMin": 500,
//     "expectedTimeMax": 1500,
//     "difficultyMin": 1,
//     "difficultyMax": 2,
//     "ascentMin": 50,
//     "ascentMax": 150
// }
const setPreferences = async (preferences) => {
    console.log(preferences)
    const response = await fetch((APIURL + '/me/set_preferences'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        },
        body: JSON.stringify(preferences)
    })
    if (response.ok) {
        return true
    } else {
        const errDetail = await response.json()
        throw errDetail.message
    }
}

const deleteHikeId = async (hikeID) => {
    const response = await fetch((APIURL + '/hikes/' + hikeID), {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    })
    if (response.ok) {

        const rowsAffected = await response.json();
        return rowsAffected;
    } else {
        const errDetail = await response.json()
        throw errDetail.message
    }
}

const getHutsHutWorker = async () => {
    const response = await fetch((APIURL + "/huts/hutWorker/iWorkAt"), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    })
    if (response.ok) {
        const hutsHutWorker = await response.json()
        return hutsHutWorker;
    } else {
        const errDetail = await response.json()
        throw errDetail.message;
    }
}


async function modifyHutInformation(information, hutId) {
    const response = await fetch((APIURL + '/huts/updateDescription/' + hutId), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(information),

    });

    if (response.ok) {
        const hutUpdated = await response.json()
        return hutUpdated;
    } else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function editHikeStartEndPoint(hikeId, startPoint, endPoint, referencePoint, title, description, length, expectedTime, ascent, difficulty) {

    const body = {
        startPoint: startPoint,
        endPoint: endPoint,
        referencePoints: referencePoint,
        title: title,
        description: description,
        length: length,
        expectedTime: expectedTime,
        ascent: ascent,
        difficulty: difficulty
    }

    const response = await fetch((APIURL + '/hikes/' + hikeId), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body),

    });

    if (response.ok) {
        const hikeUpdate = await response.json()
        return hikeUpdate;
    } else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function linkPointsToHike(hikeId, huts, parkingLots) {

    const hutIds = huts.map((item) => item.id)
    const parkingLotIds = parkingLots.map((item) => item.id)

    const body = {
        hikeId: parseInt(hikeId),
        linkedPoints: []
    }

    for (let i = 0; i < hutIds.length; i++) {
        body.linkedPoints.push({
            hutId: hutIds[i]
        })
    }
    for (let i = 0; i < parkingLotIds.length; i++) {
        body.linkedPoints.push({
            parkingLotId: parkingLotIds[i]
        })
    }

    const response = await fetch((APIURL + '/hikes/linkPoints'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body),

    });

    if (response.ok) {
        const hikeDetails = await response.json()
        return hikeDetails;
    } else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}


async function getHikesUpdatableHutWorker() {
    let response = await fetch((APIURL + '/hikes/hutWorkerHikes'), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*',
        }
    });
    if (response.ok) {
        const listHikesUpdatable = await response.json();
        return listHikesUpdatable;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}


async function updateHikeCondition(information, hikeId) {
    const response = await fetch((APIURL + '/hikes/condition/' + hikeId), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(information),

    });

    if (response.ok) {
        const hikeConditionUpdate = await response.json()
        return hikeConditionUpdate;
    } else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

//#region Tracking Hike
async function startTracingkHike(hikeId) {

    const body = {
        hikeId: parseInt(hikeId)
    }

    const response = await fetch((APIURL + '/user-hikes/start'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body),

    });

    if (response.ok) {
        const hikeTrackingDetails = await response.json()
        return hikeTrackingDetails;
    } else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function addPointToTracingkHike(hikeTrackId, pointId, dateTime) {

    const body = {
        pointId: pointId,
        datetime: dateTime
    }

    const response = await fetch((APIURL + '/user-hikes/' + hikeTrackId + '/track-point'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body),

    });

    if (response.ok) {
        const hikeTrackingDetails = await response.json()
        return hikeTrackingDetails;
    } else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function stopTrackingHike(hikeTrackId) {

    const response = await fetch((APIURL + '/user-hikes/' + hikeTrackId + '/finish'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    });

    if (response.ok) {
        const hikeTrackingDetails = await response.json()
        return hikeTrackingDetails;
    } else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function getUserHikeTrackingDetails(hikeTrackId) {

    const response = await fetch((APIURL + '/user-hikes/' + hikeTrackId), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    });

    if (response.ok) {
        const hikeTrackingDetails = await response.json()
        return hikeTrackingDetails;
    } else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function getAllUserTrackingHikes(userHikeState) {

    const body = {}

    switch (userHikeState) {
        case UserHikeState.ACTIVE:
        case UserHikeState.FINISHED: {
            body.state = userHikeState
            break;
        }
        case UserHikeState.ALL:
        default: {
            //don't add anything to the body
        }
    }

    const response = await fetch((APIURL + '/me/tracked-hikes'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body),
    });

    if (response.ok) {
        const hikeTrackingDetails = await response.json()
        return hikeTrackingDetails;
    } else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

//#endregion

/**
 *  @latenightdawn hut pictures
    hut now contains field pictures, an array of strings - urls to images, 
    just like with hike gpx, you need to concat with base url of server

    POST /hut-pictures/:hutId
    accepts form-data, just like hike import
    fields:
    
    pictures: array of files
*/
const setHutPictures = async (request) => {
    const response = await fetch((APIURL + '/hut-pictures/' + request.hutID), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        },
        body: request.pictures
    })

    if (response.ok) {
        return true
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

const modifyHutPictures = async (request) => {
    const response = await fetch((APIURL + '/hut-pictures/' + request.hutID + '/modify'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        },
        body: JSON.stringify({ 'pictures': request.params })
    })

    if (response.ok) {
        console.log(response)
        return true
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

const getHikesBasedOnPreferences = async () => {
    const response = await fetch((APIURL + "/me/apply_preferences"), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        },
    })

    if (response.ok) {
        return await response.json()
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

// picture for the hike
const setHikePictures = async (request) => {
    const response = await fetch((APIURL + '/hike-pictures/' + request.hikeID), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        },
        body: request.pictures
    })

    if (response.ok) {
        return true
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

//get performance stats only for hiker 
// returns {stats: [{stat:'stat name', value: number, unit:string}]}
const getPerformanceStats = async () => {
    const response = await fetch((APIURL + "/me/performance-stats"), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        },
    })

    if (response.ok) {
        const performanceStats = response.json()
        return performanceStats;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

// called every minute
const getUnfinishedHikes = async () => {
    const response = await fetch((APIURL + "/hikes/unfinished/popupsList"), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        },
    })

    if (response.ok) {
        const hikeIDs = response.json()
        return hikeIDs;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

const getHikesMaximumElapsedTime = async (hikeId) => {
    const response = await fetch((APIURL + "/hikes/maxElapsedTime/" + hikeId), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        },
    })
    if (response.ok) {
        const hike = await response.json();
        return hike;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

const getUnfinishedHikesPopupSeen = async (hikeId) => {
    const response = await fetch((APIURL + "/hikes/unfinished/popupSeen/" + hikeId), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        },
    })

    if (response.ok) {
        const hikeIDs = response.json()
        return hikeIDs;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

const updateWeatherSingleHike = async (request) => {
    const response = await fetch((APIURL + "/hikes/updateWeather/" + request.hikeID), {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        },
        body: JSON.stringify({
            weatherStatus: request.weatherInfo.weatherStatus,
            weatherDescription: request.weatherInfo.weatherDescription
        })
    })

    if (response.ok) return true
    else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

const updateWeatherMap = async (request) => {
    const response = await fetch((APIURL + "/hikes/range/updateWeatherInRange"), {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        },
        body: JSON.stringify({
            inPointRadius: {
                lat: request.weatherInfo.lat,
                lon: request.weatherInfo.lon,
                radiusKms: request.weatherInfo.radiusKms
            },
            weatherStatus: request.weatherInfo.weatherStatus,
            weatherDescription: request.weatherInfo.weatherDescription
        })
    })

    if (response.ok) return true
    else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

const requestNewCode = async () => {
    const response = await fetch((APIURL + "/friends/share"), {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        }
    })

    if (response.ok) {
        return await response.json()
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

const getHikeByFriendCode = async (code) => {
    const response = await fetch((APIURL + "/friends/track/" + code), {
        method: "GET"
    })

    if (response.ok) {
        return await response.json()
    } else if (response.status === 422) {
        return {status: response.status}
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

const userGetReferencePointsReached = async () => {
    const response = await fetch((APIURL + "/user-hikes/reached-points"), {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        }
    })
    if (response.ok) {
        return await response.json()
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

const userUpdateReferencePointReached = async (request) => {
    const response = await fetch((APIURL + "/user-hikes/reach-point"), {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        },
        body: JSON.stringify({ pointId: request.pointId })
    })

    if (response.ok) {
        return true
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

const friendGetReferencePointsReached = async (request) => {
    const response = await fetch((APIURL + "/friends/reached-points/" + request.friendCode), {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        }
    })
    if (response.ok) {
        return await response.json()
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function setPlannedHikes(hikeIds) {
    let response = await fetch((APIURL + '/me/set_planned_hikes'), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',

        },
        body: JSON.stringify({ plannedHikes: [hikeIds] })

    });
    if (response.ok) {
        const listOfPlannedHikes = await response.json();
        return listOfPlannedHikes
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

const deletePlannedHike = async (hikeID) => {
    const response = await fetch((APIURL + '/me/planned_hikes'), {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': '*/*'
        },
        body: JSON.stringify({ plannedHikes: [hikeID] })
    });
    {/*}
   const data = await response;
 
   // now do whatever you want with the data  
console.log(data);*/}
};

const getPlannedHikes = async () => {
    const response = await fetch((APIURL + "/me/planned_hikes"), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        },

    })

    if (response.ok) {
        const plannedHikes = response.json()
        return plannedHikes;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

const definitiveClosePopup = async (hikeID) => {
    const response = await fetch((APIURL + "/hikes/popupSeen/" + hikeID), {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        },
    })

    if (response.ok) {
        return true
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

const getMyAlerts = async () => {
    const response = await fetch((APIURL + "/hikes/weather/flags"), {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*'
        },
    })

    if (response.ok) {
        return await response.json()
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

const API = {
    getListOfHikes, getListOfGPXFiles, getPathByID,
    getHikeByListOfPaths, getFilteredListOfHikes, getHikePathByHike,
    getSingleHikeByID, getHikesForLocalGuide, getListOfHuts,
    getSingleHutByID, getListOfHutsAndParkingLots, logIn,
    logOut, signUp, addNewHut, addNewParkingLot, addNewGpx,
    addHike, getNotApprovedLocalGuides, getNotApprovedHutWorkers,
    approveUserByID, getPreferences, setPreferences, deleteHikeId,
    getHutsHutWorker, modifyHutInformation, editHikeStartEndPoint, getHikesUpdatableHutWorker,
    linkPointsToHike,
    updateHikeCondition,
    setHikePictures, getPerformanceStats, getUnfinishedHikes, getHikesMaximumElapsedTime,
    getUnfinishedHikesPopupSeen,
    //plan an hike
    setPlannedHikes, getPlannedHikes, deletePlannedHike,
    //#region Export HikeTraking APIs
    startTracingkHike, addPointToTracingkHike, stopTrackingHike,
    getUserHikeTrackingDetails, getAllUserTrackingHikes,
    //#endregion
    setHutPictures, modifyHutPictures, getHikesBasedOnPreferences, updateWeatherSingleHike, updateWeatherMap,
    requestNewCode, getHikeByFriendCode, userGetReferencePointsReached, userUpdateReferencePointReached, friendGetReferencePointsReached,
    definitiveClosePopup, getMyAlerts
}
export default API