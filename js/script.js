"use strict";

function ibg() {
  var ibg = document.querySelectorAll(".ibg");

  for (var index = 0; index < ibg.length; index++) {
    if (ibg[index].querySelector('img')) {
      ibg[index].style.backgroundImage = 'url(' + ibg[index].querySelector('img').getAttribute('src') + ')';
    }
  }
}

ibg();

function DynamicAdapt(type) {
  this.type = type;
}

DynamicAdapt.prototype.init = function () {
  var _this2 = this;

  var _this = this; // массив объектов


  this.оbjects = [];
  this.daClassname = "_dynamic_adapt_"; // массив DOM-элементов

  this.nodes = document.querySelectorAll("[data-da]"); // наполнение оbjects объктами

  for (var i = 0; i < this.nodes.length; i++) {
    var node = this.nodes[i];
    var data = node.dataset.da.trim();
    var dataArray = data.split(",");
    var оbject = {};
    оbject.element = node;
    оbject.parent = node.parentNode;
    оbject.destination = document.querySelector(dataArray[0].trim());
    оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
    оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
    оbject.index = this.indexInParent(оbject.parent, оbject.element);
    this.оbjects.push(оbject);
  }

  this.arraySort(this.оbjects); // массив уникальных медиа-запросов

  this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
    return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
  }, this);
  this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
    return Array.prototype.indexOf.call(self, item) === index;
  }); // навешивание слушателя на медиа-запрос
  // и вызов обработчика при первом запуске

  var _loop = function _loop(_i) {
    var media = _this2.mediaQueries[_i];
    var mediaSplit = String.prototype.split.call(media, ',');
    var matchMedia = window.matchMedia(mediaSplit[0]);
    var mediaBreakpoint = mediaSplit[1]; // массив объектов с подходящим брейкпоинтом

    var оbjectsFilter = Array.prototype.filter.call(_this2.оbjects, function (item) {
      return item.breakpoint === mediaBreakpoint;
    });
    matchMedia.addListener(function () {
      _this.mediaHandler(matchMedia, оbjectsFilter);
    });

    _this2.mediaHandler(matchMedia, оbjectsFilter);
  };

  for (var _i = 0; _i < this.mediaQueries.length; _i++) {
    _loop(_i);
  }
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
  if (matchMedia.matches) {
    for (var i = 0; i < оbjects.length; i++) {
      var оbject = оbjects[i];
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.moveTo(оbject.place, оbject.element, оbject.destination);
    }
  } else {
    for (var _i2 = 0; _i2 < оbjects.length; _i2++) {
      var _оbject = оbjects[_i2];

      if (_оbject.element.classList.contains(this.daClassname)) {
        this.moveBack(_оbject.parent, _оbject.element, _оbject.index);
      }
    }
  }
}; // Функция перемещения


DynamicAdapt.prototype.moveTo = function (place, element, destination) {
  element.classList.add(this.daClassname);

  if (place === 'last' || place >= destination.children.length) {
    destination.insertAdjacentElement('beforeend', element);
    return;
  }

  if (place === 'first') {
    destination.insertAdjacentElement('afterbegin', element);
    return;
  }

  destination.children[place].insertAdjacentElement('beforebegin', element);
}; // Функция возврата


DynamicAdapt.prototype.moveBack = function (parent, element, index) {
  element.classList.remove(this.daClassname);

  if (parent.children[index] !== undefined) {
    parent.children[index].insertAdjacentElement('beforebegin', element);
  } else {
    parent.insertAdjacentElement('beforeend', element);
  }
}; // Функция получения индекса внутри родителя


DynamicAdapt.prototype.indexInParent = function (parent, element) {
  var array = Array.prototype.slice.call(parent.children);
  return Array.prototype.indexOf.call(array, element);
}; // Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max


DynamicAdapt.prototype.arraySort = function (arr) {
  if (this.type === "min") {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0;
        }

        if (a.place === "first" || b.place === "last") {
          return -1;
        }

        if (a.place === "last" || b.place === "first") {
          return 1;
        }

        return a.place - b.place;
      }

      return a.breakpoint - b.breakpoint;
    });
  } else {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0;
        }

        if (a.place === "first" || b.place === "last") {
          return 1;
        }

        if (a.place === "last" || b.place === "first") {
          return -1;
        }

        return b.place - a.place;
      }

      return b.breakpoint - a.breakpoint;
    });
    return;
  }
};

