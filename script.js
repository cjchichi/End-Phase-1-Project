// API URL
const API_URL = 'http://localhost:3000/tasks'; // Replace with your actual API URL

// DOM elements
const taskManagerContainer = document.querySelector(".taskManager");
const confirmEl = document.querySelector(".confirm");
const confirmedBtn = confirmEl.querySelector(".confirmed");
const cancelledBtn = confirmEl.querySelector(".cancel");
let indexToBeDeleted = null;

// Add event listener to the form submit event
document.getElementById('taskForm').addEventListener('submit', handleFormSubmit);

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();

  // If task text is not empty, add it to the API
  if (taskText !== '') {
    const newTask = {
      text: taskText,
      completed: false
    };

    // POST the new task to the API
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask)
    })
    .then(response => response.json())
    .then(task => {
      renderTasks(); // Re-render tasks after adding a new one
      taskInput.value = ''; // Clear the input field
    })
    .catch(error => console.error('Error adding task:', error));
  }
}

// Function to render tasks
function renderTasks() {
  const taskContainer = document.getElementById('taskContainer');
  taskContainer.innerHTML = ''; // Clear current tasks

  // Fetch tasks from the API
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
          // PATCH task to update its completed status
          fetch(`${API_URL}/${task.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: !task.completed })
          })
          .then(response => response.json())
          .then(() => renderTasks()) // Re-render tasks after updating
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


// Function to delete the selected task
function deleteTask() {
  //const taskId = tasks[indexToBeDeleted].id;
  fetch(`${API_URL}/${indexToBeDeleted}`, {
    method: 'DELETE',
  })
  .then(() => {
    renderTasks(); // Re-render tasks after deletion
  })
  .catch(error => console.error('Error deleting task:', error));
}

// Confirm delete action
confirmedBtn.addEventListener("click", () => {
  confirmEl.style.display = "none";
  taskManagerContainer.classList.remove("overlay");
  deleteTask();
});

// Cancel delete action
cancelledBtn.addEventListener("click", () => {
  confirmEl.style.display = "none";
  taskManagerContainer.classList.remove("overlay");
});



// Initial render of tasks when the page loads
renderTasks();
