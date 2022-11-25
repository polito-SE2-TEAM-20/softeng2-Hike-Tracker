const APIURL = 'https://hiking-backend.germangorodnev.com';

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
    console.log(errDetail)
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

const LOH_API = { getListOfHikes, getFilteredListOfHikes, getHikesForLocalGuide }
export default LOH_API