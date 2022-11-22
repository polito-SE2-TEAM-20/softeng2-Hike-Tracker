const APIURL = 'http://hiking-backend.germangorodnev.com/';

async function signUp(credentials){
    let response = await fetch(( APIURL + 'auth/register/'), {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(credentials),


    });
    if(response.ok){
        const user = await response.json();

        // localStorage.setItem('token', user.token);
        return user;

    }else{
        const errDetail = await response.json();
        throw errDetail.message;
    }
}


const API = {signUp};
export default API;