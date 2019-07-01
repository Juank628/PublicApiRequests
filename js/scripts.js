/*global variables*/
let allUsers = [];

const getBirthday = date => {
    birthdayData = date.slice(0,10).split('-');
    return `${birthdayData[1]}/${birthdayData[2]}/${birthdayData[0].slice(2,4)}`
}

const closeModal = () => {
    document.querySelector('.modal-container').remove();
}

const openModal = (uuid) => {
    userData = allUsers.filter(user => user.login.uuid === uuid)[0];
    console.log(userData)
    const modalDiv = document.createElement('div');
    modalDiv.className = "modal-container"
    modalDiv.innerHTML = 
        `<div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src=${userData.picture.large} alt="profile picture">
                <h3 id="name" class="modal-name cap">${userData.name.first} ${userData.name.last}</h3>
                <p class="modal-text">${userData.email}</p>
                <p class="modal-text cap">${userData.location.city}</p>
                <hr>
                <p class="modal-text">${userData.cell}</p>
                <p class="modal-text">${userData.location.street}, ${userData.location.state} ${userData.location.postcode}</p>
                <p class="modal-text">Birthday: ${getBirthday(userData.dob.date)}</p>
            </div>
        </div>

        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>`;
    document.body.appendChild(modalDiv)
    document.getElementById('modal-close-btn').addEventListener('click', () => closeModal())
}

const generateCards = (users) => {
    let html = users.results.map(user => 
        `<div class="card" id=${user.login.uuid}>
            <div class="card-img-container">
                <img class="card-img" src="${user.picture.medium}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="card-text">${user.email}</p>
                <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
            </div>
        </div>`
    )
    document.getElementById('gallery').innerHTML = html.join('')
    allUsers = users.results
    return Promise.resolve('All cards added')
}

const generateEvents = () => {
    const cards = document.querySelectorAll('.card')
    cards.forEach(card => card.addEventListener('click',()=>openModal(card.id)))
    return Promise.resolve('All events added')
}


/*API Fetch*/
fetch('https://randomuser.me/api/?results=12').then(res => res.json()).then(generateCards).then(generateEvents);