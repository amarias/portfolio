/* ===== Page Transitions ===== */
//Barba.Pjax.start();

/* ===== Global Variables ===== */

let projectsArrow = document.getElementsByClassName("projects__arrow");
let projectCard = document.getElementsByClassName("project-card");
let projectsTitle = document.getElementsByClassName("title");
let titleImg = document.getElementsByClassName("title__img");
let projectCardLink = document.getElementsByClassName("project-card__link");
let projectCardIndex = 0;
let headerMenuIcon = document.getElementsByClassName("header__menu-icon");
let themeCheckbox = document.getElementsByClassName("theme-checkbox")[0];

/* ===== Event Listeners ===== */

// Check if page is projects.html
if (projectCard[0] != undefined) {
  projectsArrow[0].addEventListener("click", showLeftProjectCard);
  projectsArrow[1].addEventListener("click", showRightProjectCard);

  for (let i = 0; i < projectCard.length; i++) {
    projectsTitle[i].addEventListener("mouseover", function(e) {
      fadeInElement(titleImg[i]);
    });
    projectCardLink[i].addEventListener("mouseover", function(e) {
      fadeInElement(titleImg[i]);
    });

    projectsTitle[i].addEventListener("mouseleave", function(e) {
      fadeOutElement(titleImg[i]);
    });
    projectCardLink[i].addEventListener("mouseleave", function(e) {
      fadeOutElement(titleImg[i]);
    });
  }
}

if (headerMenuIcon[0] != undefined) {
  headerMenuIcon[0].addEventListener("click", handleMenu);
}

if(themeCheckbox != undefined) {
  themeCheckbox.addEventListener("click", changeTheme);
}

/* ===== Initialize Page ===== */

setTheme();

/* ===== Functions ===== */

// Left Arrow = 0; Right Arrow = 1
function showLeftProjectCard() {
  if (projectCardIndex === 0) {
    return;
  }

  projectCard[projectCardIndex--].classList.add("is-hidden");
  projectCard[projectCardIndex].classList.remove("is-hidden");

  let h2SubTitle = projectCard[projectCardIndex].getElementsByTagName("h2")[0];
  h2SubTitle.classList.remove("is-sliding-right");
  h2SubTitle.classList.add("is-sliding-left");

  projectsArrow[1].classList.remove("arrow--is-disabled");
  if (projectCardIndex === 0) {
    projectsArrow[0].classList.add("arrow--is-disabled");
  }
}

function showRightProjectCard() {
  if (projectCardIndex === (projectCard.length - 1)) {
    return;
  }

  projectCard[projectCardIndex++].classList.add("is-hidden");
  projectCard[projectCardIndex].classList.remove("is-hidden");

  let h2SubTitle = projectCard[projectCardIndex].getElementsByTagName("h2")[0];
  h2SubTitle.classList.remove("is-sliding-left");
  h2SubTitle.classList.add("is-sliding-right");

  projectsArrow[0].classList.remove("arrow--is-disabled");
  if (projectCardIndex == (projectCard.length - 1)) {
    projectsArrow[1].classList.add("arrow--is-disabled");
  }
}

function fadeInElement(el) {
  el.classList.remove("is-fading-out");
  el.classList.add("is-fading-in");
  el.classList.remove("is-hidden");
}

function fadeOutElement(el) {
  el.classList.remove("is-fading-in");
  el.classList.add("is-fading-out");
  setTimeout(function() {
    el.classList.add("is-hidden")
  }, 500);
}

function handleMenu() {
  let headerNav = document.getElementsByClassName("header__nav")[0];
  let navList = document.getElementsByClassName("nav__list")[0];

  if (headerNav.classList.contains("menu--is-visible")) {

    navList.classList.replace("is-growing-in", "is-growing-out");
    headerNav.classList.replace("is-fading-in", "is-fading-out");

    this.classList.remove("header__exit-icon");
    setTimeout(function() { headerNav.classList.remove("menu--is-visible") }, 500);

  } else {

    headerNav.classList.add("menu--is-visible");
    headerNav.classList.remove("is-fading-out");
    headerNav.classList.add("is-fading-in");

    navList.classList.remove("is-growing-out");
    navList.classList.add("is-growing-in");

    this.classList.add("header__exit-icon");
  }
}

function setTheme(){
  let newTheme = sessionStorage.getItem("theme");
  let bodyEl = document.getElementsByTagName("body")[0];
  let currentTheme = bodyEl.className;

  switch (newTheme) {
    case null: case currentTheme:
      sessionStorage.setItem("theme", currentTheme);
      break;
    default:
      bodyEl.classList.replace(currentTheme, newTheme);
      break;
  }
}

function changeTheme(){
  if(sessionStorage.getItem("theme") === "--light"){
    sessionStorage.setItem("theme", "--dark");
  } else {
    sessionStorage.setItem("theme", "--light");
  }

  setTheme();

  let bodyEl = document.getElementsByTagName("body")[0];
  bodyEl.classList.add("is-fading-in");
  setTimeout(function() { bodyEl.classList.remove("is-fading-in") }, 1000);
}
