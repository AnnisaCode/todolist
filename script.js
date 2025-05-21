let tasks = [];
let taskBeingEdited = null;

// Load tasks from localStorage when page loads
document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
    // Set today as default date for date input
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("task-date").value = today;
});

// Function to sanitize input (prevent XSS)
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Function to validate input
function validateInput(text, date) {
    if (!text || text.trim() === '') {
        showNotification('Task description cannot be empty!', 'error');
        return false;
    }

    if (!date) {
        showNotification('Date cannot be empty!', 'error');
        return false;
    }

    return true;
}

// Function to display notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.querySelector('.container').appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('fadeOut');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Function to add new task
function addTask() {
    const taskInput = document.getElementById("new-task");
    const taskDate = document.getElementById("task-date");
    const taskPriority = document.getElementById("task-priority");

    const taskText = taskInput.value.trim();
    const taskDateValue = taskDate.value;
    const taskPriorityValue = taskPriority.value;

    // Validate input
    if (!validateInput(taskText, taskDateValue)) {
        return;
    }

    // Sanitize input to prevent XSS
    const sanitizedText = sanitizeInput(taskText);

    try {
        // Make sure ID is a number
        const taskId = Date.now();
        console.log('Creating new task with ID:', taskId);

        const task = {
            text: sanitizedText,
            date: taskDateValue,
            priority: taskPriorityValue,
            id: taskId,
            createdAt: new Date().toISOString()
        };

        tasks.push(task);
        saveTasks();
        renderTasks();

        // Reset input fields
        taskInput.value = "";

        // Show success notification
        showNotification('Task added successfully!', 'success');
    } catch (error) {
        console.error('Error adding task:', error);
        showNotification('An error occurred while adding the task', 'error');
    }
}

// Function to save tasks to localStorage
function saveTasks() {
    try {
        const tasksJSON = JSON.stringify(tasks);
        console.log('Saving tasks to localStorage:', tasksJSON);
        localStorage.setItem('tasks', tasksJSON);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showNotification('Unable to save tasks', 'error');
    }
}

// Function to load tasks from localStorage
function loadTasks() {
    try {
        const savedTasks = localStorage.getItem('tasks');
        console.log('Loading tasks from localStorage:', savedTasks);

        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            console.log('Parsed tasks:', tasks);
            renderTasks();
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        showNotification('Unable to load saved tasks', 'error');
        tasks = [];
    }
}

// Function to display tasks
function renderTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.innerHTML = '<i class="fas fa-tasks"></i><p>No tasks yet. Add a new task!</p>';
        taskList.appendChild(emptyMessage);
        return;
    }

    console.log('Rendering tasks:', tasks);

    tasks.forEach((task) => {
        const newTask = document.createElement("li");
        newTask.dataset.id = String(task.id);
        newTask.dataset.priority = task.priority;

        const taskContent = document.createElement("div");
        taskContent.classList.add("task-content");

        const taskDetails = document.createElement("div");
        taskDetails.classList.add("task-details");

        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        taskDetails.appendChild(taskText);

        const taskPriority = document.createElement("span");
        const capitalizedPriority =
            task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
        taskPriority.textContent = `Priority: ${capitalizedPriority}`;
        taskDetails.appendChild(taskPriority);

        const taskDate = document.createElement("span");
        taskDate.textContent = `Date: ${formatDate(task.date)}`;
        taskDetails.appendChild(taskDate);

        taskContent.appendChild(taskDetails);

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container";

        const updateButton = document.createElement("button");
        updateButton.classList.add("update");
        updateButton.setAttribute('aria-label', 'Edit Task');
        updateButton.innerHTML = '<i class="fas fa-edit"></i>';
        updateButton.onclick = function (e) {
            e.stopPropagation();
            openEditModal(task.id);
        };

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.setAttribute('aria-label', 'Delete Task');
        deleteButton.classList.add("delete");
        deleteButton.onclick = function (e) {
            e.stopPropagation();
            confirmDeleteTask(task.id);
        };

        buttonContainer.appendChild(updateButton);
        buttonContainer.appendChild(deleteButton);
        taskContent.appendChild(buttonContainer);
        newTask.appendChild(taskContent);
        taskList.appendChild(newTask);

        // Add event listener for toggle complete on click
        taskContent.addEventListener('click', function (e) {
            if (e.target === taskContent || e.target === taskDetails || taskDetails.contains(e.target)) {
                toggleTaskComplete(newTask, task);
            }
        });

        // Mark as completed if task is completed
        if (task.completed) {
            markTaskAsCompleted(newTask);
        }
    });
}

