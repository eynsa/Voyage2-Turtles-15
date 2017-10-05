/* eslint no-console: 1 */

const Options = {

  data: {
    whitelist: [],
  },

  init: function() {
    this.cache();
    this.bindEvents();
    this.getDataFromStorage();
    this.render(); // pointless for now. refactor getDataFromStorage()
  },

  bindEvents: function() {
    this.options.addEventListener('submit', this.submit.bind(this));
    this.urlEntry.addEventListener('keydown', this.urlEntryHandler.bind(this));
  },

  /** Caches DOM elements so they only have to be located once */
  cache: function() {
    this.options = document.forms['options'];
    this.urlEntry = document.getElementById('urlEntry');
    this.whitelist = document.getElementById('whitelist');
  },

  /**
   * Retrieves form data from storage, then renders the page
   *
   * TODO: use promises to delete this.render() and only use init();
   */
  getDataFromStorage: function() {
    chrome.storage.local.get('whitelist', (data) => {
      console.info('retrieved from storage: ' + JSON.stringify(data));
      this.data.whitelist = data.whitelist;

      this.render();
    });
  },

  /** (re)Fills the forms on the page. */
  render: function() {
    this.whitelist.textContent = this.data.whitelist;
  },

  /**
   * Handler for the form's 'submit' event
   * Saves the whitelist to local storage
   *
   * TODO: URL validation before submitting
   * @param {Event} event
   */
  submit: (event) => {
    event.preventDefault();

    let form = new FormData(document.forms['options']);
    let data = {'whitelist': form.get('whitelist')};

    chrome.storage.local.set(data, () => {
      console.info('saved to storage: ' + JSON.stringify(data));
    });
  },

  /**
   * Validates the urlEntry input before adding it to the whitelist
   *
   * TODO: refactor URL validation to a separate function
   * TODO: store URLs in a set instead of grabbing the textContent
   * @param {KeyboardEvent} event
   */
  urlEntryHandler: (event) => {
    this.urlEntry.classList.remove('is-valid', 'is-invalid');
    if (event.key === 'Enter') {
      event.preventDefault();

      // eslint-disable-next-line
      let pattern = new RegExp('^(http(s)?:\/\/)?(www.)?([-a-z0-9\*]{1,63}\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\.[a-z]{2,6}(\/[*-\w@\+\.~#\?&/=%]*)?');
      if (pattern.test(this.urlEntry.value)) { // URL is valid
        this.urlEntry.classList.add('is-valid');
        this.whitelist.textContent = this.whitelist.textContent + '\n' +
          this.urlEntry.value;
        this.urlEntry.value = '';
      } else {
        this.urlEntry.classList.add('is-invalid');
      }
    }
  },
};

document.addEventListener('DOMContentLoaded', () => {
  Options.init();
});
