// API URL
const API_URL = 'https://my-app-backend-dfhv.onrender.com/api/tasks'; 

// DOM elements
let tasks = [];
const taskManagerContainer = document.querySelector (".taskManager");
const confirmEl = document.querySelector(".confirm");
const confirmedBtn = confirmEl.querySelector(".confirmed");
const cancelledBtn = confirmEl.querySelector(".cancel");
let indexToBeDeleted = null;

// event listener to the form submit event
document.getElementById('taskForm').addEventListener('submit', handleFormSubmit);

// Function form submission
function handleFormSubmit(event) {
  event.preventDefault();
  
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();


  if (taskText !== '') {
    const newTask = {
      text: taskText,
      completed: false
    };


    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask)
    })
    .then(response => response.json())
    .then(task => {
      renderTasks(); 
      taskInput.value = ''; 
      return response.json();
    })
    .catch(error => console.error('Error adding task:', error));
  }
}

// Function to render tasks
function renderTasks() {
  const taskContainer = document.getElementById('taskContainer');
  taskContainer.innerHTML = ''; 

  //fetch tasks
  fetch(API_URL)
    .then(response => response.json())
    .then(tasks => {
      tasks.forEach((task, index) => {
        const taskCard = document.createElement('div');
        taskCard.classList.add('taskCard');
        let classVal = task.completed ? "completed" : "pending";
        let textVal = task.completed ? "Completed" : "Pending";
        taskCard.classList.add(classVal);

        const taskText = document.createElement('p');
        taskText.innerText = task.text;

        const taskStatus = document.createElement('p');
        taskStatus.classList.add('status');
        taskStatus.innerText = textVal;

        const toggleButton = document.createElement('button');
        toggleButton.classList.add("button-box");
        const btnContentEl = document.createElement("span");
        btnContentEl.classList.add("green");
        btnContentEl.innerText = task.completed ? 'Mark as Pending' : 'Mark as Completed';
        toggleButton.appendChild(btnContentEl);
        toggleButton.addEventListener('click', () => {
          
          fetch(`${API_URL}/${task.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: !task.completed })
          })
          .then(response => response.json())
          .then(() => renderTasks()) 
          .catch(error => console.error('Error updating task:', error));
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add("button-box");
        const delBtnContentEl = document.createElement("span");
        delBtnContentEl.classList.add("red");
        delBtnContentEl.innerText = 'Delete';
        deleteButton.appendChild(delBtnContentEl);
        deleteButton.addEventListener('click', () => {
          indexToBeDeleted = index;
          confirmEl.style.display = "block";
          taskManagerContainer.classList.add("overlay");
        });

        taskCard.appendChild(taskText);
        taskCard.appendChild(taskStatus);
        taskCard.appendChild(toggleButton);
        taskCard.appendChild(deleteButton);

        taskContainer.appendChild(taskCard);
      });
    })
    .catch(error => console.error('Error fetching tasks:', error));
}
  
//function delete task
function deleteTask(index) {
  if (index === undefined || index === null || index < 0 || index >= tasks.length) {
    console.error('Invalid index provided:', index);
    return;
  }

  const taskId = tasks[index]?.id; 

 
  if (!taskId) {
    console.error('Invalid taskId:', taskId);
    return;
  }

  
  fetch(`${API_URL}/${taskId}`, {
    method: 'DELETE',
  })
    .then(() => {
      tasks.splice(index, 1);  
      renderTasks();  
    })
    .catch(error => console.error('Error deleting task:', error));
}

confirmedBtn.addEventListener("click", () => {
  confirmEl.style.display = "none";
  taskManagerContainer.classList.remove("overlay");
  deleteTask(indexToBeDeleted);
});


cancelledBtn.addEventListener("click", () => {
  confirmEl.style.display = "none";
  taskManagerContainer.classList.remove("overlay");
});


