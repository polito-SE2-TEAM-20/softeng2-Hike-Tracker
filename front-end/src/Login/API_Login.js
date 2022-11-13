const APIURL = 'http://hiking-backend.germangorodnev.com/';

async function logIn(credentials) {
    let response = await fetch((APIURL + 'auth/login/'), {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(credentials),


    });
    if (response.ok) {


        const user = await response.json();
        localStorage.setItem('token', user.token);
        console.log(localStorage);
        return user;

    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function logOut() {
    localStorage.removeItem('token');
}


const API = { logIn, logOut };
export default API;