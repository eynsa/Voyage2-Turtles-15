/* eslint no-console: 0 */
const taskManager = (function() {
  let tasksStorage;
  // Default configuration
  let config = {
    schemaName: 'tasks',
    storage: chrome.storage.local,
    Schema: {},
    newItemTask: undefined,
  };
  // Extract methods from config object.
  let {schemaName, storage, Schema, newItemTask} = config;

  /**
   * addTask function: adds task item into chrome storage.
   * @param {string} taskText valid string task.
   */
  function addTask(taskText) {
    // Check if taskText is undefined.
    if (!taskText) {
      log('taskText argument maust be a valid string');
    }
    // Create JSON schema to use in storage.
    Schema = {
      [schemaName]: [
        {
          'taskID': taskIDGenerator(),
          'taskItem': taskTextValidator(taskText),
        },
      ],
    };
    // Get whole storage area in chrome storage.
    storage.get(null, function(storageArea) {
      // Assign tasks storage area to tasksStorage var.
      tasksStorage = storageArea[schemaName];
      // Check if tasks storage area is undefined.
      if (!tasksStorage) {
        // Create Schema for first time along with first task item.
        storage.set(Schema, function() {
          log('Schema set success!');
        });
      } else {
        // Get whole tasks storage area in chrome storage.
        storage.get(schemaName, function(tasksData) {
          // Create new task item Object.
          newItemTask = {
            'taskID': taskIDGenerator(),
            'taskItem': taskTextValidator(taskText),
          };
          // tasksArray: Tasks items array from chrome storage.
          const tasksArray = tasksData[schemaName];
          // Push new task item to tasksArray.
          tasksArray.push(newItemTask);
          // Save new tasksArray to tasks storage area in chrome storage.
          storage.set({
            [schemaName]: tasksArray,
          }, function() {
            log('item has been added!');
          });
        });
      }
    });
  }
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

  /**
   * console logger.
   * @param {*} logged
   */
  function log(logged) {
    console.log(logged);
  }

  return {
    addTask: addTask,
    getTasks: getTasks,
  };
})();

