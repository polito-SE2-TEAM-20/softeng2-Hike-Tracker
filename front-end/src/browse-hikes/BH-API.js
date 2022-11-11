/**
 * about the Body for filtering, provide me something like this:

   Body: {
      province: string || null
      region: string || null
      maxLength: float || null (provide kms like '12.3')
      minLength: float || null
      expectedTimeMin: integer || null (time provided in minutes)
      expectedTimeMax: integer || null (time provided in minutes)
      difficultyMin: (0, 1 or 2) || null
      difficultyMax: (0, 1 or 2) || null
      ascentMin: float || null
      ascentMax: float || null
    }


Where tourist = 0,
  hiker = 1,
  professionalHiker = 2

Request is on /hikes/filteredHikes
*/
const APIURL = 'http://se2-queue-backend.germangorodnev.com/';

async function getFilteredHikesList(request) {
    let response = await fetch((APIURL + '/hikes/filteredHikes'), {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(request),
    });
    if (response.ok) {
        console.log("daje zì")

    } else {
        console.log("greve zì")
        const errDetail = await response.json();
        throw errDetail.message;
    }
}