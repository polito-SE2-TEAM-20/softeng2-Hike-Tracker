const APIURL = 'http://se2-queue-backend.germangorodnev.com/';

async function SignUp(credentials){
    let response = await fetch(( APIURL + 'auth/signup/'), {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(credentials),


    });
    if(response.ok){

        return true;

    }else{
        const errDetail = await response.json();
        throw errDetail.message;
    }
}



const API = {SignUp};
export default API;