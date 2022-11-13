const APIURL = 'http://hiking-backend.germangorodnev.com';

async function getListOfHikes(request) {
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

const LOH_API = { getListOfHikes }
export default LOH_API