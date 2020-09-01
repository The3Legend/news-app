// Custom Http Module
function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}
// Init http module
const http = customHttp();

const newsService = (function () {
  const apiKey = '64579aa6bc00497eb660047e1b574368'
  const apiUrl = 'https://news-api-v2.herokuapp.com'
  return {
    topHeadLines(country = 'ua', cb) {
      http.get(`${apiUrl}/top-headlines?country=${country}&category=technology&apiKey=${apiKey}`, cb);
    },
    everything(query, cb) {
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
    },
  }
})();


// Elements
const form = document.forms['newsControls']
const countrySelect = form.elements['country']
const serchInput = form.elements['search']

form.addEventListener('submit', (e) => {
  e.preventDefault();
  loadNews();
})

//  init selects
document.addEventListener('DOMContentLoaded', function () {
  M.AutoInit();
  loadNews();
});


function loadNews() {
  showPreloader();
  const coutry = countrySelect.value
  const searchText = serchInput.value
  if (!searchText) {
    newsService.topHeadLines(coutry, oneGetRespons)
  } else
    newsService.everything(searchText, oneGetRespons)
}


function oneGetRespons(err, res) {
  removePreloader();
  if (err) {
    showAllert(err, 'error-msg')
  }

  if (!res.articles.length) {
    notArr()
    
    return
  }
  renderNews(res.articles);
}

function renderNews(news) {
  const newsContainer = document.querySelector('.news-container .row')
  if (newsContainer.children.length) {
    clearContainer(newsContainer)
  }
  let fragm = ''
  news.forEach(newsItem => {
    const el = newsTemplate(newsItem)
    fragm += el
  });
  newsContainer.insertAdjacentHTML('afterbegin', fragm)
}

function clearContainer(container) {
  container.innerHTML = '';

}


function newsTemplate({
  urlToImage,
  title,
  url,
  description
}) {

  return `<div class="col s12">
  <div class="card">
  <div class="card-image">
  <img src="${urlToImage || '3.jpg'}">
  <span class="card-title">${title || ''}</span>
  </div>
  <div class="card-content">
  <p>${description || ''}</p>
  </div>
  <div class=  "card-action">
  <a href = "${url}">Read more</a>
      </div>
    </div>
  </div>`;

}

function showAllert(msg, type = 'successs') {
  M.toast({
    html: msg,
    classes: type,
    classes: 'rounded'


  });
}


function showPreloader() {
  document.body.insertAdjacentHTML('afterbegin', `<div class="progress">
  <div class="indeterminate"></div>
</div>`)
}

function removePreloader(){
  const loader = document.querySelector('.progress');
  if(loader){
    loader.remove();
  }
}

function notArr(){
  alert('нічого не знайдено')
}

