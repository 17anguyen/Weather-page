var weekDays = $('#WeekDays');
var historyDisplayEL = $('#search-history');
var currentDays = $('#current');
var currentDate =  dayjs().format(' [-] MMM DD, YYYY [-]');
var searchButtonEL = $('#search-button')
var userInputEl = $('#city-selected');
var APIKey = "ae365f2f4356784124a0cf127763905e"

// pull from local
function searchHistory(){
    var searchHistory = pullLS();

    if (searchHistory){
            for(i=0;i< searchHistory.length ;i++){
                var buttonHistory = $('<button>');
                buttonHistory.addClass('button button-history');
                buttonHistory.text(searchHistory[i]);
                historyDisplayEL.append(buttonHistory);
                buttonHistory.on('click',historyDisplayEL);
            }
            historyDisplayEL.children().attr('style','visibility:visible');
            

        }
}


function prevInputVal(){
    var searchHistory = pullLS();
    var prevInput = searchHistory.slice(-1);
    var buttonHistory = $('<button>');
    buttonHistory.addClass('button button-history');
    buttonHistory.text(prevInput);
    historyDisplayEL.append(buttonHistory);
    historyDisplayEL.children().attr('style','visibility:visible');
    buttonHistory.on('click',historyButtonClick);

}

function historyButtonClick(event){
    event.preventDefault();
    var currentSelected = event.currentTarget.firstChild.textContent.trim();
    locationSelector(currentSelected);
}

// function to get search history from local 
function pullLS(){
    var lsHistory = localStorage.getItem('searchHistory');
  if (lsHistory) {
    lsHistory = JSON.parse(lsHistory);
  } else {
    lsHistory = [];
  }
  return lsHistory;
}

//fetch weather API  


function locationSelector(searchLocation){
   
    var geoURL =  'https://api.openweathermap.org/geo/1.0/direct?q='+searchLocation+',US&limit=1&appid='+APIKey

    fetch(geoURL)
    .then(function(response){
        // console.log("type", typeof response)
        // console.log("object", response)
        return response.json();
    })
    .then(function(data){ 
        var lat = data[0].lat;
        var lon = data[0].lon;
        var forecastRequest = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&cnt=50&units=imperial&appid="+APIKey;
        var currentWeather ="https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=imperial&appid="+APIKey;

        // fetche current weather
        fetch(currentWeather)
        .then(function(currentResponse){
            return currentResponse.json();

        })
        .then(function(currentOutput){

            currentDays.children('h3').text(currentOutput.name);
            currentDays.children('h3').append(currentDate);

            if(currentOutput.weather.length > 0 ){
                for(var i=0; i < currentOutput.weather.length; i++){
                   var imageSrc = 'https://openweathermap.org/img/wn/'+currentOutput.weather[i].icon+'@2x.png';
                   var icon = $('<img>');
                   icon.attr('style', 'width:50px');
                   icon.attr('alt','weather icon');
                   icon.attr('src',imageSrc );
                   currentDays.children('h3').append(icon);
                }
            }

            currentDays.children().eq(1).text('Temp: '+currentOutput.main.temp+ '°F');
            currentDays.children().eq(2).text('Wind: '+currentOutput.wind.speed+ ' MPH');
            currentDays.children().eq(3).text('Humidity: '+currentOutput.main.humidity+' %');
        })
        
        fetch(forecastRequest)
        .then(function(forecastResponse){
            return forecastResponse.json();

        })
        .then(function(forecastOutput){
             var weeklyList = [];

            for (var i=0; i < forecastOutput.list.length ; i+=8){
                weeklyList.push(forecastOutput.list[i])
            }

            for (var i=0; i< weeklyList.length;i++){
                var x= i+1
                var divEl = $($('#day'+ x))
                var date = dayjs(weeklyList[i]['dt_txt']).format('MMM DD, YYYY');
                var imageSrc = 'https://openweathermap.org/img/wn/'+weeklyList[i].weather[0].icon+'@2x.png'

                divEl.children('h5').text(date);
                divEl.children('img').attr('src',imageSrc)
                divEl.children().eq(2).text('Temp: ' + weeklyList[i].main.temp+ ' °F');
                divEl.children().eq(3).text('Wind: ' + weeklyList[i].wind.speed+ ' MPH')
                divEl.children().eq(4).text('Humidity: ' + weeklyList[i].main.humidity+ ' %');  
            } 
           
        })
        weekDays.attr('style','visibility:visible;');
        currentDays.attr('style','visibility:visible;');
    });
    
}


function searchButton(event){
    event.preventDefault();
    var inputValue = userInputEl.val();
    locationSelector(inputValue);
    commitLS(inputValue);
    prevInputVal();
    userInputEl.val('');

}


//save city to local storage 
function commitLS(searchLocation){
    var listsearchHist = pullLS();
    listsearchHist.push(searchLocation);
    localStorage.setItem("searchHistory", JSON.stringify(listsearchHist));
}

// call when page loads 
searchHistory()

//search button click
searchButtonEL.on('click',searchButton)
  $(searchButtonEL).ready(function() {
    $("#search-button").keyup(function(event) {
        if (event.which === 13) {
            $("#search-button").click();
            console.log("clicked2");
        }
    });
 
    $("#search-button").click(function() {
        searchButton();
        console.log("clicked1");
    })
});


// var array= [1,2,3]
// Array.from()

// Object.assign()






