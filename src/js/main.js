document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', (event) => {
      event.preventDefault();
      addTodo();
    });
  
    const RENDER_EVENT = 'render-todo';
  
    document.addEventListener(RENDER_EVENT, function () {
      const uncompletedTODOList = document.getElementById('todos');
      uncompletedTODOList.innerHTML = '';
  
      const completedTODOList = document.getElementById('completed-todos');
      completedTODOList.innerHTML = '';
  
      for (const todoItem of todos) {
        const todoElement = makeTodoElement(todoItem);
  
        if (!todoItem.isCompleted) {
          uncompletedTODOList.appendChild(todoElement);
        } else {
          const undoButton = todoElement.querySelector('.undo-button');
          const trashButton = todoElement.querySelector('.trash-button');
  
          undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(todoItem.id);
          });
  
          trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(todoItem.id);
          });
  
          completedTODOList.appendChild(todoElement);
        }
      }
    });
  });
  
  const todos = [];
  
  // Fungsi untuk membuat objek todo
  function generateId() {
    return +new Date();
  }
  
  function generateTodoObject(id, task, timeStamp, isCompleted) {
    return {
      id,
      task,
      timeStamp,
      isCompleted
    };
  }
  
  // Fungsi untuk menambahkan todo baru
  function addTodo() {
    const getTextTodo = document.getElementById('title').value;
    const getDate = document.getElementById('date').value;
  
    const generatedId = generateId();
    const todoObject = generateTodoObject(generatedId, getTextTodo, getDate, false);
  
    todos.push(todoObject);
  
    const RENDER_EVENT = 'render-todo';
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
  
  // Fungsi untuk membuat elemen todo
  function makeTodoElement(todoObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = todoObject.task;
  
    const textTimeStamp = document.createElement('p');
    textTimeStamp.innerText = todoObject.timeStamp;
  
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimeStamp);
  
    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
  
    const RENDER_EVENT = 'render-todo';
  
    if (todoObject.isCompleted) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('undo-button');
      undoButton.innerText = '';
  
      undoButton.addEventListener('click', function () {
        undoTaskFromCompleted(todoObject.id);
      });
  
      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
      trashButton.innerText = '';
  
      trashButton.addEventListener('click', function () {
        removeTaskFromCompleted(todoObject.id);
      });
  
      container.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('check-button');
      checkButton.innerText = '';
  
      checkButton.addEventListener('click', function () {
        addTaskToCompleted(todoObject.id);
      });
  
      container.append(checkButton);
    }
  
    container.setAttribute('id', `todo-${todoObject.id}`);
    return container;
  }
  
  // Fungsi untuk menghapus tugas yang telah selesai
  function removeTaskFromCompleted(todoId) {
    const todoIndex = findTodoIndex(todoId);
    if (todoIndex === -1) return;
    todos.splice(todoIndex, 1);
    document.dispatchEvent(new Event('render-todo'));
  }
  
  // Fungsi untuk mengubah status tugas menjadi belum selesai
  function undoTaskFromCompleted(todoId) {
    const todo = findTodo(todoId);
    if (!todo) return;
    todo.isCompleted = false;
    document.dispatchEvent(new Event('render-todo'));
  }
  
  // Fungsi untuk menambahkan tugas ke daftar yang telah selesai
  function addTaskToCompleted(todoId) {
    const todo = findTodo(todoId);
    if (!todo) return;
    todo.isCompleted = true;
    document.dispatchEvent(new Event('render-todo'));
  }
  
// Fungsi untuk mencari tugas berdasarkan ID
function findTodo(todoId) {
    return todos.find(todo => todo.id === todoId);
  }
  
  // Fungsi untuk mencari indeks tugas berdasarkan ID
  function findTodoIndex(todoId) {
    return todos.findIndex(todo => todo.id === todoId);
  }