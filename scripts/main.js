/* ===== Global Variables ===== */

var projectsArrow = document.getElementsByClassName("projects__arrow");
var projectCard = document.getElementsByClassName("project-card");
var projectsTitle = document.getElementsByClassName("title");
var titleImg = document.getElementsByClassName("title__img");
var projectCardLink = document.getElementsByClassName("project-card__link");
var projectCardIndex = 0;
var headerMenuIcon = document.getElementsByClassName("header__menu-icon");
var themeCheckbox = document.getElementsByClassName("theme-checkbox")[0];



/* ===== Page Transitions ===== */

/* ~~ Views ~~ */
var home = Barba.BaseView.extend({
  namespace: 'home',
  onEnter: function() {
    let headerMenuIcon = document.getElementsByClassName("header__menu-icon")[0];
    let headerNav = document.getElementsByClassName("header__nav")[0];

    if (headerNav.classList.contains("menu--is-visible")) {
      headerNav.classList.remove("is-fading-in");
      headerNav.classList.remove("menu--is-visible")
      headerMenuIcon.classList.remove("header__exit-icon");
    }
  },
  onEnterCompleted: function() {
    let selectedLink = document.getElementsByClassName("header__link")[0];
    selectedLink.children[0].classList.add("link--is-selected");
  },
  onLeave: function() {
    let selectedLink = document.getElementsByClassName("header__link")[0];
    selectedLink.children[0].classList.remove("link--is-selected");
  },
  onLeaveCompleted: function() {}
});


var about = Barba.BaseView.extend({
  namespace: 'about',
  onEnter: function() {
    let headerMenuIcon = document.getElementsByClassName("header__menu-icon")[0];
    let headerNav = document.getElementsByClassName("header__nav")[0];

    if (headerNav.classList.contains("menu--is-visible")) {
      headerNav.classList.remove("is-fading-in");
      headerNav.classList.remove("menu--is-visible")
      headerMenuIcon.classList.remove("header__exit-icon");
    }
  },
  onEnterCompleted: function() {
    let selectedLink = document.getElementsByClassName("header__link")[2];
    selectedLink.children[0].classList.add("link--is-selected");
  },
  onLeave: function() {
    let selectedLink = document.getElementsByClassName("header__link")[2];
    selectedLink.children[0].classList.remove("link--is-selected");
  },
  onLeaveCompleted: function() {}
});


var projects = Barba.BaseView.extend({
  namespace: 'projects',
  onEnter: function() {
    let headerMenuIcon = document.getElementsByClassName("header__menu-icon")[0];
    let headerNav = document.getElementsByClassName("header__nav")[0];

    if (headerNav.classList.contains("menu--is-visible")) {
      headerNav.classList.remove("is-fading-in");
      headerNav.classList.remove("menu--is-visible")
      headerMenuIcon.classList.remove("header__exit-icon");
    }
  },
  onEnterCompleted: function() {
    this.container.classList.remove("title--is-expanding");

    let selectedLink = document.getElementsByClassName("header__link")[1];
    selectedLink.children[0].classList.add("link--is-selected");
  },
  onLeave: function() {
    let selectedLink = document.getElementsByClassName("header__link")[1];
    selectedLink.children[0].classList.remove("link--is-selected");
  },
  onLeaveCompleted: function() {}
});


var projectInfo = Barba.BaseView.extend({
  namespace: 'projectInfo',
  onEnter: function() {},
  onEnterCompleted: function() {
    let selectedLink = document.getElementsByClassName("header__link")[1];
    selectedLink.children[0].classList.add("link--is-selected");
  },
  onLeave: function() {
    let selectedLink = document.getElementsByClassName("header__link")[1];
    selectedLink.children[0].classList.remove("link--is-selected");
  },
  onLeaveCompleted: function() {}
});


/* ~~ Initialize Views ~~ */
home.init();
about.init();
projects.init();
projectInfo.init();


/* ~~ Transitions ~~ */

