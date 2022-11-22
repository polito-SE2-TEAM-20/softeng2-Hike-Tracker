const APIURL = 'https://hiking-backend.germangorodnev.com';

async function getListOfGPXFiles() {
  let response = await fetch((APIURL + '/hikes'), {
    method: 'GET'
  });
  if (response.ok) {
    const listOfHikes = await response.json();
    return listOfHikes.map(e => e.gpxPath)
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

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

async function getPathByID(path) {
  let response = await fetch((APIURL + path), {
    method: 'GET'
  });
  if (response.ok) {
    console.log(response)
    const gpxFile = await response.text();
    return gpxFile
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function getHikeByListOfPaths(listOfPaths) {
  const hikes = []
  for (var pathIndex in listOfPaths) {
    let response = await fetch((APIURL + listOfPaths[pathIndex]), {
      method: 'GET'
    });
    if (response.ok) {
      const gpxFile = await response.text();
      hikes.push(gpxFile)
    } else {
      const errDetail = await response.json();
      throw errDetail.message;
    }
  }
  return hikes
}

const BH_API = { getListOfGPXFiles, getListOfHikes, getPathByID, getHikeByListOfPaths }
export default BH_API