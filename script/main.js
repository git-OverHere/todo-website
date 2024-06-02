function refreshTodo(todoArray, focusedTodo) {
    const parent = document.querySelector('#parent');
    parent.innerHTML = '';
    todoArray.forEach(function(todo, index) {showAllTodo(todo, index, todoArray, focusedTodo)});
}

function showFilteredTodo(filteredTodo, filteredIndex, todoArray, focusedTodo) {
    const parent = document.querySelector('#parent');
    parent.innerHTML = '';
    filteredTodo.forEach(function(todo, index) {showAllTodo(todo, filteredIndex[index], todoArray, focusedTodo)});
}

function showAllTodo(todo, currNum, todoArray, focusedTodo) {
    const todoList = document.querySelector('#parent')
    //Create new div to contain to do
    let newDiv = document.createElement('div');
    newDiv.classList.add('todo-container');
    //Create the checkbox
    let checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.id = `cb${currNum}`;
    checkBox.checked = todo.isCompleted;
    checkBox.addEventListener('click', function(e) {completeTodo(e, currNum, todoArray)});
    //Create confirm edit button
    let confirmEditBtn = document.createElement('button');
    confirmEditBtn.classList.add('btn');
    confirmEditBtn.classList.add('confirmEdit');
    confirmEditBtn.id = `ceb${currNum}`;
    confirmEditBtn.innerHTML = "<iconify-icon icon='fa:check' class='icon-confirm'></iconify-icon>";
    confirmEditBtn.onclick = function(e) {confirmEdit(e, currNum, todoArray)};
    //Create the textarea
    let textArea = document.createElement('textarea');
    textArea.name = 'todo';
    textArea.id =  `ta${currNum}`;
    textArea.onkeyup = function() {adjustTextareaHeight(`#ta${currNum}`)};
    textArea.innerHTML = todo.todo;
    textArea.readOnly = true;
    //Create edit button
    let editBtn = document.createElement('button');
    editBtn.classList.add('btn');
    editBtn.classList.add('editBtn');
    editBtn.id = `eb${currNum}`;
    editBtn.innerHTML = "<iconify-icon icon='fa-solid:edit' class='icon-todo'></iconify-icon>";
    editBtn.addEventListener('click', function(e) {editTodo(e, currNum, todoArray)});
    //Create delete button
    let delBtn = document.createElement('button');
    delBtn.classList.add('btn');
    delBtn.classList.add('delBtn');
    delBtn.id = `db${currNum}`;
    delBtn.innerHTML = "<iconify-icon icon='fa-trash' class='icon-todo'></iconify-icon>"
    delBtn.addEventListener('click', function(e) {confirmDelete(e, currNum, focusedTodo)});
    //Add show button functionality to edit and del
    newDiv.onmouseover = function() {showEditDelete(`#eb${currNum}`, `#db${currNum}`)};
    newDiv.onmouseout = function() {hideEditDelete(`#eb${currNum}`, `#db${currNum}`, `#ta${currNum}`)};

    //Add all to div then to parent that holds all todos
    newDiv.appendChild(checkBox);
    newDiv.appendChild(confirmEditBtn);
    newDiv.appendChild(textArea);
    newDiv.appendChild(editBtn);
    newDiv.appendChild(delBtn);
    todoList.prepend(newDiv);
}

function adjustTextareaHeight(element) {
    const textArea = document.querySelector(element);
    if (textArea != null) {
        textArea.style.height = `${textArea.scrollHeight}px`;
    }
}

function showEditDelete(edit, del) {
    const editBtn = document.querySelector(edit);
    const delBtn = document.querySelector(del);
    editBtn.style.display = 'inline';
    delBtn.style.display = 'inline';
}

function hideEditDelete(edit, del, textArea) {
    if (document.activeElement != document.querySelector(textArea)) {
        const editBtn = document.querySelector(edit);
        const delBtn = document.querySelector(del);
        editBtn.style.display = 'none';
        delBtn.style.display = 'none';
    }
}

