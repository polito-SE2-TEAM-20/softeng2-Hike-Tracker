const APIURL = process.env.REACT_APP_API_BASE || 'https://hiking-backend.germangorodnev.com';

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
    for (var pathIndex in listOfPaths) {
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
    var outHike = hike
    outHike.positions = []
    if (outHike.gpxPath == undefined || outHike.gpxPath == "")
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

const API = {
    getListOfHikes, getListOfGPXFiles, getPathByID,
    getHikeByListOfPaths, getFilteredListOfHikes, getHikePathByHike,
    getSingleHikeByID, getHikesForLocalGuide, getListOfHuts, getSingleHutByID, getListOfHutsAndParkingLots
}
export default API