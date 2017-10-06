/** Countdown timer logic */
function timer() {
  toggleWebRequestBlocker();
}

/** Sends a message to WebRequestBlocker to toggle it on-off */
function toggleWebRequestBlocker() {
  let message = {WebRequestBlocker: 'toggle'};
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
