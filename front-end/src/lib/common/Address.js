
export async function getInformation(lat, lon) {
    let response = await fetch((`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1`), {
        method: 'GET'
    });
    if (response.ok) {
        const informations = await response.json();
        return informations;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}