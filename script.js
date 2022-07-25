// Get references to DOM elements we need to manipulate
const searchTerm = document.querySelector('.search');
const searchForm = document.querySelector('form');
const submitBtn = document.querySelector('.submit');
const section = document.querySelector('section');
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');
const nav = document.querySelector('nav');

// write API key to constant
const key = 'AIzaSyDjHlsKYnaIMLbDzyi_0RYJxE8CwIRT0F4';

// Hide navigation before results shows
nav.style.display = 'none';

// Load and initialize the API, then run the onYouTubeApiLoad() function once this is done
window.addEventListener('load', onClientLoad);

function onClientLoad() {
  gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

function onYouTubeApiLoad() {
  // Attach your key to the API
  gapi.client.setApiKey(key);

  // Add listener to search form when APIs are loaded
  searchForm.addEventListener('submit', search);
}

function search(e) {
  e.preventDefault();

  // function to make request to API
  makeRequest();
}

function makeRequest(pageOrder = '') {
  // create a search request using the Data API
  const request = gapi.client.youtube.search.list({
    part: 'snippet', // kind of data we need
    maxResults: 10, // number of results
    order: 'viewCount', // view most popular videos
    pageToken: pageOrder, // pageOrder = '' by default, because this data is undefined on request from form
    q: searchTerm.value // our input value
  });

  // callback for 'when response loaded' state
  request.execute(onSearchResponse);
}

function onSearchResponse(response) {
  section.innerHTML = '';
  const results = response.items;

  for(const current of results) {
    displayVideo(current, results.indexOf(current));
  }

  // Set page tokens from response to constants
  const nextPageToken = response.nextPageToken;
  const prevPageToken = response.prevPageToken;

  // Show navigation to page moving
  nav.style.display = 'flex';
  nav.addEventListener('click', (e) => {
    turnPage(e, nextPageToken, prevPageToken);
  });
}

function turnPage(e, nextPageToken, prevPageToken) {
  if(e.target.classList.contains('prev')) {
    makeRequest(prevPageToken);
  }

  if(e.target.classList.contains('next')) {
    makeRequest(nextPageToken);
  }
}

function displayVideo(result, i) {
  const id = result.id.videoId;
  const title = result.snippet.title;

  const video = document.createElement('div');
  video.classList.add('video', 'video--enabled');

  // If iframe work incorrect set link to video images
  const videoLink = document.createElement('a');
  videoLink.classList.add('video__link');
  videoLink.href = 'https://youtu.be/' + id;
  videoLink.title = title;
  videoLink.setAttribute('target', '__blank');

  const picture = document.createElement('picture');
  const source = document.createElement('source');
  source.srcset = `https://i.ytimg.com/vi_webp/${id}/maxresdefault.webp`
  source.type = 'image/webp';

  const image = document.createElement('img');
  image.classList.add('video__media');
  image.src = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  image.alt = `Wrapper for "${title}".`;

  const videoButton = document.createElement('button');
  videoButton.classList.add('video__button');
  videoButton.setAttribute('aria-label', 'Запустить видео');
  videoButton.innerHTML = '<svg width="68" height="48" viewBox="0 0 68 48"><path class="video__button-shape" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"></path><path class="video__button-icon" d="M 45,24 27,14 27,34"></path></svg>';

  section.append(video);
  video.append(videoLink, videoButton);
  videoLink.append(picture);
  picture.append(source, image);

  // Setup video images settings for load iframe by click
  setupVideo(video, id);
}

function setupVideo(video, videoId) {
  const link = video.querySelector('.video__link');
  const button = video.querySelector('.video__button');

  video.addEventListener('click', () => {
    const iframeBlock = document.createElement('div');
    iframeBlock.classList.add('video__media');
    video.append(iframeBlock);

    // The YouTube Iframe Player API will replace each one with
    // an <iframe> containing the corresponding video
    new YT.Player(iframeBlock, {
      height: '100%',
      width: '100%',
      videoId: videoId,
      events: {
        'onReady': (e) => e.target.playVideo()
      }
    });

    link.remove();
    button.remove();
  });

  link.removeAttribute('href');
}