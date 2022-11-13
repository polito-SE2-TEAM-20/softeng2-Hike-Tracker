
const APIURL = 'http://hiking-backend.germangorodnev.com/';
async function addNewGpx(formData) {
  console.log({formData})
    let response = await fetch((APIURL + 'hikes/import/'), {
      method: 'POST',
       body: formData,
      headers: {
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
      fetch((APIURL + 'hikes/' + hike.id), {
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

const API_NewHike = {addNewGpx, addHike};
export default API_NewHike;