// Format date to a more user-friendly format
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// Toggle completion status for task
function toggleTaskComplete(taskElement, task) {
    const taskId = Number(taskElement.dataset.id);
    console.log('Toggling complete for task ID:', taskId);

    // Make sure we're working with the current version of the task
    const currentTask = tasks.find(t => Number(t.id) === taskId);

    if (!currentTask) {
        console.error('Task not found for toggling completion:', taskId);
        return;
    }

    currentTask.completed = !currentTask.completed;

    if (currentTask.completed) {
        markTaskAsCompleted(taskElement);
        showNotification('Task completed!', 'success');
    } else {
        markTaskAsActive(taskElement);
    }

    saveTasks();
}

// Mark task as completed
function markTaskAsCompleted(taskElement) {
    taskElement.classList.add('completed');
    const taskContent = taskElement.querySelector('.task-content');
    taskContent.style.opacity = '0.7';
    taskContent.style.textDecoration = 'line-through';
}

// Mark task as active
function markTaskAsActive(taskElement) {
    taskElement.classList.remove('completed');
    const taskContent = taskElement.querySelector('.task-content');
    taskContent.style.opacity = '1';
    taskContent.style.textDecoration = 'none';
}

// Confirm task deletion
function confirmDeleteTask(id) {
    const confirmDelete = confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
        deleteTask(id);
    }
}

// Delete task
function deleteTask(id) {
    try {
        // Convert id to number to ensure correct comparison if it's stored as string
        const numId = Number(id);
        tasks = tasks.filter((task) => Number(task.id) !== numId);

        console.log('Deleting task with ID:', numId);
        console.log('Tasks after deletion:', tasks);

        saveTasks();
        renderTasks();
        showNotification('Task has been deleted', 'info');
    } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('An error occurred while deleting the task', 'error');
    }
}

// Open edit modal
function openEditModal(id) {
    taskBeingEdited = Number(id);
    console.log('Opening edit modal for task ID:', taskBeingEdited);

    const task = tasks.find((task) => Number(task.id) === taskBeingEdited);

    if (!task) {
        console.error('Task not found with ID:', taskBeingEdited);
        showNotification('Task not found', 'error');
        return;
    }

    document.getElementById("edit-task-text").value = task.text;
    document.getElementById("edit-task-date").value = task.date;
    document.getElementById("edit-task-priority").value = task.priority;

    document.getElementById("editModal").style.display = "block";
}

// Close edit modal
function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

// Save task changes
function saveTaskChanges() {
    const updatedText = document.getElementById("edit-task-text").value.trim();
    const updatedDate = document.getElementById("edit-task-date").value;
    const updatedPriority = document.getElementById("edit-task-priority").value;

    // Validate input
    if (!validateInput(updatedText, updatedDate)) {
        return;
    }

    try {
        // Sanitize input
        const sanitizedText = sanitizeInput(updatedText);
        console.log('Saving changes for task ID:', taskBeingEdited);

        const task = tasks.find((task) => Number(task.id) === taskBeingEdited);

        if (!task) {
            console.error('Task not found with ID:', taskBeingEdited);
            showNotification('Task not found', 'error');
            closeEditModal();
            return;
        }

        task.text = sanitizedText;
        task.date = updatedDate;
        task.priority = updatedPriority;
        task.updatedAt = new Date().toISOString();

        saveTasks();
        renderTasks();
        closeEditModal();

        showNotification('Task updated successfully', 'success');
    } catch (error) {
        console.error('Error updating task:', error);
        showNotification('An error occurred while updating the task', 'error');
    }
}

