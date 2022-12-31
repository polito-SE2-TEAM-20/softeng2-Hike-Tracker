export const generateKey = (hikeID) => {
    const sha1 = require('js-sha1')
    let key = sha1(hikeID)
    return key.substr(0, 4);
}

export const verifyKey = (key, hikeID) => {
    const sha1 = require('js-sha1')
    if (sha1(hikeID).substr(0, 4) === key)
        return true
    return false
}