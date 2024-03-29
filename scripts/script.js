
//call Cat API by defining the variables that will be used for API (creat to bind between variable name and value)
let apiUrl = 'https://api.thecatapi.com/v1/breeds';
let catData = [];

//document notations for the API ' pagination' and 'content'
let masterData = [];
let pagination = document.getElementById('pagination');
let content = document.getElementById('content');

//Initiate bootstrap tooltips
$(document).ready(function () {
  $('body').tooltip({ selector: '[data-toggle=tooltip]' });
});

//Itterate through pagination where image to query the parameters of breeds

let pageNumber = 1;
let start = 0;
let end = 6;
let recsPerPage = 6;
let totalPages = 0;

//Use the async function getData() to fetch the data from CAT API by returning a promise 
// in the content and then await
async function getData() {
  content.innerHTML = `<div class="d-flex justify-content-center">
    <div class="spinner-border text-light" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    </div>`;
  let req = await fetch(apiUrl, {
    headers: {
      'x-api-key': '620a575b-88cf-4cb6-8254-38d843d30754',
    },
  });
  
  // Use MasterData to fetch the object that contains the data for all cats in the database
  
  masterData = await req.json();
  totalPages = Math.ceil(masterData.length / recsPerPage);
  loadData();
  buildPaginationUI();
  checkButtons();
  console.log(masterData);
}

getData();

// Adding event listeners

//Use loadData() to iterate through each cat 
  
function loadData() {
  catData = masterData.slice(start, end);
  console.log(catData);
  buildUI(catData);
}

// Call the buildUI Function to create the UI for that pageNumber
function loadPage(i) {
  pageNumber = i + 1;
  start = (pageNumber - 1) * recsPerPage;
  end = pageNumber * recsPerPage;
  loadData();
  buildPaginationUI();
  checkButtons();
}
// create function to load previous page
function loadPrevPage() {
  start = start - 7;
  end = end - 7;
  loadData();
  checkButtons();
}
// create function to load next page
function loadNextPage() {
  start = start + 7;
  end = end + 7;
  loadData();
  checkButtons();
}
// create function to load previous page
function checkButtons() {
  let prevButton = document.getElementById('prev');
  if (start === 0) {
    prevButton.className += ' disabled';
    setAttribute(prevButton, 'style', 'cursor: not-allowed;');
  } else {
    prevButton.classList.remove('disabled');
  }

  let nextButton = document.getElementById('next');
  if (end >= masterData.length) {
    nextButton.className += ' disabled';
    setAttribute(nextButton, 'style', 'cursor: not-allowed;');
  } else {
    nextButton.classList.remove('disabled');
  }
}

// itritating on the  buildPaginationUI to build the interace

function buildPaginationUI() {
  pagination.innerHTML = '';

  let paginationDiv = createElement('div');
  setAttribute(paginationDiv, 'class', 'd-flex justify-content-center');
  appendChild(pagination, paginationDiv);

  let navBar = createElement('nav');
  setAttribute(navBar, 'aria-label', 'Pagination Data');
  appendChild(paginationDiv, navBar);

  let ul = createElement('ul');
  setAttribute(ul, 'class', 'pagination');
  appendChild(navBar, ul);

  if (totalPages > 1) {
    //Create previous button and add it to the container
    let prevButton = createElement('li');
    setAttribute(prevButton, 'class', 'page-item');
    setAttribute(prevButton, 'id', 'prev');
    appendChild(ul, prevButton);

    let prevHyperLink = createElement('a');
    setAttribute(prevHyperLink, 'class', 'page-link');
    setAttribute(prevHyperLink, 'style', 'cursor: pointer;');
    setAttribute(prevHyperLink, 'onclick', `loadPrevPage()`);

    prevHyperLink.innerText = 'Previous';
    appendChild(prevButton, prevHyperLink);
    appendChild(ul, prevButton);

    //Create Page number buttons
    for (let i = 0; i < totalPages; i++) {
      let pageNumBtn = createElement('li');
      setAttribute(pageNumBtn, 'class', 'page-item');
      setAttribute(pageNumBtn, 'id', `page${i + 1}`);
      appendChild(ul, pageNumBtn);

      let pageNumLink = createElement('a');
      setAttribute(pageNumLink, 'class', 'page-link');
      setAttribute(pageNumLink, 'style', 'cursor: pointer;');
      setAttribute(pageNumLink, 'onclick', `loadPage(${i})`);
      pageNumLink.innerText = i + 1;
      appendChild(pageNumBtn, pageNumLink);
      appendChild(ul, pageNumBtn);
    }

    //Create next button and add it to the container
    let nextButton = createElement('li');
    setAttribute(nextButton, 'class', 'page-item');
    setAttribute(nextButton, 'id', 'next');
    appendChild(ul, nextButton);

    let nextHyperLink = createElement('a');
    setAttribute(nextHyperLink, 'class', 'page-link');
    setAttribute(nextHyperLink, 'style', 'cursor: pointer;');
    setAttribute(nextHyperLink, 'onclick', `loadNextPage()`);
    nextHyperLink.innerText = 'Next';
    appendChild(nextButton, nextHyperLink);
    appendChild(ul, nextButton);
  }

  // add active class to the selected page button
  let currentBtn = document.getElementById(`page${pageNumber}`);
  currentBtn.classList.add('active');
}

