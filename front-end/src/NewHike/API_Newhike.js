
const APIURL = 'http://hiking-backend.germangorodnev.com/'; // 'http://localhost:3500/'

async function addNewGpx(formData) {
  console.log({formData})
  console.log(localStorage)
    let response = await fetch((APIURL + 'hikes/import/'), {
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


  async function getRegion(lat, lon) {
    let response = await fetch((`http://api.positionstack.com/v1/reverse?access_key=01e71287aba0f5d255cf1c394737f1ff&query=${lat},${lon}`), {
      method: 'GET'
    });
    if (response.ok) {
      console.log(response)
      const information = await response.json();
      console.log(information);
      return information
    } else {
      const errDetail = await response.json();
      throw errDetail.message;
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

const API_NewHike = {addNewGpx, addHike, getRegion};
export default API_NewHike;
