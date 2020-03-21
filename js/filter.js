$el('click', e => {
  const el = e.target;
  const cl = el.classList;
  switch (true) {
    case cl.contains('filter-dropdown'):
      $('.filter-options').classList.toggle('show');
      break;
    case cl.contains('filter-button'):
      el.classList.toggle('active-filter');
      let stateToExclude = el.dataset.filterState;
      filterByState(stateToExclude);
      break;
  }
});
let selectedTasks = [];
let excludedStates = [];

function filterByState(stateToExclude) {
  // {...foo} is just cloning the object
  const entries = storageEntries();
  const filterButton = $('.filter-dropdown').classList;
  // excludedStates is a global variable
  if (excludedStates.includes(stateToExclude)) {
    for (let [category, tasks] of entries) {
      let tasksInCategory = JSON.parse(tasks);
      for (let task of tasksInCategory) {
        if (task.state === stateToExclude) {
          $(`[data-task-id="${task.id}"]`).classList.remove('exclude');
        }
      }
    }
    spliceItem(excludedStates, stateToExclude);
  } else {
    excludedStates.push(stateToExclude);
    for (let [category, tasks] of entries) {
      let tasksInCategory = JSON.parse(tasks);
      for (let task of tasksInCategory) {
        if (excludedStates.includes(task.state)) {
          $(`[data-task-id="${task.id}"]`).classList.add('exclude');
        }
      }
    }
  }
  (excludedStates.length > 0) ? filterButton.add('filter-on'): filterButton.remove('filter-on');
}

function filterResults() {
  let searchInput = $('.search-input').value.toUpperCase();
  let categories = $$(".category");
  const entries = storageEntries();
  for (const [category, tasks] of entries) {
    let tasksInCategory = JSON.parse(tasks);
    let categoryCount = tasksInCategory.length;
    for (let task of tasksInCategory) {
      let taskToHide = $(`[data-task-id="${task.id}"]`);
      if (searchInput !== '' && excludedStates.includes(task.state)) {
        taskToHide.classList.add('hide')
        categoryCount--;
        console.log('Task hidden by filter');
      } else {
        if (task.task.toUpperCase().indexOf(searchInput) === -1) {
          taskToHide.classList.add('hide')
          categoryCount--;
          console.log('Task hidden by search');
        } else {
          taskToHide.classList.remove('hide')
        }
      }
    }
    // Hide category if empty
    let categoryToHide = $(`[data-category="${category}"]`);
    if (categoryToHide && categoryCount === 0) {
      categoryToHide.classList.add('hide');
    } else {
      if (categoryToHide && categoryToHide.classList.contains('hide')) {
        categoryToHide.classList.remove('hide');
      }
    }
    if (searchInput === '' && categoryToHide.classList.contains('hide')) {
      categoryToHide.classList.remove('hide');
    }
  }
}