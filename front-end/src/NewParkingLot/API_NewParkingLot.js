const APIURL = 'http://hiking-backend.germangorodnev.com/';
async function addNewParkingLot(parking) {
  console.log(parking)
  console.log(localStorage)
    let response = await fetch((APIURL + 'parking/'), {
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

  const API_NewParkingLot = {addNewParkingLot};
  export default API_NewParkingLot;