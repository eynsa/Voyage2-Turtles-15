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
  const tabs = document.querySelectorAll('li.tab-button');
  const tabContent = document.querySelectorAll('div.tab-content');

  tabs.forEach(function(element) {
    element.addEventListener('click', function(event) {
      let tab = this.dataset.tab;
      let active = document.querySelector(`div.tab-content[data-tab="${tab}"]`);
      console.log(active);
      tabs.forEach((el) => el.classList.remove(('is-active')));
      this.classList.add('is-active');

      tabContent.forEach((el) => el.classList.remove('is-active'));
      active.classList.add('is-active');
    });
  });

  document.getElementById('startTimer').addEventListener('click', timer);
  document.getElementById('options').addEventListener('click', options);
}

document.addEventListener('DOMContentLoaded', init);
