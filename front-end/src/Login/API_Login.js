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

        localStorage.setItem('user', JSON.stringify(user));
        console.log(localStorage);
        console.log(user);
        return user;

    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}


const API = { logIn, logOut };
export default API;