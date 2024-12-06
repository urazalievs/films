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
    
    console.log(semularMovie);
    
       showMovie(response)
       findSimularMovies()
    }
}

const findSimularMovies = (async ()=>{
    const search = document.getElementsByName("search")[0].value;
    const simularMovieTItle = document.getElementsByClassName("movieTitle")[1];
    const data = { apikey: "d6d0aa42", s: search };
    const result = await sendRequest("https://www.omdbapi.com/" , "GET", data);
    console.log(result);
    if(result.Response=="False"){
    }else{
        simularMovieTItle.innerHTML = `Найдено похожих фильмов ${result.totalResults}`;
        simularMovieTItle.style.display="block"
        console.log(result.Search);
        
        showSimularMovie(result.Search)
    }
});

// Отрисовка похожих фильмов

const showSimularMovie = async(movies)=>{
    const semularMovie = document.getElementsByClassName("semularMovie")[0];
    semularMovie.innerHTML= "";
    semularMovie.style.display="flex";
    movies.forEach((elem)=>{
        
        if(elem.Poster != "N/A"){

            let simularMovie = 
            `
        <div class="semularMovieCard" style="background-image: url('${elem.Poster}');">
            <div class="saved" onclick="addSaved()"
                data-imdbID="${elem.imdbID}" data-title="${elem.Title}" data-poster="${elem.Poster}">
            </div>  
            <div class="semularMovieCardTitle" >
                ${elem.Title}
            </div>
        </div>`
        semularMovie.innerHTML += simularMovie
        }else{
            semularMovie.innerHTML= ''
        };

    });
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








// Тест

// const allPerson = [];
// const addPerson = (add, addData = Date()) =>({
//     ...add,
//     addData,
//     // addData,
// });

// const sul = {
//     name: 'Sultanbek' ,
//     age: 30,
//     stydy: 'backend'
// }
// const person = {
//     name: 'Sultan' ,
//     age: 25,
//     stydy: 'frontEnd'
// }

// allPerson.push('addPerson(sul))');
// console.log(allPerson);

// console.log(addPerson(sul));

// const personw = addPerson(person);
// console.log(person);

// console.log(personw);


// const mapArr = [12, 23, 34  ];

// console.log(mapArr);

// const newArr = mapArr.map((a) => {
//     a - 3
//     return a - 3
// } )

// console.log(newArr);

// const userSul = {
//     name: 'Sultan',
//     age: 25,
//     country: 'Tashkent'
// }

// const userINform = ({name , age}) => {
//     if (!age){
//         return `You don't ${name} !`
//     }
//     return `You ${name} welcome)`
// }

// console.log(userINform(userSul));


// const {name, age , country} = userSul;

// const mmmm = name;
// console.log(mmmm);

// console.log(name);
// console.log(age);
// console.log(country);


// const massivLength = ['didi', 'lila', true];

// console.log(massivLength);

// const [mOne , mTwo] = massivLength;
// const [oneM] = massivLength
// // console.log(o);

// console.log(mOne);
// console.log(mTwo);