// Sort tasks by priority and date
function sortTasks() {
    try {
        tasks.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            // First sort by priority
            const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];

            // If priority is the same, sort by date
            if (priorityDiff === 0) {
                return new Date(a.date) - new Date(b.date);
            }

            return priorityDiff;
        });

        renderTasks();
        showNotification('Tasks have been sorted', 'info');
    } catch (error) {
        console.error('Error sorting tasks:', error);
        showNotification('An error occurred while sorting tasks', 'error');
    }
}

// Close modal if user clicks outside
window.onclick = function (event) {
    const modal = document.getElementById("editModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

// Filter tasks by priority
function filterByPriority(priority) {
    // Update active button
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Active current filter button
    const currentButton = document.querySelector(`.filter-btn[onclick="filterByPriority('${priority}')"]`);
    if (currentButton) {
        currentButton.classList.add('active');
    }

    renderFilteredTasks(priority);
}

// Display filtered tasks
function renderFilteredTasks(priority) {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (priority && priority !== 'all') {
        filteredTasks = tasks.filter(task => task.priority === priority);
    }

    console.log('Filtered tasks:', filteredTasks);

    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.innerHTML = '<i class="fas fa-filter"></i><p>No tasks match the filter</p>';
        taskList.appendChild(emptyMessage);
        return;
    }

    filteredTasks.forEach((task) => {
        // Code to display filtered tasks (same as in renderTasks())
        const newTask = document.createElement("li");
        newTask.dataset.id = String(task.id);
        newTask.dataset.priority = task.priority;

        const taskContent = document.createElement("div");
        taskContent.classList.add("task-content");

        const taskDetails = document.createElement("div");
        taskDetails.classList.add("task-details");

        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        taskDetails.appendChild(taskText);

        const taskPriority = document.createElement("span");
        const capitalizedPriority =
            task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
        taskPriority.textContent = `Priority: ${capitalizedPriority}`;
        taskDetails.appendChild(taskPriority);

        const taskDate = document.createElement("span");
        taskDate.textContent = `Date: ${formatDate(task.date)}`;
        taskDetails.appendChild(taskDate);

        taskContent.appendChild(taskDetails);

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container";

        const updateButton = document.createElement("button");
        updateButton.classList.add("update");
        updateButton.setAttribute('aria-label', 'Edit Task');
        updateButton.innerHTML = '<i class="fas fa-edit"></i>';
        updateButton.onclick = function (e) {
            e.stopPropagation();
            openEditModal(task.id);
        };

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.setAttribute('aria-label', 'Delete Task');
        deleteButton.classList.add("delete");
        deleteButton.onclick = function (e) {
            e.stopPropagation();
            confirmDeleteTask(task.id);
        };

        buttonContainer.appendChild(updateButton);
        buttonContainer.appendChild(deleteButton);
        taskContent.appendChild(buttonContainer);
        newTask.appendChild(taskContent);
        taskList.appendChild(newTask);

        // Add event listener for toggle complete on click
        taskContent.addEventListener('click', function (e) {
            if (e.target === taskContent || e.target === taskDetails || taskDetails.contains(e.target)) {
                toggleTaskComplete(newTask, task);
            }
        });

        // Mark as completed if task is completed
        if (task.completed) {
            markTaskAsCompleted(newTask);
        }
    });
}

// Clear all tasks
function clearAllTasks() {
    if (tasks.length === 0) {
        showNotification('No tasks to clear', 'info');
        return;
    }

    const confirmClear = confirm('Are you sure you want to delete ALL tasks?');
    if (confirmClear) {
        console.log('Clearing all tasks');
        tasks = [];
        saveTasks();
        renderTasks();
        showNotification('All tasks have been cleared', 'info');
    }
}
