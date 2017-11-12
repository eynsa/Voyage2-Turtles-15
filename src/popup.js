require('./styles.scss');

/**
 * Timer
 * @param {MouseEvent} event
 */
function timer(event) {
  event.preventDefault();

  webRequestToggle();
}

/** Toggles redirecting webRequests */
function webRequestToggle() {
  let message = {'webRequest': 'toggle'};
  chrome.runtime.sendMessage(message, function(response) {});
}

/** Recommended method to provide a link to the options page */
function options() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
}


/** document init function */
function init() {
  document.getElementById('startTimer').addEventListener('click', timer);
  document.getElementById('options').addEventListener('click', options);
}

document.addEventListener('DOMContentLoaded', init);