var da = new DynamicAdapt("max");
da.init();

var slideUp = function slideUp(target) {
  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

  if (!target.classList.contains('slide')) {
    target.classList.add('slide');
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = target.offsetHeight + 'px';
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(function () {
      target.hidden = true;
      target.style.removeProperty('height');
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('slide');
    }, duration);
  }
};

var slideDown = function slideDown(target) {
  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

  if (!target.classList.contains('slide')) {
    target.classList.add('slide');

    if (target.hidden) {
      target.hidden = false;
    }

    var height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = target.offsetHeight + 'px';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(function () {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('slide');
    }, duration);
  }
};

var slideToggle = function slideToggle(target) {
  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

  if (target.hidden) {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
};

var select = document.querySelectorAll('.select');
var activeSelect;

var _loop2 = function _loop2(index) {
  var item = select[index];
  var selectOption = item.querySelectorAll('option');
  var selectOptionLength = selectOption.length;
  var selectedOption = item.querySelector('option[selected]');
  var disabledOption = item.querySelector('option[disabled]');
  var duration = 300;
  item.querySelector('select').hidden = true;
  var head = document.createElement('div');
  var text = document.createElement('span');
  head.classList.add('select__head');
  text.textContent = disabledOption ? disabledOption.textContent : selectedOption.textContent;
  head.append(text);
  item.append(head);
  var icon = item.querySelector('.select__icon');

  if (icon) {
    head.append(icon);
  }

  var selectList = document.createElement('ul');
  selectList.classList.add('select__list');
  item.append(selectList);

  if (!disabledOption) {
    var newOption = document.createElement('li');
    newOption.textContent = selectedOption ? selectedOption.textContent : selectOption[0].textContent;
    newOption.classList.add('select__item');
    newOption.dataset.value = selectedOption ? selectedOption.value : selectOption[0].textContent;
    selectList.append(newOption);
  }

  for (var _index4 = 1; _index4 < selectOptionLength; _index4++) {
    var _newOption = document.createElement('li');

    _newOption.textContent = selectOption[_index4].textContent;

    _newOption.classList.add('select__item');

    _newOption.dataset.value = selectOption[_index4].value;
    selectList.append(_newOption);
  }

  selectList.hidden = true;
  head.addEventListener('click', function (e) {
    if (!document.querySelector('.select__list.slide') && e.target.closest('.select__head')) {
      if (activeSelect && !e.target.closest('.select__head').nextElementSibling.isEqualNode(activeSelect)) {
        slideUp(activeSelect);
        activeSelect.closest('.select').querySelector('.select__head').classList.remove('active');
      }

      activeSelect = e.target.closest('.select__head').nextElementSibling;
      e.currentTarget.classList.toggle('active');
      slideToggle(selectList);
    }
  });
  selectList.addEventListener('click', function (e) {
    if (e.target.closest('.select__item')) {
      var target = e.target.closest('.select__item');
      var value = target.dataset.value;
      var newSelectedEl = item.querySelector("option[value=\"".concat(value, "\"]"));
      var oldSelectedEl = item.querySelector('option[selected]');

      if (!newSelectedEl) {
        for (var _index5 = 1; _index5 < selectOptionLength; _index5++) {
          var option = selectOption[_index5];

          if (option.textContent == value) {
            newSelectedEl = option;
          }
        }
      }

      if (oldSelectedEl) {
        oldSelectedEl.removeAttribute('selected');
      }

      if (newSelectedEl) {
        newSelectedEl.setAttribute('selected', 'selected');
        text.textContent = newSelectedEl.textContent;
      }

      head.classList.remove('active');
      activeSelect = null;
      e.target.closest('.select').querySelector('select').dispatchEvent(new Event('change'));
      slideUp(selectList);
    }
  });
};

for (var index = 0; index < select.length; ++index) {
  _loop2(index);
}

window.addEventListener('click', function (e) {
  if (document.querySelector('.select__head.active') && !e.target.closest('.select') && !document.querySelector('.select__list.slide')) {
    activeSelect.closest('.select').querySelector('.select__head').classList.remove('active');
    slideUp(activeSelect);
    activeSelect = null;
  }
}); //BuildSlider

var sliders = document.querySelectorAll(".swiper");

if (sliders) {
  for (var _index = 0; _index < sliders.length; _index++) {
    var slider = sliders[_index];

    if (!slider.classList.contains('swiper-build')) {
      var slider_items = slider.children;

      if (slider_items) {
        for (var _index2 = 0; _index2 < slider_items.length; _index2++) {
          var el = slider_items[_index2];
          el.classList.add('swiper-slide');
        }
      }

      var slider_content = slider.innerHTML;
      var slider_wrapper = document.createElement("div");
      slider_wrapper.classList.add('swiper-wrapper');
      slider_wrapper.innerHTML = slider_content;
      slider.innerHTML = "";
      slider.appendChild(slider_wrapper);
      slider.classList.add('swiper-build');
    }

    if (slider.classList.contains('_gallery')) {//slider.data('lightGallery').destroy(true);
    }
  }

  sliders_build_callback();
}

function sliders_build_callback() {}

var spoilersArray = document.querySelectorAll("[data-spoilers]");

if (spoilersArray.length > 0) {
  // Инициализация
  var initSpoilers = function initSpoilers(spoilersArray) {
    var matchMedia = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    spoilersArray.forEach(function (spoilersBlock) {
      spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock;

      if (matchMedia.matches || !matchMedia) {
        spoilersBlock.classList.add("init");
        initSpoilerBody(spoilersBlock);
        spoilersBlock.addEventListener("click", setSpoilerAction);
      } else {
        spoilersBlock.classList.remove("init");
        initSpoilerBody(spoilersBlock, false);
        spoilersBlock.removeEventListener("click", setSpoilerAction);
      }
    });
  }; // Работа с контентом


  var initSpoilerBody = function initSpoilerBody(spoilersBlock) {
    var hideSpoilerBody = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var spoilerTitles = spoilersBlock.querySelectorAll("[data-spoiler]");

    if (spoilerTitles.length > 0) {
      spoilerTitles.forEach(function (spoilerTitle) {
        if (hideSpoilerBody) {
          spoilerTitle.removeAttribute("tabindex");

          if (!spoilerTitle.classList.contains("active-spoiler")) {
            spoilerTitle.nextElementSibling.hidden = true;
          }
        } else {
          spoilerTitle.setAttribute("tabindex", "-1");
          spoilerTitle.nextElementSibling.hidden = false;
        }
      });
    }
  };

  var setSpoilerAction = function setSpoilerAction(e) {
    var el = e.target;

    if (el.hasAttribute('data-spoiler') || el.closest('[data-spoiler]')) {
      var spoilerTitle = el.hasAttribute('data-spoiler') ? el : el.closest('[data-spoiler]');
      var spoilersBlock = spoilerTitle.closest('[data-spoilers]');
      var oneSpoiler = spoilersBlock.hasAttribute('data-one-spoiler') ? true : false;

      if (!spoilersBlock.querySelectorAll(".slide").length) {
        if (oneSpoiler && !spoilerTitle.classList.contains("active-spoiler")) {
          hideSpoilerBody(spoilersBlock);
        }

        spoilerTitle.classList.toggle("active-spoiler");
        slideToggle(spoilerTitle.nextElementSibling, 500);
      }

      e.preventDefault();
    }
  };

  var hideSpoilerBody = function hideSpoilerBody(spoilersBlock) {
    var spoilerActiveTitle = spoilersBlock.querySelector('[data-spoiler].active-spoiler');

    if (spoilerActiveTitle) {
      spoilerActiveTitle.classList.remove("active-spoiler");
      slideUp(spoilerActiveTitle.nextElementSibling, 500);
    }
  };

  // Получение обычный спойлеров
  var spoilersRegular = Array.from(spoilersArray).filter(function (item, index, self) {
    return !item.dataset.spoilers.split(",")[0];
  }); // Инициализация обычных спойлеров

  if (spoilersRegular.length > 0) {
    initSpoilers(spoilersRegular);
  } // Получение спойлеров с медиа запросами


  var spoilersMedia = Array.from(spoilersArray).filter(function (item, index, self) {
    return item.dataset.spoilers.split(",")[0];
  }); // Инициализация спойлеров с медиа запросами

  if (spoilersMedia.length > 0) {
    var breakpointsArray = [];
    spoilersMedia.forEach(function (item) {
      var params = item.dataset.spoilers;
      var breakpoint = {};
      var paramsArray = params.split(",");
      breakpoint.value = paramsArray[0];
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
      breakpoint.item = item;
      breakpointsArray.push(breakpoint);
    }); // Получаем уникальные брейкпоинты

    var mediaQueries = breakpointsArray.map(function (item) {
      return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
    });
    mediaQueries = mediaQueries.filter(function (item, index, self) {
      return self.indexOf(item) === index;
    }); // Работаем с каждым брейкпоинтом

    mediaQueries.forEach(function (breakpoint) {
      var paramsArray = breakpoint.split(",");
      var mediaBreakpoint = paramsArray[1];
      var mediaType = paramsArray[2];
      var matchMedia = window.matchMedia(paramsArray[0]); // Объекты с нужными условиями

      var spoilersArray = breakpointsArray.filter(function (item) {
        if (item.value === mediaBreakpoint && item.type === mediaType) {
          return true;
        }
      });
      matchMedia.addEventListener("change", function () {
        initSpoilers(spoilersArray, matchMedia);
      });
      initSpoilers(spoilersArray, matchMedia);
    });
  }
}

var brandsSlider = new Swiper('.brands__slider', {
  speed: 800,
  loop: true,
  spaceBetween: 40,
  breakpoints: {
    1100: {
      slidesPerView: 6,
      spaceBetween: 82
    },
    991: {
      slidesPerView: 5,
      spaceBetween: 50
    },
    767: {
      slidesPerView: 3.9
    },
    574: {
      slidesPerView: 2.9
    }
  }
});
var resultSlider = new Swiper('.result__slider', {
  slidesPerView: 1,
  speed: 800,
  loop: true,
  spaceBetween: 20,
  pagination: {
    el: '.result__dots',
    clickable: true
  }
});
var aboutSlider = new Swiper('.slider-about-page__body', {
  speed: 800,
  slidesPerView: 1,
  loop: true,
  spaceBetween: 30,
  centeredSlides: true,
  roundLengths: true,
  loopAdditionalSlides: 30,
  navigation: {
    nextEl: ".slider-about-page__button-next",
    prevEl: ".slider-about-page__button-prev"
  },
  breakpoints: {
    1300: {
      spaceBetween: 95,
      slidesPerView: 3
    },
    991: {
      slidesPerView: 3
    }
  }
});
var preloader = document.querySelector('.preloader');
window.addEventListener('load', function () {
  setTimeout(function () {
    preloader.classList.add('loaded');
  }, 300);
  setTimeout(function () {
    preloader.classList.add('hidden');
    document.body.classList.add('loaded');
  }, 1200);
});
window.addEventListener('click', function (e) {
  if (e.target.closest('.result-controls__button-prev')) {
    resultSlider.slidePrev();
  }

  if (e.target.closest('.result__button-prev')) {
    resultSlider.slidePrev();
  }

  if (e.target.closest('.result-controls__button-next')) {
    resultSlider.slideNext();
  }

  if (e.target.closest('.result__button-next')) {
    resultSlider.slideNext();
  }
});

function updateHeaderBorder() {
  var shortLine = document.querySelector('.header__line_short');
  var longLine = document.querySelector('.header__line_long');
  var paddingWidth = 60;
  var logoWidth = document.querySelector('.header .logo__image').offsetWidth;
  var containerWidth = document.querySelector('.header__container').offsetWidth;
  var offset = window.innerWidth - containerWidth;
  var shortLineWidth = offset - offset / 2 - 11;
  var longLineWidth = window.innerWidth - offset / 2 - logoWidth - paddingWidth;
  shortLine.style.width = shortLineWidth + 'px';
  longLine.style.width = longLineWidth + 'px';
}

window.addEventListener('resize', updateHeaderBorder);
updateHeaderBorder();
var submenu = document.querySelectorAll('.menu__item_submenu');

if (submenu.length > 0) {
  var _loop3 = function _loop3(_index3) {
    var item = submenu[_index3];
    item.addEventListener('mouseenter', function () {
      var submenuBody = item.querySelector('.submenu');
      submenuBody.classList.add('active');
      item.classList.add('active');
    });
    item.addEventListener('mouseleave', function () {
      var submenuBody = item.querySelector('.submenu');
      submenuBody.classList.remove('active');
      item.classList.remove('active');
    });
  };

  for (var _index3 = 0; _index3 < submenu.length; _index3++) {
    _loop3(_index3);
  }
}

var isMobile = {
  Android: function Android() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function BlackBerry() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function iOS() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function Opera() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function Windows() {
    return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
  },
  any: function any() {
    return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
  }
};
var iconMenu = document.querySelector(".icon-menu");
var header = document.querySelector('.header');

if (iconMenu) {
  var menuContent = document.querySelector(".menu");
  iconMenu.addEventListener('click', function () {
    document.body.classList.toggle("lock");
    iconMenu.classList.toggle("active");
    header.classList.toggle('active');
    menuContent.classList.toggle("active");
  });
}

function fixHeader() {
  if (document.documentElement.scrollTop > 10 && !header.classList.contains('scroll')) {
    header.classList.add('scroll');
    return;
  }

  if (document.documentElement.scrollTop < 10 && header.classList.contains('scroll')) {
    header.classList.remove('scroll');
  }
}

fixHeader();
window.addEventListener('scroll', fixHeader);

if (document.querySelector('#calendar')) {
  var picker = datepicker('#calendar', {
    formatter: function formatter(input, date, instance) {
      input.value = date.toLocaleDateString().replace(/\./g, '/');
    },
    customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    customDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var modalButtons = document.querySelectorAll('.open-modal'),
      overlay = document.querySelector('.overlay'),
      closeButtons = document.querySelectorAll('.modal-close');
  modalButtons.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      var scrollbarSize = window.innerWidth - document.body.offsetWidth;
      var modalId = this.getAttribute('data-modal'),
          modalElem = document.querySelector('.modal[data-modal="' + modalId + '"]');
      modalElem.classList.add('active');
      overlay.classList.add('active');
      document.body.style.paddingRight = scrollbarSize + 'px';
      document.body.classList.add('lock');
    });
  });
  closeButtons.forEach(function (item) {
    item.addEventListener('click', function (e) {
      var parentModal = this.closest('.modal');
      parentModal.classList.remove('active');
      overlay.classList.remove('active');
      document.body.classList.remove('lock');
      document.body.style.paddingRight = '0';
    });
  });
  document.body.addEventListener('keyup', function (e) {
    var key = e.keyCode;

    if (key == 27) {
      document.querySelector('.modal.active').classList.remove('active');
      document.querySelector('.overlay').classList.remove('active');
      document.body.classList.remove('lock');
      document.body.style.paddingRight = '0';
    }

    ;
  }, false);
  overlay.addEventListener('click', function (e) {
    if (e.target.classList.contains('overlay')) {
      document.querySelector('.modal.active').classList.remove('active');
      this.classList.remove('active');
      document.body.classList.remove('lock');
      document.body.style.paddingRight = '0';
      console.log('');
    }
  });
});
var tabLinks = document.querySelectorAll(".tabs__item");
var tabContent = document.querySelectorAll(".tabs-content");
tabLinks.forEach(function (el) {
  el.addEventListener("click", openTabs);
});

function openTabs(el) {
  var btnTarget = el.currentTarget;
  var title = btnTarget.dataset.tabTitle;
  tabContent.forEach(function (el) {
    el.classList.remove("active");
  });
  tabLinks.forEach(function (el) {
    el.classList.remove("active");
  });
  document.querySelector("#" + title).classList.add("active");
  btnTarget.classList.add("active");
}