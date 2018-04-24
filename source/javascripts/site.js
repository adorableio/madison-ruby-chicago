// This is where it all goes :)
var style;

function createStyleNode(css) {
  var styleEl = document.createElement('style');
  styleEl.setAttribute('type', 'text/css');

  if (styleEl.styleSheet) { // IE
    styleEl.styleSheet.cssText = css;
  } else { // the world
    styleEl.appendChild(document.createTextNode(css));
  }

  return styleEl;
}

function attachDynamicStyles(cssGenerator) {
  var node = createStyleNode(cssGenerator());
  var head = document.getElementsByTagName('head')[0];
  if (head.contains(style)) {
    head.removeChild(style);
  }
  head.appendChild(node);
  style = node;
}

function positionSpeakers() {
  var container = document.querySelector('.speaker__wrapper .speaker-list');
  var speakerStyle = window.getComputedStyle(container.querySelector('.speaker'));
  var columns = Math.floor(
    container.getBoundingClientRect().width / (
      parseInt(speakerStyle.width) +
      parseInt(speakerStyle['margin-left']) +
      parseInt(speakerStyle['margin-right'])
    )
  );

  var css = '  .speaker__wrapper .speaker-list {\n    grid-template-columns: repeat(' + columns + ', auto);\n  }\n';
  css += '  .speaker__wrapper .speaker-list {\n    padding-bottom: ' + (columns - 1) * 2 + 'rem;\n  }\n';
  for (var i = 0; i < columns; i++) {
    css += '  .speaker__wrapper .speaker:nth-child(' + columns + 'n + ' + (i + 1) + ') {\n    transform: translateY(' + 2 * i + 'rem);\n  }\n';
  }

  return css;
}

function injectModal(_e) {
  var content = this.querySelector('.modal-content').cloneNode(true);
  content.querySelector('.close').addEventListener('click', closeModal);
  document.getElementById('modal__wrapper').appendChild(content);
  document.getElementsByTagName('body')[0].classList.add('show-modal');
}

function closeModal(_e) {
  var modal = document.getElementById('modal__wrapper');
  modal.removeChild(modal.querySelector('.modal-content'));
  document.getElementsByTagName('body')[0].classList.remove('show-modal');
}

function resizeVideos() {
  var width = document
    .querySelector('.videos__wrapper .videos')
    .getBoundingClientRect()
    .width;

  document.querySelectorAll('.videos__wrapper .video iframe').forEach(function (iframe) {
    iframe.setAttribute(
      'height', width * iframe.getAttribute('height') / iframe.getAttribute('width'));
    iframe.setAttribute('width', width);
  });
}

document.addEventListener('DOMContentLoaded', function (_e) {

  attachDynamicStyles(positionSpeakers);

  document
    .querySelectorAll('.schedule__wrapper .schedule-list .event')
    .forEach(function (node) {
      node.addEventListener('click', injectModal);
    });

  document.getElementById('modal__wrapper').addEventListener('click', function(e) {
    if (this === e.target) closeModal();
  });


  // resize videos
  resizeVideos();
});

window.addEventListener('resize', function (_e) {
  attachDynamicStyles(positionSpeakers);

  resizeVideos();
});

// function (){
//  var changeHeader = 300;
//   window.scroll(function() {
//     var scroll = getCurrentScroll();
//       if ( scroll >= changeHeader ) {
//            $('.left-bar').addClass('scrolled');
//         }
//         else {
//             $('.left-bar').removeClass('scrolled');
//         }
//   });
//   function getCurrentScroll() {
//     return window.pageYOffset || document.documentElement.scrollTop;
//   }
// };
