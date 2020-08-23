const state = {
    email: 'example@email.au',
    form: null,
    contacts: []
}

// [{name: 'Alex', phone: '1234'}, {name: 'Bob', phone: '1234'}]

app();

function app(){
    const root = document.querySelector('#root');
    root.append(navView({loggedIn: true, listener: navListener}));    
}

function navView({loggedIn, listener}) {
    const header = document.createElement('header');
    const nav = document.createElement('nav');
    nav.className = 'container';
    const ul = document.createElement('ul');
    ul.innerHTML = `
        ${
            loggedIn ? `
                <li><a href="currentUser">${state.email}</a></li>
                <li><a href="contacts">contacts</a></li>
                <li><a href="add">add contact</a></li>
                <li><a href="logout">log out</a></li>
            `
            :
            `
                <li></li>
                <li><a href="login">log in</a></li>
                <li><a href="signin">sign in</a></li>
            `
        }
    `
    nav.addEventListener('click', e => {
        e.preventDefault();
        if(e.target.tagName === 'A') {
            listener({path: e.target.getAttribute('href')});
        }
    });
    nav.append(ul);
    header.append(nav);
    return header;
};

function form({type}) {
    const div = document.createElement('div');
    div.className = 'form_holder';
    const form = document.createElement('form');
    form.className = 'form';
    form.innerHTML = `
        ${
            (type === 'login') ? `
                <input type="text" name="email" placeholder="email">
                <input type="password" name="password" placeholder="password">
                <button>log in</button>` : 
            (type === 'signin') ? `
                <input type="text" name="fullname" placeholder="full name">
                <input type="text" name="email" placeholder="email">
                <input type="text" name="phone" placeholder="phone">
                <input type="text" name="address" placeholder="address">
                <input type="password" name="password" placeholder="password">
                <button>sign in</button>
            ` : 
            (type === 'add') ?
            `
                <input type="text" name="fullname" placeholder="full name">
                <input type="text" name="email" placeholder="email">
                <input type="text" name="phone" placeholder="phone">
                <input type="text" name="address" placeholder="address">
                <input type="text" name="desc" placeholder="description">
                <button>add</button>
            ` :
            '<p>nothing</p>'
        }
    `;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        new FormData(form);
    });
    form.addEventListener('formdata', (e) => {
        let data = e.formData;
        const formData = Object.fromEntries(data.entries());
        localStorage.setItem('data', JSON.stringify(formData));
        form.reset();        
    });
    div.addEventListener('click', (e) => {
        if(e.target.className === 'form_holder'){
            div.remove();
        }});

    div.append(form);
    return div;
};


function navListener({path}) {
    const root = document.querySelector('#root');
    if(path === 'contacts'){
        getUsers().then(json => {
            state.contacts = [...json];
            root.append(contactsView({contacts: state.contacts}));
        })
    }else{
        root.prepend(form({type: path}));
    }
};

function contactRendering({contact, index}) {
    return `
        <div class="contact" data-index="${index}">
            <h2>${contact.name}</h2>
            <h3>${contact.phone}</h3>
        </div>
        <hr></hr>
        `
};

function contactsView({contacts}) {
    const div = document.createElement('div');
    div.className = 'contacts container';
    div.innerHTML = contacts.map((contact, index) => contactRendering({contact, index})).join('');

    div.addEventListener('click', (e) => {
        for(let c of document.querySelectorAll('.contact')) {
            c.classList.remove('active');
        };
        if(e.target.parentElement.className === 'contact'){
            e.target.parentElement.classList.add('active');
        }else if(e.target.className === 'contact'){
            e.target.classList.add('active');
        }        
    });
    return div;
};




