'use strict';

// 1. STATE INITIALIZATION
// Using a versioned key to avoid conflicts with previous string-only data
const STORAGE_KEY = 'toolsuite_kanban_v2';
const lists = ['todo', 'progress', 'done'];

let boardData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    todo: [],
    progress: [],
    done: []
};

// 2. INITIAL RENDER & DRAG-DROP SETUP
lists.forEach(listId => {
    const el = document.getElementById(listId);
    
    // Render existing data
    boardData[listId].forEach(item => {
        el.appendChild(createCard(item.text, item.label));
    });

    // Initialize SortableJS
    new Sortable(el, {
        group: 'kanban_group',
        animation: 150,
        ghostClass: 'ghost-card',
        onEnd: saveBoardState // Save on every reorder or move
    });
});

// 3. CORE UI LOGIC
function createCard(text, label) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.innerHTML = `
        <div class="label label-${label}">${label}</div>
        <div class="task-text">${text}</div>
        <span class="delete-btn" onclick="deleteTask(this)">×</span>
    `;
    return card;
}

window.addNewTask = function(listId) {
    const labelSelect = document.getElementById(`${listId}-label`);
    const label = labelSelect.value;
    const taskText = prompt("Enter task description:");

    if (taskText && taskText.trim() !== "") {
        const container = document.getElementById(listId);
        container.appendChild(createCard(taskText, label));
        saveBoardState();
        
        // Reset label selector
        labelSelect.value = 'none';
    }
};

window.deleteTask = function(btn) {
    if (confirm("Delete this task permanently?")) {
        btn.parentElement.remove();
        saveBoardState();
    }
};

// 4. PERSISTENCE LOGIC
function saveBoardState() {
    const newState = {};
    
    lists.forEach(listId => {
        const listEl = document.getElementById(listId);
        const cards = Array.from(listEl.querySelectorAll('.task-card'));
        
        newState[listId] = cards.map(card => {
            return {
                text: card.querySelector('.task-text').innerText,
                label: card.querySelector('.label').innerText.toLowerCase()
            };
        });
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
}