function completeTodo(e, index, todoArray) {
    const checkBox = document.querySelector(`#cb${index}`);
    if (checkBox.checked === true) {
        todoArray[index].isCompleted = true;
    } else {
        todoArray[index].isCompleted = false;
    }
    saveToLocalStorage(todoArray);
}

function editTodo(e, index, todoArray) {
    const checkBox = document.querySelector(`#cb${index}`);
    checkBox.style.display = 'none';
    const confirmEditBtn = document.querySelector(`#ceb${index}`);
    confirmEditBtn.style.display = 'inline';
    const textArea = document.querySelector(`#ta${index}`);
    textArea.readOnly = false;
}

function confirmEdit(e, index, todoArray) {
    const checkBox = document.querySelector(`#cb${index}`);
    checkBox.style.display = 'block';
    const confirmEditBtn = document.querySelector(`#ceb${index}`);
    confirmEditBtn.style.display = 'none';
    const textArea = document.querySelector(`#ta${index}`);
    textArea.readOnly = true;
    todoArray[index].todo = textArea.value;
    saveToLocalStorage(todoArray);
}

function confirmDelete(e, index, focusedTodo) {
    //Sho choices
    const choice = document.querySelector('#choices');
    choice.style.display = 'inline';
    //Get and display todo preview
    const textArea = document.querySelector(`#ta${index}`);
    let text;
    if (textArea.value.length > 30) {
        text = textArea.value.substring(0, 27) + '...';
    } else {
        text = textArea.value;
    }
    const textPreview = document.querySelector('#text-preview');
    textPreview.innerHTML = text;
    focusedTodo[0] = index;
}

function deleteTodo(e, toDelete, focusedTodo, todoArray) {
    //Hide choices
    const choice = document.querySelector('#choices');
    choice.style.display = 'none';
    //Remove preview of todo
    const textPreview = document.querySelector('#text-preview');
    textPreview.innerHTML = '';
    if (toDelete) {
        todoArray.splice(focusedTodo[0], 1);
    }
    focusedTodo.pop();
    saveToLocalStorage(todoArray);
    refreshTodo(todoArray, focusedTodo);
}

function addTodo(e, todoArray, focusedTodo) {
    //Check if there is todo in input
    const todoText = document.querySelector('#searchbar');
    if (todoText.value === '') {
        errorMsg.innerHTML = 'No todo added';

        setTimeout(() => {
            errorMsg.innerHTML = '';
        }, 3000);
    } else {
        const currNum = todoArray.length;
        const todoList = document.querySelector('#parent')
        //Create new div to contain to do
        let newDiv = document.createElement('div');
        newDiv.classList.add('todo-container');
        //Create the checkbox
        let checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.id = `cb${currNum}`;
        checkBox.addEventListener('click', function(e) {completeTodo(e, currNum, todoArray)});
        //Create confirm edit button
        let confirmEditBtn = document.createElement('button');
        confirmEditBtn.classList.add('btn');
        confirmEditBtn.classList.add('confirmEdit');
        confirmEditBtn.id = `ceb${currNum}`;
        confirmEditBtn.innerHTML = "<iconify-icon icon='fa:check' class='icon-confirm'></iconify-icon>";
        confirmEditBtn.onclick = function(e) {confirmEdit(e, currNum, todoArray)};
        //Create the textarea
        let textArea = document.createElement('textarea');
        textArea.name = 'todo';
        textArea.id =  `ta${currNum}`;
        textArea.onkeyup = function() {adjustTextareaHeight(`#ta${currNum}`)};
        textArea.innerHTML = todoText.value;
        textArea.readOnly = true;
        //Create edit button
        let editBtn = document.createElement('button');
        editBtn.classList.add('btn');
        editBtn.classList.add('editBtn');
        editBtn.id = `eb${currNum}`;
        editBtn.innerHTML = "<iconify-icon icon='fa-solid:edit' class='icon-todo'></iconify-icon>";
        editBtn.addEventListener('click', function(e) {editTodo(e, currNum, todoArray)});
        //Create delete button
        let delBtn = document.createElement('button');
        delBtn.classList.add('btn');
        delBtn.classList.add('delBtn');
        delBtn.id = `db${currNum}`;
        delBtn.innerHTML = "<iconify-icon icon='fa-trash' class='icon-todo'></iconify-icon>"
        delBtn.addEventListener('click', function(e) {confirmDelete(e, currNum, focusedTodo)});
        //Add show button functionality to edit and del
        newDiv.onmouseover = function() {showEditDelete(`#eb${currNum}`, `#db${currNum}`)};
        newDiv.onmouseout = function() {hideEditDelete(`#eb${currNum}`, `#db${currNum}`, `#ta${currNum}`)};

        //Add all to div then to parent that holds all todos
        newDiv.appendChild(checkBox);
        newDiv.appendChild(confirmEditBtn);
        newDiv.appendChild(textArea);
        newDiv.appendChild(editBtn);
        newDiv.appendChild(delBtn);
        todoList.prepend(newDiv);

        //Save todo to array
        todoArray.push({
            isCompleted: false,
            todo: todoText.value
        });

        //Update local storage
        saveToLocalStorage(todoArray);

        //Remove value of searchbar
        todoText.value = '';
    }    
}

