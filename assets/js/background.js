/* eslint no-console: 1 */

const settings = {
  'webRequest': {
    'status': false,
  },
};

/**
 * Processes messages sent from other pages
 * @param  {Object} request - JSON object
 * @param  {Object} sender - the id and url the message originated from
 * @param  {function} sendResponse - function that sends the JSON response
 */
const messages = (request, sender, sendResponse) => {
  if (request.hasOwnProperty('webRequest')) {
    switch (request.webRequest) {
      case 'status': {
        sendResponse({'status': settings.webRequest.status});
        break;
      }
      case 'toggle': {
        if (settings.webRequest.status) {
          chrome.webRequest.onBeforeRequest.removeListener(redirect);
          settings.webRequest.status = false;

          // temporary to show our blocker works
          chrome.browserAction.setBadgeText({'text': ''});
        } else {
          let filter = {urls: ['http://*/*', 'https://*/*']};
          let opt = ['blocking'];
          chrome.webRequest.onBeforeRequest.addListener(redirect, filter, opt);
          settings.webRequest.status = true;

          // temporary to show our blocker works
          chrome.browserAction.setBadgeText({'text': 'ON'});
        }
        sendResponse({'status': settings.webRequest.status});
        break;
      }
    }
  }
};

/**
 * web requests go through here to determine whether they should be blocked.
  * @param {object} request - contains details about the intercepted request
 * @return {BlockingResponse} response - used to modify network requests
 */
const redirect = (request) => {
  let response = {};
  if (request.type === 'main_frame') {
    let redirect = chrome.runtime.getURL('redirect.html');
    let params = new URLSearchParams();
    params.set('url', request.url);
    response.redirectUrl = `${redirect}?${params.toString()}`;
  } else {
    response.cancel = false;
  }
  return response;
};

/** Loads settings from storage. */
const reload = () => {
  chrome.storage.local.get('whitelist', (data) => {
    settings.whitelist = data.whitelist;
  });
};

/** document init function */
const init = () => {
  chrome.runtime.onMessage.addListener(messages);
  chrome.storage.onChanged.addListener(reload);

  reload();
};

document.addEventListener('DOMContentLoaded', init);
