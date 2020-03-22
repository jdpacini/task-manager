function createTask(cat, task, state, id) {
  if (cat !== '') {
    // Check for duplicates
    let localCat = localStorage.getItem(cat);
    if (localCat) {
      throwError('Category already exists');
    }
    addToDropdown(cat);
    appendCategory('.current-tasks', cat);
    const catInput = $('.category-input');
    catInput.value = '';
    const currentCat = $('.new-task select');
    currentCat.value = cat;
    localStorage.setItem(cat, '[]');
  } else {
    const currentCat = $('.new-task select').value;
    if (currentCat === '') {
      throwError("Create a category first");
    } else {
      const currentCat = $('.new-task select').value;
      cat = currentCat;
    }
  }
  let taskItem;
  let result;
  if (task !== '') {
    let lsTaskList = JSON.parse(localStorage.getItem(cat));
    if (lsTaskList) {
      taskItem = new Task(task, state, id);
      lsTaskList.push(taskItem);
      localStorage.setItem(cat, JSON.stringify(lsTaskList));
    } else {
      let tasks = [];
      taskItem = new Task(task, state, id);
      tasks.push(taskItem);
      localStorage.setItem(cat, JSON.stringify(tasks));
    }
    appendTask(cat, taskItem);
    $(`#new-${taskItem.id}`).setAttribute('checked', 'checked');
    var listItems = document.querySelectorAll('.draggable');
    makeDraggable();
    highlightNew(taskItem);
    timeAndDate(taskItem);
    console.log('Task created:');
    console.log(taskItem);
    const taskInput = $('.task-input');
    taskInput.value = '';
  }
  numberTasks();
  progressBar();
  removeClass('.new-task', 'show');
  removeClass('.logo', 'close');
}

function setState(el, card, id, cat) {
  const cardStates = card.querySelectorAll('.states input');
  for (let cardState of cardStates) {
    cardState.removeAttribute('checked');
  }
  const state = el.dataset.state;
  $(`#${state}-${id}`).setAttribute('checked', 'checked');
  const localCat = JSON.parse(localStorage.getItem(cat));
  const index = indexById(localCat, id);
  localCat[index].state = state;
  localStorage.setItem(cat, JSON.stringify(localCat));
  if (excludedStates.indexOf(state) > -1) {
    card.classList.add('exclude');
  } else {
    if (card.classList.contains('exclude')) {
      card.classList.remove('exclude');
    }
  }
  progressBar();
  console.log('Task state changed to ' + state);
  console.log(localCat[index]);
}

function selectTask(el, card, id) {
  card.classList.toggle('selected');
  if (card.classList.contains('selected')) {
    !selectedTasks.includes(id) && selectedTasks.push(id);
    console.log('Selected tasks: ');
    console.log(selectedTasks);
  } else {
    spliceItem(selectedTasks, id)
  }
  console.log('Task card selected:');
  console.log(card);
}

function updateTaskText(el, id, cat) {
  const input = el.value;
  const taskList = JSON.parse(localStorage.getItem(cat));
  const index = indexById(taskList, id);
  taskList[index].task = input;
  localStorage.setItem(cat, JSON.stringify(taskList));
}

function dateCreated(date) {
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let y = date.getUTCFullYear();
  let m = months[date.getUTCMonth()];
  let d = date.getUTCDate();
  return m + ' ' + d + ' ' + y;
}

function timeCreated(date) {
  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  let h = addZero(date.getUTCHours());
  let m = addZero(date.getUTCMinutes());
  let s = addZero(date.getUTCSeconds());
  return h + ':' + m + ':' + s;
}

function showTime(el) {
  el.closest('.created').querySelector('.time').classList.toggle('show');
}

function numberTasks() {
  let taskNumbers = $$('.current-tasks .task-number');
  console.log(taskNumbers);
  for (let i = 0; i < taskNumbers.length; i++) {
    taskNumbers[i].textContent = i + 1;
  }
}