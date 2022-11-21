const APIURL = 'https://hiking-backend.germangorodnev.com';

async function getListOfHikes() {
  let response = await fetch((APIURL + '/hikes'), {
    method: 'GET'
  });
  if (response.ok) {
    const listOfHikes = await response.json();
    return listOfHikes
  } else {
    console.log("greve zì")
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function getFilteredListOfHikes(request) {
  console.log(request)
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
    console.log("greve zì")
    const errDetail = await response.json();
    console.log(errDetail)
    throw errDetail.message;
  }
}

const LOH_API = { getListOfHikes, getFilteredListOfHikes }
export default LOH_API