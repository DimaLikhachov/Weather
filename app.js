function loadData(city, cb) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=579ce9be7b3d705d828bc82c79ffc8a2&units=metrical`;
  const method = 'GET';
  const request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      const data = JSON.parse(request.responseText);
      cb(data);
    }
  };
  request.open(method, url);
  request.send();
}

var addedCities = [];
var weatherContainer = document.querySelector('#weatherContainer');
var buyCur = document.querySelectorAll('.buy');
var saleCur = document.querySelectorAll('.sale');
var myCityWeather = document.querySelector('#myCityWeather');
retrieveDataFromStorage();
renderWeather(addedCities);

function temperatureTransducer(value) {
  let result = value - 273.15;
  return Math.round(result);
}

function onDataReceived(data) {
  addedCities.push(data);
  weatherContainer.innerHTML = '';
  renderWeather(addedCities);
  addDataToStorage(addedCities);
}

function renderWeather(value) {
  value.forEach(function(element, index) {
    var newCity = document.createElement('div');

    weatherContainer.appendChild(newCity);
    newCity.innerHTML = `
    <div class="weatherDescription">
    <button data-index= "${index}" class="btnDeleteCity"><img src="cross.png" alt="" class="crossImg"></button>
    <h1>${element.name}, ${element.sys.country}</h1>
    <div>${temperatureTransducer(element.main.temp)}°C</div>
    <div>${element.weather[0].description}
    <img src="https://openweathermap.org/img/w/${
      element.weather[0].icon
    }.png" alt=""></div> 
    <hr>
    <div>humidity: ${element.main.humidity}%</div>
    <div>wind: ${element.wind.speed}m/s</div> 
    </div>`;
  });
}

weatherContainer.addEventListener('click', function() {
  let dataIndex = event.target.closest('.btnDeleteCity');
  let del = dataIndex.dataset.index;
  addedCities.splice(del, 1);
  weatherContainer.innerHTML = '';
  addDataToStorage(addedCities);
  renderWeather(addedCities);
});

function getsearchInputValue() {
  let searchInputValue = document.querySelector('#searchInput').value;

  if (searchInputValue) {
    loadData(searchInputValue, onDataReceived);
    document.querySelector('#searchInput').value = '';
  }
}

var searchBtn = document.querySelector('#searchBtn');
searchBtn.addEventListener('click', getsearchInputValue);

function addDataToStorage(data) {
  var session = JSON.stringify(data);
  sessionStorage.setItem('listCity', session);
}

function retrieveDataFromStorage() {
  var back = sessionStorage.getItem('listCity');
  if (back) {
    addedCities = JSON.parse(back);
  }
}

function loadCurrency(funcBuy, funcSale) {
  const url =
    'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';
  const method = 'GET';
  const request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      const result = JSON.parse(request.responseText);
      funcBuy(result);
      funcSale(result);
    }
  };
  request.open(method, url);
  request.send();
}
function renderBuy(data) {
  buyCur.forEach(function(element, index) {
    element.innerHTML = data[index].buy;
  });
}
function renderSale(data) {
  saleCur.forEach(function(element, index) {
    element.innerHTML = data[index].sale;
  });
}
loadCurrency(renderBuy, renderSale);

function loadMyCity(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=579ce9be7b3d705d828bc82c79ffc8a2&units=metrical`;
  const method = 'GET';
  const request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      const data = JSON.parse(request.responseText);

      renderMyCity(myCityWeather, data);
    }
  };
  request.open(method, url);
  request.send();
}

function renderMyCity(parent, data) {
  parent.innerHTML = `
  <div  id="geolocationWeather">
  <h1>Your City</h1>
  <h3>${data.name}, ${data.sys.country}</h3>
  <div>${temperatureTransducer(data.main.temp)}°C</div>
  <div>${data.weather[0].description}
  <img src="https://openweathermap.org/img/w/${
    data.weather[0].icon
  }.png" alt=""></div> 
  <hr>
  <div>humidity: ${data.main.humidity}%</div>
  <div>wind: ${data.wind.speed}m/s</div> 
  </div>`;
}

navigator.geolocation.getCurrentPosition(
  function(position) {
    loadMyCity(position.coords.latitude, position.coords.longitude);
  },
  function(err) {
    console.log(err);
  }
);
