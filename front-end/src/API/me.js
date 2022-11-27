import { APIURL } from "./API";

async function getMyHikesAsLocalGuide(){
    let response = await fetch(( APIURL + 'me/hikes'), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*',
        }
    });
    if (response.ok) {
        const listOfMyHikes = await response.json();
        return listOfMyHikes
      } else {
        const errDetail = await response.json();
        throw errDetail.message;
      }
}

export {getMyHikesAsLocalGuide};