function buildUI(data) {
  content.innerHTML = '';
  for (let i = 0; i < data.length; i++) {
    // create card
    let card = createElement('div');
    setAttribute(card, 'class', 'card m-2 col-md-4 col-lg-3 col-sm-6 col-xs-12');
    appendChild(content, card);

    // append image to placement card
    let img = createElement('img');
    img.src = data[i].image.url;
    setAttribute(img, 'class', 'card-img-top img-fluid');
    appendChild(card, img);

    let cardBody = createElement('div');
    setAttribute(cardBody, 'class', 'card-body text-center');
    appendChild(card, cardBody);

    // label as link -> append to card body to link to external link for more info
    let btn = createElement('a');
    // setAttribute(btn, 'type', 'button');
    setAttribute(btn, 'class', 'btn btn-primary cat-btn');
    if (data[i].cfa_url !== undefined) {
      setAttribute(btn, 'href', data[i].cfa_url);
      setAttribute(btn, 'target', '_blank');
      setAttribute(btn, 'data-toggle', 'tooltip');
      setAttribute(btn, 'data-placement', 'top');
      setAttribute(btn, 'title', `Visit CFA page of ${data[i].name}`);
    } else {
      setAttribute(btn, 'disabled', true);
      setAttribute(btn, 'class', 'btn btn-secondary cat-btn');
    }
    btn.innerHTML = `<i class="fas fa-paw"></i> ${data[i].name} <i class="fas fa-paw"></i>`;
    appendChild(cardBody, btn);

    let energyLevel = createElement('div');

    if (data[i].energy_level > 3) {
      setAttribute(energyLevel, 'class', 'badge bg-success text-light');
      energyLevel.innerText = 'Highly Energetic';
    } else if (data[i].energy_level < 2) {
      setAttribute(energyLevel, 'class', 'badge bg-danger');
      energyLevel.innerText = 'Very Lazy';
    } else {
      setAttribute(energyLevel, 'class', 'badge bg-warning text-dark');
      energyLevel.innerText = 'Moderate Energy';
    }

    appendChild(cardBody, energyLevel);
  // life spand of the cat
    let life = createElement('div');
    life.innerHTML = `<b>Age: </b>${data[i].life_span}`;
    appendChild(cardBody, life);

  // affection level of  this breed of cat
    let affection = createElement('div');
    affection.innerHTML = `<b>Affection: </b>${data[i].affection_level}`;
    appendChild(cardBody, affection);

  // Rating on how dog friendly is this breed of cat
    let dog = createElement('div');
    dog.innerHTML = `<b><i class=""></i> Dog Friendly : </b>${data[i].dog_friendly}`;
    appendChild(cardBody, dog);

  // Rating on how child friendly is this breed of cat
    let child = createElement('div');
    child.innerHTML = `<b><i class=""></i> Child Friendly : </b>${data[i].child_friendly}`;
    appendChild(cardBody, child);

  // Rating of intelligence is this breed of cat
    let intelligence = createElement('div');
    intelligence.innerHTML = `<b><i class=""></i> Intelligence : </b>${data[i].intelligence}`;
    appendChild(cardBody, intelligence);
  }
}
