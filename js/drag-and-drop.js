// Drag and drop
let oldIndex;
let oldTaskId;
let oldTaskList;
let oldCategory;
let newIndex;
let newTaskId;
let newTaskList;
let newCategory;
let dragSource;

function dragStart(e) {
  dragSource = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
  oldTaskId = Number(this.dataset.taskId);
  oldCategory = this.closest('.category').dataset.category;
  oldTaskList = JSON.parse(localStorage.getItem(oldCategory));
  oldIndex = indexById(oldTaskList, oldTaskId);
};

function dragEnter(e) {
  this.classList.add('over');
}

function dragLeave(e) {
  e.stopPropagation();
  this.classList.remove('over');
}

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function dragDrop(e) {
  if (dragSource != this) {
    dragSource.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
    newTaskId = Number(this.dataset.taskId);
    newCategory = this.closest('.category').dataset.category;
    if (newCategory === oldCategory) {
      newTaskList = JSON.parse(localStorage.getItem(newCategory));
      newIndex = indexById(newTaskList, newTaskId);
      // swapping objects in array through desctructuring
      [newTaskList[oldIndex], newTaskList[newIndex]] = [newTaskList[newIndex], newTaskList[oldIndex]];
      localStorage.setItem(newCategory, JSON.stringify(newTaskList));
      let oldTaskCard = $(`[data-task-id='${oldTaskId}']`);
      this.dataset.taskId = oldTaskId;
      oldTaskCard.dataset.taskId = newTaskId;
    } else {
      newTaskList = JSON.parse(localStorage.getItem(newCategory));
      newIndex = indexById(newTaskList, newTaskId);
      let oldData = oldTaskList[oldIndex];
      let newData = newTaskList[newIndex];
      newTaskList[newIndex] = oldData;
      oldTaskList[oldIndex] = newData;
      localStorage.setItem(newCategory, JSON.stringify(newTaskList));
      localStorage.setItem(oldCategory, JSON.stringify(oldTaskList));
      let oldTaskCard = $(`[data-task-id='${oldTaskId}']`);
      this.dataset.taskId = oldTaskId;
      oldTaskCard.dataset.taskId = newTaskId;
    }
    progressBar();
  }
  return false;
}

function dragEnd(e) {
  var listItens = document.querySelectorAll('.draggable');
  [].forEach.call(listItens, function(item) {
    item.classList.remove('over');
  });
  numberTasks();
}

function addEventsDragAndDrop(el) {
  el.addEventListener('dragstart', dragStart, false);
  el.addEventListener('dragenter', dragEnter, false);
  el.addEventListener('dragover', dragOver, false);
  el.addEventListener('dragleave', dragLeave, false);
  el.addEventListener('drop', dragDrop, false);
  el.addEventListener('dragend', dragEnd, false);
}