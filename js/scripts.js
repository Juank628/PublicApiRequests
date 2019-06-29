const generateCards = (users) => {
    let html = users.results.map(user => 
        `<div class="card">
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
    $('#gallery').html(html.join(''))
    console.log(users.results)
}



/*API Fetch*/

fetch('https://randomuser.me/api/?results=12').then(res => res.json()).then(generateCards);