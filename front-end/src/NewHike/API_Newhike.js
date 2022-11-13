

// const APIURL = 'http://se2-queue-backend.germangorodnev.com/';
async function addNewGpx(formData) {
    let response = await fetch('', {
      method: 'POST',
      body: formData,
    });
    if(response.ok) {
      const newTrack = await response.json();
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
      fetch('', {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({title: hike.title, length: hike.length, expectedTime: hike.expectedTime, ascent: hike.ascent, difficulty: hike.difficulty, description: hike.description}),

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

const API_NewHike = {addNewGpx, addHike};
export default API_NewHike;