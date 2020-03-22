// +++++++ Global variables +++++++
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const $el = document.addEventListener.bind(document);
//  +++++++ Constructors +++++++
function Task(task, state, id) {
  this.task = task;
  this.state = state;
  this.id = id;
}
// Pure functions
function storageEntries() {
  return Object.entries({
    ...localStorage
  });
}

function indexById(taskList, taskId) {
  return taskList.findIndex(task => Number(task.id) === taskId);
}

function spliceItem(array, id) {
  array.splice(array.indexOf(id), 1);
}

function addToDropdown(cat) {
  const dropdown = $('.new-task select');
  dropdown.insertAdjacentHTML('afterbegin', `
      <option value="${cat}" data-option='${cat}'>${cat}</option>`);
}

function makeDraggable() {
  var listItems = document.querySelectorAll('.draggable');
  [].forEach.call(listItems, function(item) {
    addEventsDragAndDrop(item);
  });
}

function appendCategory(el, cat) {
  let location = $(`${el}`);
  location.insertAdjacentHTML('afterbegin', `
      <li class="category" data-category='${cat}'>
        <div class="header">

          <input type="text" placeholder="Category name" value='${cat}' data-category-title='${cat}' class='category-title'/>

          <div class='options'>
            <button class="select-all"><i class='fas fa-check-circle'></i></button>
            <button class="archive"> <i class='fas fa-archive'></i></button>
            <button class='delete-button' data-delete-category="${cat}"><i class='fas fa-trash'></i></button>
          </div>
        </div>
        <div class="progress-bar">
          <div class="new"></div>
          <div class="resolve"></div>
          <div class="test"></div>
          <div class="done"></div>
        </div>
        <ul class="tasks" data-task-list="${cat}"></ul>
      </li>
    `);
}

function appendTask(cat, task) {
  let location = $(`[data-task-list='${cat}']`);
  location.insertAdjacentHTML('beforeend', `
    <li class="task draggable" data-task-id="${task.id}" draggable="true">
      <div class="select-card">
        <input type="checkbox"  id="${task.id}">
        <label for="${task.id}" class="task-number"></label>
      </div>

      <div class='card-info'>
        <input type="text" placeholder="Task summary" class='task-text' value='${task.task}'/>
        <div class="states">
          <input name='state-${task.id}' id='new-${task.id}' type="radio" value="new">
          <label data-state='new' for='new-${task.id}' class='state'>New</label>

          <input name='state-${task.id}' id='resolve-${task.id}' type="radio" value="resolve">
          <label data-state='resolve' for='resolve-${task.id}' class='state'>Resolve</label>

          <input name='state-${task.id}' id='test-${task.id}' type="radio" value="test">
          <label data-state='test' for='test-${task.id}' class='state'>Test</label>

          <input name='state-${task.id}' id='done-${task.id}' type="radio" value="done">
          <label data-state='done' for='done-${task.id}' class='state'>Done</label>
        </div>
        <div class='created'><span class='time'></span> <span class='date'></span></div>

      </li>

    `);
  if (cat === 'Archived tasks') {
    $(`[data-task-id="${task.id}"] .task-number`).innerHTML = '<i class="fas fa-check"></i>'
  }
}

function loadState(task) {
  switch (task.state) {
    case 'new':
      $(`#new-${task.id}`).setAttribute('checked', 'checked');
      break;
    case 'resolve':
      $(`#resolve-${task.id}`).setAttribute('checked', 'checked');
      break;
    case 'test':
      $(`#test-${task.id}`).setAttribute('checked', 'checked');
      break;
    case 'done':
      $(`#done-${task.id}`).setAttribute('checked', 'checked');
      break;
  }
}

function removeClass(el, className) {
  let element = $(`${el}`);
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  }
}

function highlightNew(task) {
  $(`[data-task-id="${task.id}"]`).style.background = 'var(--gray300)';
  setTimeout(function() {
    $(`[data-task-id="${task.id}"]`).style.background = 'var(--gray400)';
  }, 400);
}

function throwError(message) {
  let errorMessage = $('.error-message');
  errorMessage.textContent = message;
  $('.error').classList.add('show-error');
  $el('click', e => {
    removeClass('.error', 'show-error');
  });
  throw new Error(message);
}

function setTimeoutRemove(item, time) {
  setTimeout(function() {
    item.remove();
  }, time);
}

function timeAndDate(task) {
  $(`[data-task-id="${task.id}"] .created .time`).textContent = timeCreated(new Date(Number(task.id)));
  $(`[data-task-id="${task.id}"] .created .date`).textContent = dateCreated(new Date(Number(task.id)));
}
// Load data from local storage on reload
function loadData() {
  // Starting fresh...loading tasks from memory, not browser memory
  let allTasks = $$('.task');
  let allCats = $$('.category');
  if (allTasks.length > 0) {
    for (let task of allTasks) {
      task.remove();
    }
  }
  if (allCats.length > 0) {
    for (let cat of allCats) {
      cat.remove();
    }
  }
  let unsortedKeys = Object.keys(localStorage);
  let sortedIds = [];
  let keys = [];
  let data = storageEntries();
  if (unsortedKeys.length > 0) {
    for (let i = 0; i < unsortedKeys.length; i++) {
      let taskList = JSON.parse(localStorage.getItem(unsortedKeys[i]));
      let firstTask = taskList[0];
      if (firstTask) {
        sortedIds.push(firstTask.id);
      }
      // Sort into newest task first
      sortedIds = sortedIds.sort(function(a, b) {
        return b - a;
      });
    }
    for (let sortedId of sortedIds) {
      for (let [cat, taskList] of data) {
        taskList = JSON.parse(taskList);
        for (let task of taskList) {
          if (task.id === sortedId) {
            keys.push(cat);
          };
        }
      }
    }
    if (keys.indexOf('Archived tasks') > -1 && unsortedKeys.length > 0) {
      keys = unsortedKeys;
    }
    // loads the oldest one first
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] !== "Archived tasks") {
        addToDropdown(keys[i]);
        appendCategory('.current-tasks', keys[i]);
        let lsTasks = JSON.parse(localStorage.getItem(keys[i]));
        for (let j = 0; j < lsTasks.length; j++) {
          // Finds category
          // const taskListInCategory = $(`[data-task-list='${keys[i]}']`);
          appendTask(keys[i], lsTasks[j]);
          loadState(lsTasks[j]);
          timeAndDate(lsTasks[j]);
        }
      } else {
        let archivedTasks = JSON.parse(localStorage.getItem('Archived tasks'));
        let cat = "Archived tasks";
        // Append new category
        appendCategory('.archived-tasks', cat);
        const archivedTaskList = $(`[data-task-list="${cat}"]`);
        for (let archivedTask of archivedTasks) {
          // Append new task
          appendTask(cat, archivedTask);
          loadState(archivedTask);
          timeAndDate(archivedTask);
        }
      }
    }
    numberTasks();
    progressBar();
  }
}