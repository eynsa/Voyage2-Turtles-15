/* eslint no-console: 1 */

const options = {

  init: function() {
    this.cache();
    chrome.storage.local.get(null, this.populateForm.bind(this));
    this.bindEvents();
    this.render();
  },

  cache: function() {
    this.form = document.forms['options'];
    this.urlEntry = document.getElementById('urlEntry');
    this.whitelist = document.getElementById('whitelist');
  },

  bindEvents: function() {
    this.form.addEventListener('submit', this.submit.bind(this));
    this.urlEntry.addEventListener('keydown', this.validateEntry.bind(this));
  },

  populateForm: function(data) {
    console.log('retrieved from storage: ' + JSON.stringify(data));
    this.whitelist.textContent = data['whitelist'];
  },

  render: function() {
  },

  submit: function(event) {
    event.preventDefault();

    let entries = {};
    let data = new FormData(this.form);
    for (let entry of data.entries()) {
      entries[entry[0]] = entry[1];
    }

    chrome.storage.local.set(entries, function() {
      console.log('saved to storage: ' + JSON.stringify(entries));
    });
  },

  validateEntry: function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();

      // eslint-disable-next-line
      let pattern = new RegExp('^(http(s)?:\/\/)?(www.)?([-a-z0-9\*]{1,63}\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\.[a-z]{2,6}(\/[*-\w@\+\.~#\?&/=%]*)?');
      if (pattern.test(this.urlEntry.value)) { // URL is valid
        this.urlEntry.classList.add('is-valid');
        this.whitelist.textContent = this.whitelist.textContent + '\n' +
          this.urlEntry.value;
      } else {
        this.urlEntry.classList.add('is-invalid');
      }
    }
  },
};

document.addEventListener('DOMContentLoaded', function() {
  options.init();
});