function showMatching(toMatch, todoArray, focusedTodo) {
  if (toMatch === "") {
    errorMsg.innerHTML = "No search word added";
    refreshTodo(todoArray, focusedTodo);
    //error message disappears after 3 seconds
    setTimeout(() => {
      errorMsg.innerHTML = "";
    }, 3000);
  } else {
    const filteredIndex = [];
    const filteredTodo = todoArray.filter(function (todo, index) {
      saveIndex(todo, toMatch, index, filteredIndex);
      return todo.todo.toLowerCase().includes(toMatch.toLowerCase());
    });
    if (filteredTodo.length === 0) {
      errorMsg.innerHTML = "No match";
      //hide error msg after 3 seconds then show all todos
      setTimeout(() => {
        errorMsg.innerHTML = "";
        refreshTodo(todoArray, focusedTodo);
      }, 3000);
    } else {
      showFilteredTodo(filteredTodo, filteredIndex, todoArray, focusedTodo);
    }
  }
}

function saveIndex(todo, toMatch, index, indexArray) {
    if (todo.todo.includes(toMatch)) {
        indexArray.push(index);
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const themeBtn = document.querySelector('.icon-theme');
    if(themeBtn.icon === 'fa-solid:sun') {
        themeBtn.icon = 'fa-solid:moon';
    } else 
    themeBtn.icon = 'fa-solid:sun';
}

function saveToLocalStorage(todoArray) {
    const todoArray_serialized = JSON.stringify(todoArray);
    localStorage.setItem("myTodoList", todoArray_serialized);
}

function getFromLocalStorage() {
    return JSON.parse(localStorage.getItem("myTodoList"));
}

const focusedTodo = [];
let todoArray = getFromLocalStorage();
//change to empty array if null
if (todoArray === null) {
    todoArray = [];
} else {
    refreshTodo(todoArray, focusedTodo);
}
const errorMsg = document.querySelector('.error-msg');
const addNoteBtn = document.querySelector('#addBtn');
const searchbar = document.querySelector('#searchbar');
const searchBtn = document.querySelector('#searchBtn');
const yesBtn = document.querySelector('#yes');
const noBtn = document.querySelector('#no');
const themeButton = document.querySelector('.icon-theme');

addNoteBtn.addEventListener('click', function(e) {addTodo(e, todoArray, focusedTodo)});
searchBtn.addEventListener('click', function(e) {showMatching(searchbar.value, todoArray, focusedTodo)});
yesBtn.addEventListener('click', function(e) {deleteTodo(e, true, focusedTodo, todoArray)});
noBtn.addEventListener('click', function(e) {deleteTodo(e, false, focusedTodo, todoArray)});
themeButton.addEventListener('click', function(e) {toggleTheme()})



