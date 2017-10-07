const taskManager = (function() {
  /**
   * Add a task function.
   * @param {string} taskText String task item.
   * @param {object} options configuration.
   */
  function addTask(taskText, options) {
    const defaultOptions = {
      storageType: 'localStorage',
      maxTasks: 15,
      chromeStorageSync: true,
      errors: {
        success: 'Task has been added!',
        failure: 'Couldn\'t save task!',
        exists: 'Item already exists in storage!',
      },
    };
    options = defaultOptions || options;

    (function saveTask() {
      const {storageType, chromeStorageSync} = options;
      if (typeof storageType === 'string' && storageType !== undefined) {
        if (storageType === 'localStorage') {
          addItemWithLocalStorage();
        } else if (storageType === 'chromeStorage') {
          if (chromeStorageSync) {
            addItemWithChromeStorage(true);
          } else {
            addItemWithChromeStorage(false);
          }
        }
      } else {
        console.error('storageType must be a string value!');
      }

      /**
       * Save Task item using localStorage API.
       */
      function addItemWithLocalStorage() {
        localStorage.setItem(taskIDGenerator(), taskTextValidator(taskText));
        console.log(options.errors.success);
      }

      /**
       * Save Task item using crome.storage extension API.
       * @param {boolean} sync
       */
      function addItemWithChromeStorage(sync) {
        const taskID = taskIDGenerator();
        const taskTextValidated = taskTextValidator(taskText);
        let chromeStorage;
        if (sync) {
          chromeStorage = chrome.storage.sync;
        } else {
          chromeStorage = chrome.storage;
        }
        chromeStorage.set({[taskID]: taskTextValidated}, function() {
          console.log(options.errors.success);
        });
      }
    })();

    /**
     * Generate a unique ID for every task.
     * @return {string} 8 numbers long.
     */
    function taskIDGenerator() {
      return Math.random().toString().slice(2, 11);
    }

    /**
     * Task Text string validator.
     * @param {string} taskText
     * @return {string} taskText
     */
    function taskTextValidator(taskText) {
      if (typeof taskText === 'string' && taskText !== undefined &&
        taskText !== '') {
        return taskText;
      }
      console.error('taskText: must be string!');
    }
  }

  return {
    addTask: addTask,
  };
})();