// (Home || About) to (About || Home || Projects)
let compressExpandTransition = Barba.BaseTransition.extend({
  start: function() {
    Promise.all([this.newContainerLoading, this.isCompressing()])
      .then(this.isExpanding.bind(this))
      .catch(error => console.log(error));
  },

  isCompressing: function() {
    this.oldContainer.classList.remove("title--is-expanding");
    this.oldContainer.classList.remove("is-fading-in");

    var el = this;
    setTimeout(function() {
      el.oldContainer.classList.add("is-fading-out");
    }, 500);

    this.oldContainer.classList.add("title--is-compressing");
  },

  isExpanding: function() {
    var el = this;
    setTimeout(function() {
      el.newContainer.classList.remove("title--is-compressing");
      el.newContainer.classList.add("is-fading-in");
      if (Barba.Pjax.History.currentStatus().namespace != "projects") {
        el.newContainer.classList.add("title--is-expanding");
      }
      el.done();
    }, 1000);
  }
});


// (Projects || ProjectInfo) to any page
var projectsTransition = Barba.BaseTransition.extend({
  start: function() {

    Promise.all([this.newContainerLoading, this.isFadingOut()])
      .then(this.setTransition.bind(this))
      .catch(error => console.log(error));
  },

  isFadingOut: function() {
    this.oldContainer.classList.remove("is-fading-in");

    var el = this;
    setTimeout(function() {
      el.oldContainer.classList.add("is-fading-out");
    }, 500);
  },

  setTransition: function() {
    var el = this;
    setTimeout(function() {
      el.newContainer.classList.add("is-fading-in");
      if ((Barba.Pjax.History.currentStatus().namespace == "home") ||
        (Barba.Pjax.History.currentStatus().namespace == "about")) {
        el.newContainer.classList.add("title--is-expanding");
      }
      el.done();
    }, 1000);
  }
});


Barba.Pjax.getTransition = function() {

  let currentPage = Barba.HistoryManager.prevStatus().namespace;

  switch (currentPage) {
    case "home":
    case "about":
      return compressExpandTransition;
    default:
      return projectsTransition;
  }
};



/* ===== Event Listeners ===== */

Barba.Dispatcher.on('transitionCompleted', function(currentStatus, oldStatus, container) {
  if (currentStatus.namespace === "projects") {
    projectCardIndex = 0;
    addProjectsListeners();
  }
});

if (headerMenuIcon[0] != undefined) {
  headerMenuIcon[0].addEventListener("click", handleMenu);
}

if (themeCheckbox != undefined) {
  themeCheckbox.addEventListener("click", changeTheme);
}



/* ===== Initialize Page ===== */

setTheme();

// Initialize Transitions
Barba.Pjax.start();


/* ===== Functions ===== */

function addProjectsListeners() {
  projectsArrow[0].addEventListener("click", showLeftProjectCard);
  projectsArrow[1].addEventListener("click", showRightProjectCard);

  for (let i = 0; i < projectCard.length; i++) {
    projectsTitle[i].addEventListener("mouseover", function(e) {
      fadeInElement(titleImg[i]);
    });
    projectsTitle[i].addEventListener("mouseleave", function(e) {
      fadeOutElement(titleImg[i]);
    });
    if (!isMobile()) {
      projectCardLink[i].addEventListener("mouseover", function(e) {
        fadeInElement(titleImg[i]);
      });
      projectCardLink[i].addEventListener("mouseleave", function(e) {
        fadeOutElement(titleImg[i]);
      });
    }
  }
}

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

    headerNav.classList.replace("is-fading-in", "is-fading-out");

    this.classList.remove("header__exit-icon");
    setTimeout(function() {
      headerNav.classList.remove("menu--is-visible")
    }, 500);

  } else {

    headerNav.classList.add("menu--is-visible");
    headerNav.classList.remove("is-fading-out");
    headerNav.classList.add("is-fading-in");

    this.classList.add("header__exit-icon");
  }
}

function setTheme() {
  let newTheme = sessionStorage.getItem("theme");
  let bodyEl = document.getElementsByTagName("body")[0];
  let currentTheme = bodyEl.className;

  switch (newTheme) {
    case null:
    case currentTheme:
      sessionStorage.setItem("theme", currentTheme);
      break;
    default:
      bodyEl.classList.replace(currentTheme, newTheme);
      break;
  }
}

function changeTheme() {
  if (sessionStorage.getItem("theme") === "--light") {
    sessionStorage.setItem("theme", "--dark");
  } else {
    sessionStorage.setItem("theme", "--light");
  }

  setTheme();

  let bodyEl = document.getElementsByTagName("body")[0];
  bodyEl.classList.add("is-fading-in");
  setTimeout(function() {
    bodyEl.classList.remove("is-fading-in")
  }, 1000);
}

function isMobile() {
  if (window.screen.width <= 1200) {
    return true;
  }
  return false;
}
