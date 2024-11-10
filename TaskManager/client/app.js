document.addEventListener('DOMContentLoaded', () => {
    setCurrentDateTime();
    loadTasks();
    setInterval(checkAlarms, 60000); // Check alarms every minute
});

const setCurrentDateTime = () => {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 10); // yyyy-mm-dd
    const hours = now.getHours() > 12 ? now.getHours() - 12 : now.getHours();
    const minutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes}`;
    
    document.getElementById('task-date').value = formattedDate;
    document.getElementById('task-time').value = formattedTime;
    document.getElementById('task-ampm').value = ampm;
};

const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    displayTasks(tasks);
};

const displayTasks = (tasks) => {
    const taskList = document.getElementById('task-list');
    if (tasks.length === 0) {
        taskList.innerHTML = `<p class="message">There are no tasks</p>`;
    } else {
        taskList.innerHTML = tasks.map(task => `
            <div class="task ${task.completed ? 'completed' : ''}" id="${task.id}">
                <div class="tasks-lst">
                    <span><strong>Title:</strong> ${task.title}</span>
                    <span><strong>Description:</strong> ${task.description}</span>
                    <span class="due-date"><strong>Due:</strong> ${formatDate(task.dueDate)}</span>
                    <span class="due-time"><strong>at:</strong> ${task.dueTime}</span>
                    <span><strong>Alarm:</strong> ${task.alarm ? 'On' : 'Off'}</span>
                </div>
                <div>
                    <button onclick="toggleTask('${task.id}')">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button onclick="deleteTask('${task.id}')">Delete</button>
                    <button onclick="toggleAlarm('${task.id}')">Toggle Alarm</button>
                </div>
            </div>
        `).join('');
    }
};

const saveTasks = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const addTask = () => {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-desc').value;
    const dueDate = document.getElementById('task-date').value;
    let dueTime = document.getElementById('task-time').value;
    const ampm = document.getElementById('task-ampm').value;
    const alarm = document.getElementById('task-alarm').checked;
    if (!title || !description || !dueDate || !dueTime || !ampm) {
        alert("Please fill in all fields.");
        return;
    }
    dueTime = `${dueTime} ${ampm}`;
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const newTask = { 
        id: Date.now().toString(), 
        title, 
        description, 
        completed: false, 
        time: new Date().toLocaleString(), 
        dueDate: formatDate(dueDate),
        dueTime: dueTime,
        alarm: alarm
    };
    tasks.push(newTask);
    saveTasks(tasks);
    loadTasks();
    document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    setCurrentDateTime();
};

const toggleTask = (id) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.id === id);
    task.completed = !task.completed;
    saveTasks(tasks);
    loadTasks();
};

const deleteTask = (id) => {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== id);
    saveTasks(tasks);
    loadTasks();
};

const toggleAlarm = (id) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.id === id);
    task.alarm = !task.alarm;
    saveTasks(tasks);
    loadTasks();
};

const searchTaskByDate = () => {
    const searchDate = document.getElementById('search-date').value;
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const filteredTasks = tasks.filter(task => task.dueDate === formatDate(searchDate));
    displayTasks(filteredTasks);
};

const checkAlarms = () => {
    console.log("Checking alarms...");
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const now = new Date();
    tasks.forEach(task => {
        const taskDateTime = new Date(task.dueDate); // ISO format should be correctly parsed
        console.log(`Task: ${task.title}, Alarm: ${task.alarm}, Task DateTime: ${taskDateTime}, Current DateTime: ${now}`);
        if (task.alarm && !task.completed && taskDateTime <= now) {
            alert(`Task "${task.title}" is starting now!`);
            task.alarm = false; // Reset alarm after notification
        }
    });
    saveTasks(tasks);
};


const formatTimeInput = (input) => {
    const value = input.value.replace(/[^0-9]/g, '');
    if (value.length >= 4) {
        input.value = value.substr(0, 2) + ':' + value.substr(2, 2);
    }
};

const formatTime = (dueTime) => {
    const [hours, minutes] = dueTime.split(':');
    let hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
};

const formatDate = (dueDate) => {
    const [year, month, day] = dueDate.split('-');
    return `${day}-${month}-${year.slice(-2)}`;
};
