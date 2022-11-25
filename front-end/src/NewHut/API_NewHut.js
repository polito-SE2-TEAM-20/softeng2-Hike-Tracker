const APIURL = 'http://hiking-backend.germangorodnev.com/';
async function addNewHut(hut) {
  console.log(hut)
  console.log(localStorage)
    let response = await fetch((APIURL + 'huts/createHut/'), {
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

  const API_NewHut = {addNewHut};
  export default API_NewHut;