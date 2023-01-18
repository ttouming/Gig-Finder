const searchInput = document.querySelector("[data-input]");
const searchButton = document.querySelector("[data-search]");
const eventTemplate =  document.querySelector("[event-user-template]");
const eventContainer = document.querySelector("[event-user-container]");
// ---flickr search---

// // ---leaflet map layer---
const map = L.map('map').setView([40.730610, -73.935242], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);
// // ---leaflet map layer---

let localName = "";

searchInput.addEventListener("input", e => {
    localName = e.target.value;
    console.log(localName);

})

searchButton.addEventListener("click", e=>{
    // get location data
    localName = localName.toLowerCase()
    location_locaiton(localName)
})

const events_events = async () => {
 
    let res = await fetch(`http://localhost:3000/search/venues_events_data4`)
    let allData = await res.json();
    console.log(allData)
    const pageCounter = document.querySelector("[user-page-counter]");
    let tt = Object.keys(allData)[0]
    pageCounter.textContent = allData[Object.keys(allData)[0]][0].counter;


    for(let item in allData){
        
        L.marker([allData[item][0].venue.location.lat, allData[item][0].venue.location.lon]).addTo(map).bindPopup(allData[item][0].venue.name).on("popupopen", function(event){
            showEvent(allData[item])
        });
    }

}

const showEvent = (d)=>{

    eventData = d.map((d)=>{

        if(d.performers.length>1){

            let temp = "";
            for(let i = 0; i < d.performers.length; i++){
                if(d.performers[i].type == "music_festival"){
                    i++;
                }
                else{
                    temp += d.performers[i]["name"]+", ";
                }
            }
            return{
                type : d.type,
                time: d.datetime_utc,
                end_time: d.enddatetime_utc,
                performers_type: d.performers[0]["type"],
                performers_name: temp,
                performers_image: d.performers[0]["image"],
                performers_url: d.performers[0]["url"],
                title: d.title,
                price: d.stats.average_price,
                ytLink: d.ytLink
            };
        }
        else{
            return{
                type : d.type,
                time: d.datetime_utc,
                end_time: d.enddatetime_utc,
                performers_type: d.performers[0]["type"],
                performers_name: d.performers[0]["name"],
                performers_image: d.performers[0]["image"],
                performers_url: d.performers[0]["url"],
                title: d.title,
                price: d.stats.average_price,
                ytLink: d.ytLink
            };
        }
    })

    console.log(eventData);

    // ---remove old image---
    for(let j = 0; j < 10; j++){
        if(document.getElementById("eve"+j)!=null){
            let eventOld = document.getElementById("eve"+j);
            eventOld.parentNode.removeChild(eventOld);
        }
    }
    // ---remove old image---
    // using while loop to get all the img tag with id = "temp".
    // Then remove the old img tag.

    let i = 0;
    // ---display image---
    eventData.forEach(element => {
        const eventTemp = eventTemplate.content.cloneNode(true);
        console.log(element);
        const card = eventTemp.querySelector("[event-info-temp]");
        const img = eventTemp.querySelector("[event-user-image]");
        const title = eventTemp.querySelector("[event-title");
        const type = eventTemp.querySelector("[event-type]");
        const time = eventTemp.querySelector("[event-time]");
        const endtime = eventTemp.querySelector("[event-endtime]");
        const performersType = eventTemp.querySelector("[performers-type]");
        const performersName = eventTemp.querySelector("[performers-name]");
        const performersUrl = eventTemp.querySelector("[performers-url]");
        const price = eventTemp.querySelector("[event-price]");
        const link = eventTemp.querySelector("[event-yt]")
        card.id = "eve" + i;
        i++;
        img.id = "temp";
        element.performers_image == null ? console.log(""):img.src =element.performers_image;
        img.alt ="no photo available";
        title.textContent = element.title;
        type.textContent = element.type;
        time.textContent = element.time;
        endtime.textContent = element.end_time
        performersName.textContent = element.performers_name;
        performersType.textContent = element.performers_type;
        performersUrl.href = element.performers_url;
        performersUrl.textContent = element.performers_url;
        price.textContent = element.price;
        link.src= `https://www.youtube.com/embed/${element.ytLink}`       
        eventContainer.append(eventTemp);
    });
    // ---display image---
}

const location_locaiton = async (d) => {
    let res = await fetch(`http://localhost:3000/location/${d}`)
    let allData = await res.json();

    console.log(allData)

    display_weather_table(allData)

}


const display_weather_table = (allData)=>{

    const name = document.querySelector("[search-location-name]");
    const overall = document.querySelector("[search-location-overall]");
    const temp = document.querySelector("[search-location-temp]");
    const humidity = document.querySelector("[search-location-humidity]");
    const wind_speed = document.querySelector("[search-location-windspeed]");
    const wind_chill = document.querySelector("[search-location-windchill]");
    name.textContent = allData.location.city;
    overall.textContent = allData.current_observation.condition.text;
    temp.textContent = ((allData.current_observation.condition.temperature-32)*5/9).toFixed(2);
    humidity.textContent = allData.current_observation.atmosphere.humidity;
    wind_speed.textContent = allData.current_observation.wind.speed;
    wind_chill.textContent = ((allData.current_observation.wind.chill-32)*5/9).toFixed(2);

    map.flyTo([allData.location.lat,allData.location.long], 10);
}

events_events();