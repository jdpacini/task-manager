function selectAll(el) {
  let category = el.closest('.category');
  let tasks = category.querySelectorAll('.task');
  if (tasks.length > 0) {
    let icon = el.querySelector('i').classList;
    let progressBars = category.querySelectorAll('.progress-bar>div');
    // If all selected, unselect all
    let tasksSelected = category.querySelectorAll('.task.selected');
    el.classList.remove('selected');
    for (let bar of progressBars) {
      bar.classList.remove('selected');
    }
    if (tasksSelected.length > 0 && (tasks.length === selectedTasks.length)) {
      for (let task of tasks) {
        task.querySelector('.task-number').click();
      }
    } else {
      // Select all
      el.classList.add('selected');
      for (let bar of progressBars) {
        bar.classList.add('selected');
      }
      for (let task of tasks) {
        if (task.querySelector('input[type="checkbox"]').checked === false) {
          task.querySelector('.task-number').click();
        }
      }
    }
  }
}

function archiveTask(cat) {
  if (selectedTasks.length > 0) {
    let viewArchiveButton = $('.view-archived');
    viewArchiveButton.style.display = '';
    // starting from top because selectedTasks.length is dynamic
    selectedTasks.reverse();
    for (let i = selectedTasks.length - 1; i >= 0; i--) {
      let taskList = JSON.parse(localStorage.getItem(cat));
      let index = indexById(taskList, selectedTasks[i]);
      let task = taskList[index];
      let archiveList = JSON.parse(localStorage.getItem('Archived tasks'));
      if (!archiveList) {
        archiveList = [];
      }
      archiveList.push(task);
      localStorage.setItem('Archived tasks', JSON.stringify(archiveList));
      taskList.splice([index], 1);
      localStorage.setItem(cat, JSON.stringify(taskList));
      if (!$(`[data-category='Archived tasks']`)) {
        appendCategory('.archived-tasks', 'Archived tasks')
      }
      appendTask('Archived tasks', task);
      loadState(task);
      timeAndDate(task);
      let selectedTaskCard = $(`[data-task-id='${selectedTasks[i]}'].selected`);
      selectedTaskCard.classList.add('remove');
      setTimeoutRemove(selectedTaskCard, 600);
      spliceItem(selectedTasks, selectedTasks[i]);
      removeSelected(cat);
      makeDraggable();
    }
  }
  // so animations can finish
  setTimeout(function() {
    numberTasks();
  }, 600);
}

function deleteTask(cat) {
  let localCat = JSON.parse(localStorage.getItem(cat));
  // If there are no tasks
  if (localCat.length === 0) {
    let categoryCard = $(`[data-category="${cat}"]`);
    categoryCard.classList.add('remove');
    setTimeoutRemove(categoryCard, 600);
    let dropdownCategory = $(`[data-option="${cat}"]`);
    if (dropdownCategory) {
      dropdownCategory.remove();
    }
    localStorage.removeItem(cat);
    console.log('Category deleted:');
    console.log(cat);
    if (cat === 'Archived tasks') {
      viewArchived();
    }
  }
  let tasksSelected = $$('.task.selected');
  for (let i = 0; i < tasksSelected.length; i++) {
    if (tasksSelected[i].closest('.category').dataset.category === cat) {
      localCat = JSON.parse(localStorage.getItem(cat));
      let taskId = Number(tasksSelected[i].dataset.taskId);
      tasksSelected[i].classList.add('remove');
      setTimeoutRemove(tasksSelected[i], 600);
      let index = indexById(localCat, taskId);
      localCat.splice(index, 1);
      localCat = JSON.stringify(localCat);
      localStorage.setItem(cat, localCat);
      spliceItem(selectedTasks, taskId);
    }
  }
  setTimeout(function() {
    numberTasks();
  }, 600);
  removeSelected(cat);
}

function removeSelected(cat) {
  let selectAll = $(`[data-category='${cat}'] .select-all`);
  if (selectAll && selectAll.classList.contains('selected')) {
    selectAll.classList.remove('selected');
    let progressBars = $$(`[data-category='${cat}'] .progress-bar>div`);
    for (let progressBar of progressBars) {
      progressBar.classList.remove('selected');
    }
  }
}

function updateCategoryText(el, cat) {
  const input = el.value;
  const data = localStorage.getItem(cat);
  const categoryCard = $(`[data-category="${cat}"]`);
  localStorage.removeItem(cat);
  localStorage.setItem(input, data);
  categoryCard.setAttribute('data-category', `${input}`);
}

function progressBar() {
  let keys = Object.keys({
    ...localStorage
  });
  let archivedTasks = JSON.parse(localStorage.getItem('Archived tasks'));
  for (let key of keys) {
    let taskList = JSON.parse(localStorage.getItem(key));
    let progressBar = $(`[data-category='${key}'] .progress-bar`);
    if (progressBar) {
      const nBar = progressBar.querySelector('.new');
      const rBar = progressBar.querySelector('.resolve');
      const tBar = progressBar.querySelector('.test');
      const dBar = progressBar.querySelector('.done');
      let n = 0;
      let r = 0;
      let t = 0;
      let d = 0;
      let total;
      if (taskList.length > 0) {
        for (let task of taskList) {
          switch (task.state) {
            case 'new':
              n++;
              break;
            case 'resolve':
              r++;
              break;
            case 'test':
              t++;
              break;
            case 'done':
              d++;
              break;
          }
        }
        total = n + r + t + d;
        nBar.style.width = n / total * 100 + '%';
        rBar.style.width = r / total * 100 + '%';
        tBar.style.width = t / total * 100 + '%';
        dBar.style.width = d / total * 100 + '%';
      } else {
        nBar.style.width = 0;
        rBar.style.width = 0;
        tBar.style.width = 0;
        dBar.style.width = 0;
      }
    }
  }
}