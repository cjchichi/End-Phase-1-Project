
const API_URL = 'https://my-app-backend-dfhv.onrender.com/api/tasks'; 


const taskManagerContainer = document.querySelector(".taskManager");
const confirmEl = document.querySelector(".confirm");
const confirmedBtn = confirmEl.querySelector(".confirmed");
const cancelledBtn = confirmEl.querySelector(".cancel");
let indexToBeDeleted = null;


document.getElementById('taskForm').addEventListener('submit', handleFormSubmit);


function handleFormSubmit(event) {
  event.preventDefault();
  console.log('Form Submitted')
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();
  const dueDate = document.getElementById('due-date').value;
  const category = document.getElementById('category').value;
  const priority = document.getElementById('priority').value;

  if (taskText !== '') {
    const newTask = {
      text: taskText,
      completed: false,
      dueDate: dueDate,
      category: category,
      priority: priority,
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
      tasks.push(task); 
      renderTasks(); 
    })
    .catch(error => console.error('Error adding task:', error));

    taskInput.value = '';
  } else {
    console.log("Task Text is empty");
  }
}


fetchTasks();


function fetchTasks() {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      tasks = data; 
      renderTasks(); 
    })
    .catch(error => console.error('Error fetching tasks:', error));
}


function renderTasks() {
  const taskContainer = document.getElementById('taskContainer');
  taskContainer.innerHTML = '';

  tasks.forEach((task, index) => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('taskCard');
    let classVal = "pending";
    let textVal = "Pending";
    if (task.completed) {
      classVal = "completed";
      textVal = "Completed";
    }
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
      .then(updatedTask => {
        tasks[index] = updatedTask; 
        renderTasks(); 
      })
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
}

// Function to delete the selected task
function deleteTask(index) {
  const taskId = tasks[index].id;
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


