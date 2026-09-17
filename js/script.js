// =====================================
// GET HTML ELEMENTS
// =====================================

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");

const filterButtons = document.querySelectorAll(".filter");


// =====================================
// GET SAVED TASKS
// =====================================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// =====================================
// DISPLAY TASKS
// =====================================

displayTasks();


// =====================================
// ADD TASK
// =====================================

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskName = taskInput.value.trim();

    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        name: taskName,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";

    displayTasks();
});


// =====================================
// DISPLAY TASKS
// =====================================

function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;


    // ALL
    if (currentFilter === "all") {

        filteredTasks = tasks;

    }


    // ACTIVE
    if (currentFilter === "active") {

        filteredTasks = tasks.filter(function(task) {

            return task.completed === false;

        });

    }


    // COMPLETED
    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(function(task) {

            return task.completed === true;

        });

    }


    // EMPTY MESSAGE

    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    // CREATE TASK ELEMENTS

    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        li.classList.add("task");


        // Add completed class

        if (task.completed === true) {

            li.classList.add("completed");

        }


        // Task HTML

        li.innerHTML = `

            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <span class="task-text">
                ${escapeHTML(task.name)}
            </span>

            <button class="edit-btn">
                Edit
            </button>

            <button class="delete-btn">
                Delete
            </button>

        `;


        // =================================
        // CHECKBOX
        // =================================

        const checkbox =
            li.querySelector(".task-checkbox");


        checkbox.addEventListener("change", function() {

            task.completed = checkbox.checked;

            saveTasks();

            displayTasks();

        });


        // =================================
        // EDIT BUTTON
        // =================================

        const editButton =
            li.querySelector(".edit-btn");


        editButton.addEventListener("click", function() {

            const newName = prompt(
                "Edit your task:",
                task.name
            );


            if (
                newName !== null &&
                newName.trim() !== ""
            ) {

                task.name = newName.trim();

                saveTasks();

                displayTasks();

            }

        });


        // =================================
        // DELETE BUTTON
        // =================================

        const deleteButton =
            li.querySelector(".delete-btn");


        deleteButton.addEventListener("click", function() {

            tasks = tasks.filter(function(item) {

                return item.id !== task.id;

            });


            saveTasks();

            displayTasks();

        });


        // Add task to list

        taskList.appendChild(li);

    });


    // Update numbers

    updateStatistics();

}


// =====================================
// UPDATE STATISTICS
// =====================================

function updateStatistics() {

    // Total tasks

    const total = tasks.length;


    // Active tasks

    const active = tasks.filter(function(task) {

        return task.completed === false;

    }).length;


    // Completed tasks

    const completed = tasks.filter(function(task) {

        return task.completed === true;

    }).length;


    // Display values

    totalTasks.textContent = total;

    activeTasks.textContent = active;

    completedTasks.textContent = completed;


    // Remaining text

    taskCount.textContent =
        active +
        (active === 1
            ? " task remaining"
            : " tasks remaining");

}


// =====================================
// FILTER BUTTONS
// =====================================

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Remove active from all buttons

        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        // Add active to clicked button

        button.classList.add("active");


        // Change filter

        currentFilter = button.dataset.filter;


        // Display filtered tasks

        displayTasks();

    });

});


// =====================================
// CLEAR COMPLETED
// =====================================

clearCompleted.addEventListener("click", function() {

    tasks = tasks.filter(function(task) {

        return task.completed === false;

    });


    saveTasks();

    displayTasks();

});


// =====================================
// LOCAL STORAGE
// =====================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// =====================================
// SECURITY FUNCTION
// =====================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}