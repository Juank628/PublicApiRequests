/*global variables*/
let allUsers = [];
let filteredUsers = [];

/*set global variables after api fetch*/
const setGlobalVariables = (users) => {
  allUsers = users;
  filteredUsers = users;
  return Promise.resolve(users)
}

/*update modal data when prev next and buttons are clicked*/
const changeModal = (direction) => {
    currentIndex = 0
    const currentName = document.querySelector('.modal-name').textContent;
    filteredUsers.forEach((user, index) => {
        if((`${user.name.first} ${user.name.last}`) === currentName){
            currentIndex = index
        }
    })

    let newUserIndex = currentIndex + direction
    if(newUserIndex < 0){
        newUserIndex = 0
    }
    if(newUserIndex >= filteredUsers.length){
        newUserIndex = filteredUsers.length - 1
    }

    const newUser = filteredUsers[newUserIndex]
    document.querySelectorAll('.modal-img')[0].src = newUser.picture.large
    document.querySelectorAll('.modal-name')[0].textContent = `${newUser.name.first} ${newUser.name.last}`
    document.querySelectorAll('.modal-text')[0].textContent = newUser.email
    document.querySelectorAll('.modal-text')[1].textContent = newUser.location.city
    document.querySelectorAll('.modal-text')[2].textContent = newUser.cell
    document.querySelectorAll('.modal-text')[3].textContent = `${newUser.location.street}, ${newUser.location.state} ${newUser.location.postcode}`
    document.querySelectorAll('.modal-text')[4].textContent = `${getBirthday(newUser.dob.date)}`
}

/*format birthday according the mockup*/
const getBirthday = date => {
  birthdayData = date.slice(0, 10).split("-");
  return `${birthdayData[1]}/${birthdayData[2]}/${birthdayData[0].slice(2, 4)}`;
};

/*remove al modal elements when the modal is closed*/
const closeModal = () => {
  document.querySelector(".modal-container").remove();
};

/*open the modal and load all the data according de user uuid*/
const openModal = uuid => {
  const userData = allUsers.filter(user => user.login.uuid === uuid)[0];
  const modalDiv = document.createElement("div");
  modalDiv.className = "modal-container";
  modalDiv.innerHTML = `
            <div class="modal">
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
  document.body.appendChild(modalDiv);
  document.getElementById("modal-close-btn").addEventListener("click", () => closeModal());
  document.getElementById("modal-prev").addEventListener('click', ()=>changeModal(-1));
  document.getElementById("modal-next").addEventListener('click', ()=>changeModal(+1));
};

/*render the user cards and load its data*/
const generateCards = users => {
  let html = users.map(
    user =>
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
  );
  document.getElementById("gallery").innerHTML = html.join("");
  return Promise.resolve("All cards added");
};

/*add event listener to each card*/
const generateCardEvents = () => {
  const cards = document.querySelectorAll(".card");
  cards.forEach(card =>card.addEventListener("click", () => openModal(card.id)));
  return Promise.resolve("All events added");
};

/*filter cards according the search input*/
const search = name => {
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => card.remove());
  filteredUsers = allUsers.filter(user =>
    user.name.first.toLowerCase().includes(name.toLowerCase()) ||
    user.name.last.toLowerCase().includes(name.toLowerCase())
  );
  generateCards(filteredUsers);
  generateCardEvents();
};


/*Add search bar and search events when the page is loaded*/
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".search-container").innerHTML = `
          <form action="#" method="get">
              <input type="search" id="search-input" class="search-input" placeholder="Search...">
              <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
          </form>
          `;
  
    document.querySelector("form").addEventListener("submit", e => {
      e.preventDefault();
      search(document.querySelector(".search-input").value);
    });
  });

/*API Fetch*/
fetch("https://randomuser.me/api/?results=12&nat=us,au,ca,gb")
  .then(res => res.json())
  .then(data => data.results)
  .then(setGlobalVariables)
  .then(generateCards)
  .then(generateCardEvents)
  .catch(err => console.log(err));
