const form = document.querySelector('#form');
const search = document.querySelector('#search');
const result = document.querySelector('#result');
const more = document.querySelector('#more');

const apiURL = 'https://api.lyrics.ovh';


// Fetch Songs from API based on search term
async function fetchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  console.log(data)
  displaySongs(data);
}


// Display Songs
function displaySongs(data) {
  let songs = '';

  data.data.forEach(song => {
    songs += `
      <li class='song'>
        <span><strong>${song.artist.name}</strong> - ${song.title}</span>
        <button class='btn' data-artist='${song.artist.name}' data-songtitle='${song.title}'>Get Lyrics</button>
      </li>
    `;
  });

  result.innerHTML = `
  <ul class='songs'>
    ${songs}
  </ul>
 `

 displayBtns(data);
}


// Pagination
function displayBtns(data) {
  if (data.prev || data.next) {
    more.innerHTML = `
      ${data.prev ? `<button class="btn" onClick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
      ${data.next ? `<button class="btn" onClick="getMoreSongs('${data.next}')">Next</button>` : ''}`;
  } else {
    more.innerHTML = '';
  }
}


// fetch more songs - prev or next page
async function getMoreSongs(url) {
  const res = await fetch(url);
  const data = await res.json();

  displaySongs(data);
}

// Get and Display Lyrics
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

  result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
  <span>${lyrics}</span>`;

  more.innerHTML = '';
}

// Event Listeners
form.addEventListener('submit', e => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  fetchSongs(searchTerm);
})

result.addEventListener('click', e => {
  const clickedEl = e.target;

  if (clickedEl.tagName === 'BUTTON') {
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-songtitle');

    getLyrics(artist, songTitle);
  }
})