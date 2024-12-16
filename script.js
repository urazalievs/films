"use strict"
document.addEventListener("DOMContentLoaded", function(){
    // Элементы
const main = document.getElementsByClassName("main")[0];
const movieTitle = document.getElementsByClassName("movieTitle")[0];
const simTitle = document.getElementsByClassName("movieTitle")[1];

const semularMovie = document.getElementsByClassName("semularMovie")[0];
const movie = document.getElementsByClassName("movie")[0];


// кнопки

const searchBtn = document.getElementById("searchBtn");
const themeChange = document.getElementById("themeChange");

if(themeChange){
    themeChange.addEventListener("click", themeCh);
}
if(searchBtn){
    searchBtn.addEventListener("click", findMovie)  
}


// Слушатели событий


// Добавляем слушатель события на нажатие клавиши
document.addEventListener('keydown', function(event) {
    // Проверяем, была ли нажата клавиша пробела
    if (event.code === 'Enter') {
        findMovie()
    }
});


// Смена темы 
function themeCh(){
    let body = document.querySelector("body");
    body.classList.toggle("dark")
}


// API
async function sendRequest(url, method, data) {
    if(method == "POST") {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    
        response = await response.json()
        return response
    } else if(method == "GET") {
        url = url+"?"+ new URLSearchParams(data)
        let response = await fetch(url, {
            method: "GET"
        })
        response = await response.json()
        return response
    }
}




// Поиск фильма
async function findMovie(){
    let search = document.getElementsByName("search")[0].value;
    let data = { apikey: "d6d0aa42", t: search };
    let loader = document.getElementsByClassName("loader")[0]
    loader.style.display="block";
    let response = await sendRequest("https://www.omdbapi.com/" , "GET", data);
    loader.style.display="none";
    
    if(response.Response == "False"){
        movie.style.display="none"
        main.style.display="block"
        movieTitle.style.display="block"
        movieTitle.innerHTML = `${response.Error}`
        console.log(response);
        semularMovie.style.display="none";
        simTitle.style.display="none"
    }else{
        semularMovie.style.display="block";
       showMovie(response)
       findSimularMovies()
    }
}

const findSimularMovies = (async ()=>{
    const search = document.getElementsByName("search")[0].value;
    const simularMovieTItle = document.getElementsByClassName("movieTitle")[1];
    const data = { apikey: "d6d0aa42", s: search };
    const result = await sendRequest("https://www.omdbapi.com/" , "GET", data);
    
    if(result.Response=="False"){
    }else{
        simularMovieTItle.innerHTML = `Найдено похожих фильмов ${result.totalResults}`;
        simularMovieTItle.style.display="block"
        console.log(result.Search);
        
        showSimularMovie(result.Search)
        
    }
});

// Отрисовка похожих фильмов

function showSimularMovie(movies){
    const semularMovie = document.getElementsByClassName("semularMovie")[0];
    semularMovie.innerHTML= "";
    semularMovie.style.display="flex";
    for(let i= 0; i < movies.length; i++){
        const movie = movies[i];
        if(movie.Poster != "N/A"){
            let simularMovie = `
        <div class="semularMovieCard" style="background-image: url('${movie.Poster}');">
            <div class="saved" onclick="addSaved(event)"
                data-imdbID="${movie.imdbID}" data-title="${movie.Title}" data-poster="${movie.Poster}">
            </div>  
            <div class="semularMovieCardTitle" >
                ${movie.Title}
            </div>
        </div>`
        semularMovie.innerHTML += simularMovie;
        
        }else{
        };

    };
}



 function showMovie(movie){
    main.style.display="block"
    movieTitle.style.display="block"
    document.getElementsByClassName("movie")[0].style.display="flex";
    document.getElementById("movieImg").style.backgroundImage = `url(${movie.Poster})`;
    movieTitle.innerHTML = `${movie.Title}`
    const movieDesc = document.getElementsByClassName("movieDescription")[0];
    movieDesc.innerHTML ="";
    let params = [
        "imdbRating", "Year", "Released", "Genre", "Country", "Language", "Director", "Writer", "Actors", 
    ]
    
    params.forEach((key)=>{
        movieDesc.innerHTML+= `
        <div class="desc">
            <span class="title">${key}</span>
            <span class="subTitle">${movie[key]}</span>
          </div>
        `
    });
}
});

// Добавляем в Избранное
function addSaved(event){
    const target = event.currentTarget

    const movieData ={
        title:target.getAttribute("data-title"),
        poster:target.getAttribute("data-poster"),
        imdbID:target.getAttribute("data-imdbID"),
    }

    const favs = JSON.parse(localStorage.getItem("favs")) || [];

    const movieIndex = favs.findIndex((movie)=>movie.imdbID === movieData.imdbID);
    if(movieIndex > -1){
        target.classList.remove("active");
        favs.splice(movieIndex,1)
    }else{
        target.classList.add("active");
        favs.push(movieData);
        console.log(favs);
        
    }
    localStorage.setItem("favs", JSON.stringify(favs))
};  

const favoriTes = JSON.parse(localStorage.getItem("favs"))
const favCard = document.getElementsByClassName("favoritsCards")[0];
console.log(favoriTes);

favoriTes.forEach((elem)=>{
    const card =document.createElement("div");
    const cardTitle = document.createElement("div");
    const cardStar = document.createElement("div");
    cardStar.classList.add("saved");
    cardStar.addEventListener("click", ()=> cardDelete(elem.imdbID))
    cardTitle.classList.add("favTItle");
    cardTitle.innerHTML= elem.title;
    card.classList.add("favoritsCard");
    card.setAttribute("data-imdbID", elem.imdbID);
    card.style.backgroundImage= `url(${elem.poster})`;
    card.appendChild(cardStar);
    card.appendChild(cardTitle);
    favCard.appendChild(card);  
});


// Функция для удаления карточки из избранного
function cardDelete(imdbID) {
    
    // Получаем массив избранных фильмов из localStorage
    let favs = JSON.parse(localStorage.getItem("favs")) || [];
    
    // Находим индекс фильма по imdbID
    const movieIndex = favs.findIndex(movie => movie.imdbID === imdbID);

    if (movieIndex > -1) {
        // Удаляем фильм из массива
        favs.splice(movieIndex, 1);

        // Обновляем localStorage
        localStorage.setItem("favs", JSON.stringify(favs));

        // Удаляем карточку из DOM
        const cardToDelete = document.querySelector(`.favoritsCard[data-imdbID="${imdbID}"]`);
        if (cardToDelete) {
            cardToDelete.remove();  // Удаляем карточку
        }
    }
}