const state = {
    email: 'example@email.au',
    form: null,
    contacts: []
}

// [{name: 'Alex', phone: '1234'}, {name: 'Bob', phone: '1234'}]


function app(root) {
    root.append(navView({loggedIn: true, listener: createNavListener(root)}));
}

function unorderedList(items) {
    return items.reduce(
        (result, {content, href}) =>
            result + `<li><a href="${href}">${content}</a></li>`,
        ''
    );
}

function navView({loggedIn, listener}) {
    const header = document.createElement('header');
    const nav = document.createElement('nav');
    nav.className = 'container';
    const ul = document.createElement('ul');
    ul.innerHTML =
        unorderedList(
            loggedIn ?
                [
                    {href: 'currentUser', content: state.email},
                    {href: 'contacts', content: 'contacts'},
                    {href: 'add', content: 'add contact'},
                    {href: 'logout', content: 'log out'}
                ] :
                [
                    {href: 'login', content: 'log in'},
                    {href: 'signin', content: 'sign in'},
                ]
        );

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

const inputsMap = {
    email: {type: 'text', name: 'email', placeholder: 'email'},
    password: {type: 'password', name: 'password', placeholder: 'password'},
    fullname: {type: 'text', name: 'fullname', placeholder: 'full name'},
    phone: {type: 'text', name: 'phone', placeholder: 'phone'},
    address: {type: 'text', name: 'address', placeholder: 'address'},
    desc: {type: 'text', name: 'desc', placeholder: 'description'}
}

const inputTemplate = ({type, name, placeholder}) =>
    `<input type=${type} name=${name} placeholder=${placeholder} />`;

const getFormBody = (inputs, button) =>
    inputs
        .map(name => inputsMap[name])
        .map(inputTemplate)
        .join('')
        + button



function callEventMethod(method, elem, events) {
    events.forEach(([event, callback]) => {
        elem[method](event, callback);
    })
}

function subscribeFormEvents(form, div) {
    const onSubmit = e => {
        e.preventDefault();
        new FormData(form);
    };
    const onFormData = e => {
        let data = e.formData;
        const formData = Object.fromEntries(data.entries());
        localStorage.setItem('data', JSON.stringify(formData));
        form.reset();
    };
    const onClickOutside = e => {
        if (e.target.className === 'form_holder') {
            div.remove();

            callEventMethod(
                'removeEventListener',
                form,
                [
                    ['submit', onSubmit],
                    ['formdata', onFormData]
                ]
            );
            callEventMethod(
                'removeEventListener',
                div,
                [['click', onClickOutside]]
            )
        }
    };

    callEventMethod(
        'addEventListener',
        form,
        [
            ['submit', onSubmit],
            ['formdata', onFormData]
        ],
    );

    callEventMethod('addEventListener', div, [['click', onClickOutside]])
}

function form({type}) {
    const div = document.createElement('div');
    div.className = 'form_holder';
    const form = document.createElement('form');
    form.className = 'form';

    switch (type) {
        case 'login':
            form.innerHTML = getFormBody(['email', 'password'], '<button>log in</button>')
            break;
        case 'signin':
            form.innerHTML = getFormBody([
                    'fullname',
                    'email',
                    'phone',
                    'address',
                    'password'
                ],
                '<button>sign in</button>'
            )
            break;
        case 'add':
            form.innerHTML = getFormBody([
                    'fullname',
                    'email',
                    'phone',
                    'address',
                    'desc'
                ],
                '<button>add</button>'
            )
            break;
    }

    subscribeFormEvents(form, div);
    div.append(form);

    return div;
};


const createNavListener = root => async ({path}) => {
    if (path === 'contacts'){
        state.contacts = await getUsers();
        root.append(contactsView({contacts: state.contacts}));
    } else {
        root.prepend(form({type: path}));
    }
};

function contactRendering({contact, index}) {
    return `
        <div class="contact" data-index="${index}">
            <h2>${contact.name}</h2>
            <h3>${contact.phone}</h3>
        </div>
        <hr />
        `
};

function findParentWithClass(target, className) {
    if (!target) {
        return null
    }

    if (target.classList.contains(className)) {
        return target;
    }

    return findParentWithClass(target.parentElement, className);
}

function contactsView({contacts}) {
    const div = document.createElement('div');
    div.className = 'contacts container';
    div.innerHTML = contacts.map((contact, index) => contactRendering({contact, index})).join('');

    let currentActiveContact;
    div.addEventListener('click', (e) => {
        const target = findParentWithClass(e.target, 'contact');
        if (!target) {
            return;
        }

        target.classList.add('active');
        if (currentActiveContact) {
            currentActiveContact.classList.remove('active');
        }
        currentActiveContact = target;
    });

    return div;
};




