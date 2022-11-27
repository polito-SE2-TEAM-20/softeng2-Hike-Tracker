import { APIURL } from "./common";

export async function getMyHuts(){
    let response = await fetch(( APIURL + 'huts/mine'), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*',
        }
    });
    if (response.ok) {
        const huts = await response.json();
        return huts
      } else {
        const errDetail = await response.json();
        throw errDetail.message;
      }
}