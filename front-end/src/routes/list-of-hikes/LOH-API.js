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

const LOH_API = { getListOfHikes, getFilteredListOfHikes, getSingleHikeByID }
export default LOH_API