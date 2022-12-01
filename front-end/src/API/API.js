export const APIURL = process.env.REACT_APP_API_BASE || 'https://hiking-backend.germangorodnev.com';

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

async function signUp(credentials){
    let response = await fetch(( APIURL + '/auth/register/'), {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(credentials),


    });
    if(response.ok){
        const user = await response.json();

        // localStorage.setItem('token', user.token);
        return user;

    }else{
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
    if(response.ok) {
      const newHut = await response.json();
      console.log(newHut);
      return newHut;
    }
    else {
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch(err) {
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
    if(response.ok) {
      const newParking = await response.json();
      console.log(newParking);
      return newParking;
    }
    else {
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch(err) {
        throw err;
      }
    }
  }

  async function addNewGpx(formData) {
    console.log({formData})
    console.log(localStorage)
      let response = await fetch((APIURL + '/hikes/import/'), {
        method: 'POST',
         body: formData,
        headers: {
          
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': '*/*',
        }
       
      });
      if(response.ok) {
        const newTrack = await response.json();
        console.log(newTrack);
        return newTrack;
      }
      else {
        try {
          const errDetail = await response.json();
          throw errDetail.message;
        }
        catch(err) {
          throw err;
        }
      }
    }
  

    
  
  
  function addHike(hike){
      return new Promise((resolve, reject)=>{
        fetch((APIURL + '/hikes/' + hike.id), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({length: hike.length,ascent: hike.ascent, title: hike.title, difficulty: hike.difficulty, expectedTime: hike.expectedTime,  description: hike.description}),
  
        }).then((response =>{
          if(response.ok){
            resolve(null);
          }else{
            response.json()
              .then((message) =>{reject(message);})
              .catch(()=> {reject({error: "Cannot communicate with the server"})});
          }
        }))
      })
    }

const API = {
    getListOfHikes, getListOfGPXFiles, getPathByID,
    getHikeByListOfPaths, getFilteredListOfHikes, getHikePathByHike,
    getSingleHikeByID, getHikesForLocalGuide, getListOfHuts, getSingleHutByID, getListOfHutsAndParkingLots, logIn, 
    logOut, signUp, addNewHut, addNewParkingLot, addNewGpx, addHike
}
export default API