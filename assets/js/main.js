"use strict"
let cityName="", 
    days,
    today,
    search = document.getElementById('search');

let urlValid = false;

let todayName = document.getElementById('todayName'),
    todayDate = document.getElementById('todayDate'),
    todayDegree = document.getElementById('todayDegree'),
    todayCondition = document.getElementById('todayCondition'),
    todayDegreeIcon = document.getElementById('todayDegreeIcon'),
    moreInfo = document.getElementById('moreInfo');


let dayName1 = document.getElementById('dayName1'),
    dayDate1 = document.getElementById('dayDate1');

let degreeIcon1 = document.getElementById('degreeIcon1'),
    avgdegree1 = document.getElementById('avgdegree1'),
    moreinfo1 = document.getElementById('moreinfo1');

let dayName2 = document.getElementById('dayName2'),
    dayDate2 = document.getElementById('dayDate2');

let degreeIcon2 = document.getElementById('degreeIcon2'),
    avgdegree2 = document.getElementById('avgdegree2'),
    moreinfo2 = document.getElementById('moreinfo2');



async function findcity(){

     async function success(position){

        // console.log(position);
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        let x;
        const geoApiUrl = `https://api-bdc.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=bdc_c52ea5af3ce44c4d9f8eea3426f63010`
        let location = await fetch(geoApiUrl).then(res => res.json()).then(data => {
            x=data;
        })
        
        getData(x.city);

    }
    const error = () => {
        console.log("unable to retrive")
    }

    navigator.geolocation.getCurrentPosition(success, error);

}
findcity();


async function getData(city){
    // 1c47c51c374e4b10a42165133232108
    let res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=1c47c51c374e4b10a42165133232108&q=${city}&days=3`);

    if(!res.ok || res.status != 200){
        urlValid = true;    
    }else{
        if(res.ok || (res.status >= 200 && res.status <= 299)){
            let info =await res.json();
            console.log(info);
            cityName = info.location.name;
            today = info.current;
            days = info.forecast.forecastday;

            displayName(cityName)
            displayToday(today);
            displayDays(dayName1, dayDate1, degreeIcon1, avgdegree1, moreinfo1, days[1]);
            displayDays(dayName2, dayDate2, degreeIcon2, avgdegree2, moreinfo2, days[2]);
        }
    }
}

var city = document.getElementById('city');
function displayName(name) {
    city.innerHTML = cityName;
}



function displayToday(Today){
    todayName.innerHTML = `${dayName(Today.last_updated)}`;
    let dateNumbers = Today.last_updated.slice(0,10);
    todayDate.innerHTML = dateNumbers;
    todayDegree.innerHTML= `${Today.temp_c}<sup>o</sup>C`;
    todayCondition.innerHTML = Today.condition.text;
    console.log(Today.condition.icon);
    todayDegreeIcon.src = Today.condition.icon;

    moreInfo.innerHTML = `<span><i class="fa-solid fa-water"></i>${Today.humidity}%</span>
    <span><i class="fa-solid fa-wind"></i>${Today.wind_kph}Km/h</span>`;
    
}


function displayDays(daysName, daysDate, daysDegreeIcon, avgDegree, moreInfo, days){
    daysName.innerHTML = dayName(days.date);
    daysDate.innerHTML = days.date;
    daysDegreeIcon.src = days.day.condition.icon;
    avgDegree.innerHTML = days.day.avgtemp_c;
    moreInfo.innerHTML = `<span>max ${days.day.maxtemp_c}<sup>o</sup>C</span>
    <span>${days.day.condition.text}</span>
    <span>min ${days.day.mintemp_c}<sup>o</sup>C</span>`;

}




search.addEventListener('keyup', function(){
    let NameRegex = /[a-zA-Z]{3,}/;
    if(NameRegex.test(search.value) && urlValid == false) {
        getData(search.value);
        document.querySelector('.warning').classList.add("d-none");
    }else{
        if (urlValid==true) {
            document.querySelector('.warning').classList.remove("d-none")
        }
    }

    if(search.value ==""){
        document.querySelector('.warning').classList.add("d-none");
    }
    urlValid = false;
})


function dayName(currentTime){
    let weekdays =  ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let d = new Date(currentTime);
    let day = weekdays[d.getDay()];
    return day;
}