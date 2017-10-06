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
      log('taskText argument must be a valid string');
    }
    // Create JSON schema to use in storage.
    Schema = {
      [schemaName]: [
        {
          'id': taskIDGenerator(),
          'item': taskTextValidator(taskText),
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
            'id': taskIDGenerator(),
            'item': taskTextValidator(taskText),
          };
          // tasksArray: Tasks items array from chrome storage.
          const tasksArray = tasksData[schemaName];
          // Push new task item to tasksArray.
          tasksArray.push(newItemTask);
          setTasksStorageArea(tasksArray, 'Task item has been added!');
        });
      }
    });
  }

  /**
   * Delete a task item with The generated task ID
   * @param {number} taskID
   */
  function deleteTask(taskID) {
    if (taskIDValidator(taskID)) {
      getTasks(false, function(allTaskData) {
        getTasks(false, null, taskID, function(taskData) {
          const filterTasks = (item) => item.id !== taskData.id;
          const newTasksData = allTaskData.filter(filterTasks);
          storage.get(schemaName, function() {
            setTasksStorageArea(newTasksData, 'Task item has been deleted!');
          });
        });
      });
    }
  }

  /**
   * It gets tasks storage array from chrome storage.
   * @param {boolean} isLogged activate console.log
   * @param {function} tasksData callback function
   * @param {number} taskID number
   * @param {function} taskData callback function
   */
  function getTasks(isLogged, tasksData, taskID, taskData) {
    let tasksStorageData;
    // Get whole storage area in chrome storage.
    storage.get(null, function(storageArea) {
      // return tasks items array if exists.
      if (storageArea[schemaName]) {
        tasksStorageData = storageArea[schemaName];
        if (isLogged) {
          log(`Logging Data to Console enabled: \n`);
          log(tasksStorageData);
        }
        if (tasksData !== null) {
          if (typeof tasksData === 'function') {
            return tasksData(tasksStorageData);
          }
        }
        if (taskID !== null) {
          if (taskIDValidator(taskID)) {
            for (const taskItem in tasksStorageData) {
              if (tasksStorageData.hasOwnProperty(taskItem)) {
                if (parseInt(tasksStorageData[taskItem].id) === taskID) {
                  return taskData(tasksStorageData[taskItem]);
                }
              }
            }
          }
        }
      } else {
        log('No tasks were found in storage!');
      }
    });
  }

  /**
   * It clears the tasks storage area in chrome storage.
   */
  function clearTasksStorage() {
    storage.remove(schemaName, function() {
      const error = chrome.runtime.lastError;
      if (error) {
        log(error);
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
    if (taskText) {
      if (typeof taskText === 'string' && taskText !== '') {
        return taskText;
      }
    }
    console.error('taskText: must be string!');
  }

  /**
   * Task ID number validator
   * @param { number } taskID
   * @return {number} taskID
   */
  function taskIDValidator(taskID) {
    if (taskID && typeof taskID === 'number') {
      return taskID;
    }
  }

  /**
   * Save new tasksArray to tasks storage area in chrome storage.
   * @param {array} tasksArray
   * @param {string} loggedMessage
   */
  function setTasksStorageArea(tasksArray, loggedMessage) {
    storage.set({
      [schemaName]: tasksArray,
    }, function() {
      log(loggedMessage);
    });
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
    deleteTask: deleteTask,
    getTasks: getTasks,
    clearTasksStorage: clearTasksStorage,
  };
})();

