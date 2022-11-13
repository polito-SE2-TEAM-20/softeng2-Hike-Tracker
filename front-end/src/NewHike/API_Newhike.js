
const APIURL = 'http://hiking-backend.germangorodnev.com/';
async function addNewGpx(formData) {
    let response = await fetch('/hikes/imp', {
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
      fetch((APIURL + 'hikes/id/'), {
        method: 'PUT',
        credentials: 'include', 
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

const API_NewHike = {addNewGpx, addHike};
export default API_NewHike;