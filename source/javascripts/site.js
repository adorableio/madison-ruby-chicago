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

document.addEventListener('DOMContentLoaded', function (_e) {
  // stagger speaker tiles
  attachDynamicStyles(positionSpeakers);

  // schedule item click handler
  document
    .querySelectorAll('.schedule__wrapper .schedule-list .event')
    .forEach(function (node) {
      node.addEventListener('click', injectModal);
    });

  // modal click handler
  document.getElementById('modal__wrapper').addEventListener('click', function(e) {
    if (this === e.target) closeModal();
  });
});

window.addEventListener('resize', function (_e) {
  // re-stagger speaker tiles
  attachDynamicStyles(positionSpeakers);
});
