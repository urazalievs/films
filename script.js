"use strict"

// Элементы
const main = document.getElementsByClassName("main")[0];
const movieTitle = document.getElementsByClassName("movieTitle")[0];
const simTitle = document.getElementsByClassName("movieTitle")[1];

const semularMovie = document.getElementsByClassName("semularMovie")[0];
const movie = document.getElementsByClassName("movie")[0];


// кнопки
const themeChange = document.getElementById("themeChange");
const searchBtn = document.getElementById("searchBtn")

// Слушатели событий
themeChange.addEventListener("click", themeCh);
searchBtn.addEventListener("click", findMovie)

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
        
    }else{
       showMovie(response)
        
    }
    
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
    })
    console.log(movie);
    
}



