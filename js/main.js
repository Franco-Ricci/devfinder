const form = document.querySelector(".search__form");
const search = document.querySelector(".search__input");
const api = "https://api.github.com/users/";
const result = document.querySelector(".result");
const nav = document.querySelector(".nav");
const navText = document.querySelector(".nav__text");
const title = document.querySelector(".header__title");
const icon = document.querySelector(".icon");
const noResult = document.querySelector(".search__null");
let mode = true;

let darkMode = localStorage.getItem("dark");

if (darkMode === "enable") {
  document.body.classList.add("dark");
  title.classList.add("toggle-title");
  nav.classList.add("toggle-title");
  navText.innerText = "Light";
  icon.classList.add("fa-sun");
  localStorage.setItem("dark", "enable");
  mode = false;
}

nav.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  title.classList.toggle("toggle-title");
  nav.classList.toggle("toggle-title");

  if (mode) {
    navText.innerText = "Light";
    icon.classList.add("fa-sun");
    localStorage.setItem("dark", "enable");
    mode = false;
  } else if (mode === false) {
    navText.innerText = "Dark";
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
    mode = true;
    localStorage.setItem("dark", "no");
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (search.value === "") {
    console.log("no encontrado");
    result.innerHTML = "";
  }
  const username = search.value.trim();
  if (!username) {
    noResult.classList.add("search__null-show");
    return;
  }

  getUserData(username);
});

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

const getUserData = (username) => {
  fetch(api + username)
    .then(handleErrors)
    .then((result) => result.json())
    .then((data) => showUserData(data))
    .then((data) => noResult.classList.remove("search__null-show"))
    .catch((error) => noResult.classList.add("search__null-show"));
};

const showUserData = (data) => {
  const {
    login,
    avatar_url: avatar,
    name,
    company,
    blog,
    location,
    public_repos: repo,
    email,
    bio,
    twitter_username: twitter,
    followers,
    following,
    created_at: joined,
  } = data;
  const userData = `
    
    <section class="result__section">
        <div class="result">
        <div class="content">
            <div class="avatar">
                <img class="avatar__img" src="${avatar}" alt="">
            </div>
        </div>
        <div class="info">
            <h2 class="info__title">${available(name)}</h2>
            <p class="info__username">@${login}</p>
            <p class="info__text">Joined ${time(joined)}</p>

        </div>
    </div>
        <div class="bio">
            <p class="bio__content">${nobio(bio)}.</p>
        </div>

        <section class="repo__container">
     
        <div class="repo__content">
            <div class="repo__info">
                <p class="title__content">repo</p>
                <p class="title__desc">${repo}</p>
            </div>
            <div class="repo__info">
                <p class="title__content">followers</p>
                <p class="title__desc">${followers}</p>
            </div>
           <div class="repo__info">
            <p class="title__content">following</p>
            <p class="title__desc">${following}</p>
        </div>
        </div>

        <div class="medias">
            <div class="media__content">
            <div class="media__location">
                 <i class="fas fa-map-marker-alt"></i>
               <p> ${available(location)}</p>
            </div>
            <div class="media__link">
                 <i class="fas fa-link"></i> ${
                   blog === "" || null
                     ? `<p>${available(blog)}</p>`
                     : `<a class="twitter__link" href="${available(
                         blog
                       )}" target="_blank"> ${available(blog)}</a>`
                 }
            </div>
        </div>
        <div class="media__content media__content--right">
            <div class="media__twitter">
                <i class="fab fa-twitter"></i>${
                  twitter == null
                    ? `<p>${available(twitter)}</p>`
                    : `<a class="twitter__link" href="${available(
                        twitter
                      )}" target="_blank"> ${available(twitter)}</a>`
                } 
              </a>
                
            </div>
            <div class="media__brand">
                 <i class="fas fa-building"></i>
               <p>${available(company)}</p>

            </div>
        </div>
        </div>
    </section>
    </section>

    `;
  result.innerHTML = userData;
  function time(date) {
    let options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleString("en-EN", options);
  }

  function available(e) {
    if (e === null || e === "") {
      e = "Not Available";
      console.log(e);
    }
    return e;
  }

  function nobio(bio) {
    if (bio === null || bio === "") {
      bio = "This profile has no bio";
    }
    return bio;
  }
};
