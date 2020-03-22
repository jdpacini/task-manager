// Menu functionality
const fileInput = $('#file-select');
fileInput.addEventListener('change', function() {
  importData();
});

function openMenu(menu) {
  if (!menu.contains('show')) {
    menu.add('show');
  }
}

function closeMenu(menu) {
  if (menu.contains('show')) {
    menu.remove('show');
  }
}

function importData() {
  for (let i = 0; i < fileInput.files.length; i++) {
    if (fileInput.files.item(i)) {
      let file = fileInput.files.item(i);
      let reader = new FileReader();
      reader.onload = function(e) {
        let data = e.target.result;
        data = data.split("\n");
        // removing blank array elements
        data = data.filter(item => item);
        let category;
        // starting on 1 because first line is just the header
        for (let j = 1; j < data.length; j++) {
          let taskData = data[j].split(',');
          let task = {
            task: taskData[1],
            state: taskData[2],
            id: taskData[3]
          }
          let taskList;
          if (taskData[0] !== '') {
            category = taskData[0];
            taskList = [];
          } else {
            taskList = JSON.parse(localStorage.getItem(category));
          }
          taskList.push(task);
          localStorage.setItem(category, JSON.stringify(taskList));
        }
        loadData();
      }
      reader.readAsBinaryString(file);
    }
  }
}

function exportData() {
  let data = Object.entries({
    ...localStorage
  });
  let csv = 'Category,Task,Task State,Task ID\n';
  for (let [category, tasks] of data) {
    csv += category;
    tasks = JSON.parse(tasks);
    for (let task of tasks) {
      csv += ',';
      csv += Object.values(task).join() + '\n';
    }
    csv += '\n';
  }
  let date = new Date().getMonth() + 1;
  date = date.toString() + '-';
  date += new Date().getDate().toString() + '-';
  date += new Date().getUTCFullYear().toString();
  date.toString();
  const hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'tasks' + '-' + date + '.csv';
  hiddenElement.click();
}

function clearData() {
  const prompt = confirm("Are you sure you want to delete all data?");
  if (prompt) {
    const allTasks = $$('.task');
    const allCategories = $$('.category');
    for (let task of allTasks) {
      task.classList.add('remove');
      setTimeoutRemove(task, 1000);
    }
    for (let category of allCategories) {
      setTimeout(function() {
        category.classList.add('remove');
      }, 200);
      setTimeoutRemove(category, 1000);
    }
    localStorage.clear();
    selectedTasks = [];
    let options = $$('.select-category select option');
    for (let option of options) {
      option.remove();
    };
  }
}

function viewArchived() {
  const archivedCategory = $('.archived-tasks');
  const archiveButton = $('.view-archived');
  const archiveButtonText = $('.view-archived p');
  if (archivedCategory.classList.contains('view')) {
    archiveButtonText.textContent = 'View archive';
    archivedCategory.classList.remove('view');
  } else {
    archiveButtonText.textContent = 'Hide archive';
    archivedCategory.classList.add('view');
  }
  const localArchive = JSON.parse(localStorage.getItem('Archived tasks'));
  if (!localArchive || localArchive.length === 0) {
    archiveButton.style.display = 'none';
  }
}

function newTaskDropdown() {
  $('.new-task').classList.toggle('show');
  $('.task-input').focus();
  $('.logo').classList.toggle('close');
}