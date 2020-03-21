window.onscroll = function() {
  $('.background img').style.transform = 'rotate(-' + window.pageYOffset / 30 + 'deg)';
};
window.addEventListener('load', function() {
  var listItems = document.querySelectorAll('.draggable');
  makeDraggable();
  // Archive button
  let archiveButton = $('.view-archived');
  let archivedTasks = JSON.parse(localStorage.getItem('Archived tasks'));
  if (!archivedTasks || archivedTasks.length === 0) {
    archiveButton.style.display = 'none';
  } else {
    archiveButton.style.display = 'flex';
  }
})
$el('click', e => {
  const cl = e.target.classList;
  let task = {};
  let category = {};
  const menu = $('.menu').classList;
  if (e.target.closest('.task')) {
    task = {
      el: e.target,
      card: e.target.closest('.task'),
      id: Number(e.target.closest('.task').dataset.taskId),
      cat: e.target.closest('.category').dataset.category
    }
  } else if (e.target.closest('.category')) {
    category = {
      el: e.target,
      cat: e.target.closest('.category').dataset.category
    }
  }
  switch (true) {
    // Category controls
    case cl.contains('select-all'):
      selectAll(category.el);
      break;
    case cl.contains('archive'):
      archiveTask(category.cat);
      progressBar();
      break;
    case cl.contains('delete-button'):
      deleteTask(category.cat);
      numberTasks();
      progressBar();
      break;
      // Task card controls
    case cl.contains('state'):
      setState(task.el, task.card, task.id, task.cat);
      break;
    case cl.contains('task-number'):
      selectTask(task.el, task.card, task.id);
      break;
    case cl.contains('date'):
      showTime(task.el);
      break;
      // New task control
    case cl.contains('logo'):
      newTaskDropdown();
      break;
      // Menu controls
    case cl.contains('menu-open'):
      openMenu(menu);
      break;
    case cl.contains('export-data'):
      exportData();
      closeMenu(menu);
      break;
    case cl.contains('clear-data'):
      clearData();
      closeMenu(menu);
      break;
    case cl.contains('view-archived'):
      viewArchived();
      numberTasks();
      progressBar();
      closeMenu(menu);
      break;
    default:
      closeMenu(menu);
  }
});
$el('keyup', e => {
  const cl = e.target.classList;
  let task = {};
  let category = {};
  console.log(e.target);
  if (e.target.closest('.task')) {
    task = {
      el: e.target,
      id: Number(e.target.closest('.task').dataset.taskId),
      cat: e.target.closest('.category').dataset.category
    }
  } else if (e.target.closest('.category')) {
    category = {
      el: e.target,
      cat: e.target.closest('.category').dataset.category
    }
  }
  switch (true) {
    case cl.contains('task-text'):
      updateTaskText(task.el, task.id, task.cat);
      break;
    case cl.contains('category-title'):
      updateCategoryText(category.el, category.cat);
      break;
    case cl.contains('search-input'):
      filterResults();
      break;
  }
});
const form = $('.form');
form.addEventListener('submit', e => {
  e.preventDefault();
  // Category
  const categoryInput = $('.category-input');
  const category = categoryInput.value.trim();
  // Tasks
  const taskInput = $('.task-input');
  const task = taskInput.value.trim();
  if (task.toLowerCase() === 'spin rocket') {
    $('.background img').classList.add('spin');
    setTimeout(function() {
      $('.background img').classList.remove('spin');
    }, 3000);
  } else if (task.toLowerCase() === 'shoot rocket') {
    $('.background img').classList.add('shoot');
    setTimeout(function() {
      $('.background img').classList.remove('shoot');
    }, 3000);
  }
  const state = 'new';
  const date = new Date;
  // This gets the local time
  const id = Date.now() - date.getTimezoneOffset() * 60 * 1000;
  createTask(category, task, state, id);
});