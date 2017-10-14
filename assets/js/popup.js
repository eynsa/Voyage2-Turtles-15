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

/**
 * Event Handler for tabs on this page
 * @param {MouseEvent} event
 */
function switchTab(event) {
  let number = this.dataset.tab;

  // hides the current tab and removes its highlight
  let content = document.querySelectorAll('div.tab-content');
  content.forEach((el) => el.classList.remove('is-active'));
  let tabs = document.querySelectorAll('li.tab-button');
  tabs.forEach((el) => el.classList.remove(('is-active')));

  // displays and highlights the correct tab
  let active = document.querySelector(`div.tab-content[data-tab="${number}"]`);
  active.classList.add('is-active');
  this.classList.add('is-active');
}


/** document init function */
function init() {
  let tabs = document.querySelectorAll('li.tab-button');
  tabs.forEach((tab) => tab.addEventListener('click', switchTab));

  document.getElementById('startTimer').addEventListener('click', timer);
  document.getElementById('options').addEventListener('click', options);
}

document.addEventListener('DOMContentLoaded', init);
