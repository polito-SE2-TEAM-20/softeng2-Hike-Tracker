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

    {
      "province": null,
      "region": null,
      "maxLength": null,
      "minLength": null,
      "expectedTimeMin": null,
      "expectedTimeMax": null,
      "difficultyMin": null,
      "difficultyMax": null,
      "ascentMin": null,
      "ascentMax": null
    }

Where tourist = 0,
  hiker = 1,
  professionalHiker = 2

Request is on /hikes/filteredHikes
*/
const APIURL = 'https://hiking-backend.germangorodnev.com/';