let tasks = [];
let taskBeingEdited = null;

// things
function addTask() {
    const taskInput = document.getElementById("new-task");
    const taskDate = document.getElementById("task-date");
    const taskPriority = document.getElementById("task-priority");
    const taskText = taskInput.value.trim();
    const taskDateValue = taskDate.value;
    const taskPriorityValue = taskPriority.value;

    if (taskText !== "" && taskDateValue !== "") {
        const task = {
            text: taskText,
            date: taskDateValue,
            priority: taskPriorityValue,
            id: Date.now(),
        };

        tasks.push(task);
        renderTasks();
        taskInput.value = "";
        taskDate.value = "";
    } else {
        alert("Deskripsi tugas dan tanggal tidak boleh kosong!");
    }
}

function renderTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    tasks.forEach((task) => {
        const newTask = document.createElement("li");
        newTask.dataset.id = task.id;

        const taskContent = document.createElement("div");
        taskContent.classList.add("task-content");

        const taskDetails = document.createElement("div");
        taskDetails.classList.add("task-details");

        const taskText = document.createElement("span");
        taskText.textContent = `Tugas: ${task.text}`;
        taskDetails.appendChild(taskText);

        const taskPriority = document.createElement("span");
        const capitalizedPriority =
            task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
        taskPriority.textContent = `Prioritas: ${capitalizedPriority}`;
        taskDetails.appendChild(taskPriority);

        const taskDate = document.createElement("span");
        taskDate.textContent = `Tanggal: ${task.date}`;
        taskDetails.appendChild(taskDate);

        taskContent.appendChild(taskDetails);

        const updateButton = document.createElement("button");
        updateButton.classList.add("update");
        updateButton.innerHTML = '<i class="fas fa-edit"></i>';
        updateButton.onclick = function () {
            openEditModal(task.id);
        };

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.classList.add("delete");
        deleteButton.onclick = function () {
            deleteTask(task.id);
        };

        taskContent.appendChild(updateButton);
        taskContent.appendChild(deleteButton);
        newTask.appendChild(taskContent);
        taskList.appendChild(newTask);
    });
}

function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    renderTasks();
}

function openEditModal(id) {
    taskBeingEdited = id;
    const task = tasks.find((task) => task.id === id);
    document.getElementById("edit-task-text").value = task.text;
    document.getElementById("edit-task-date").value = task.date;
    document.getElementById("edit-task-priority").value = task.priority;

    document.getElementById("editModal").style.display = "block";
}

function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

function saveTaskChanges() {
    const updatedText = document.getElementById("edit-task-text").value.trim();
    const updatedDate = document.getElementById("edit-task-date").value;
    const updatedPriority = document.getElementById("edit-task-priority").value;

    if (updatedText && updatedDate && updatedPriority) {
        const task = tasks.find((task) => task.id === taskBeingEdited);
        task.text = updatedText;
        task.date = updatedDate;
        task.priority = updatedPriority;
        renderTasks();
        closeEditModal();
    } else {
        alert("Deskripsi tugas, tanggal, dan prioritas tidak boleh kosong!");
    }
}

function sortTasks() {
    tasks.sort((a, b) => {
        const priorityOrder = { tinggi: 3, sedang: 2, rendah: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    renderTasks();
}

window.onclick = function (event) {
    const modal = document.getElementById("editModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
