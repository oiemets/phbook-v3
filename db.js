const BASE_URL = 'https://jsonplaceholder.typicode.com';

async function getUsers() {
    return fetch(`${BASE_URL}/users`, {
        method: 'GET',
        headers:{
            'Content-Type':'application/json; charset=utf-8'
        }
    }).then(response => {
        if(response.ok){
            return response.json();
        }
        throw new Error(response.status);
    });
}

// getUsers().then(json => console.log(json))

