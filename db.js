const BASE_URL = 'https://jsonplaceholder.typicode.com';

async function getUsers() {
    try {
        const response = await fetch(`${BASE_URL}/users`, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json; charset=utf-8'
            }
        })

        if (response.ok) {
            return await response.json();
        }

        throw new Error(response.status);
    } catch (e) {}
}

// getUsers().then(json => console.log(json))

