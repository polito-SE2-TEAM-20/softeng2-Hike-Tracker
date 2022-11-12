

// const APIURL = 'http://se2-queue-backend.germangorodnev.com/';
async function addHike(formData) {
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

const API_NewHike = {addHike};
export default API_NewHike;