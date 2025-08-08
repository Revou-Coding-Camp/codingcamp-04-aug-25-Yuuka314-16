 const form = document.getElementById('todo-form');
        const todoInput = document.getElementById('todo-input');
        const dateInput = document.getElementById('date-input');
        const hourInput = document.getElementById('hour-input');
        const todoList = document.getElementById('todo-list');
        const deleteAllBtn = document.getElementById('delete-all');
        const filterBtn = document.getElementById('filter-btn');
        const filterPopupBg = document.getElementById('filter-popup-bg');
        const popupFilterInput = document.getElementById('popup-filter-input');
        const popupFilterDate = document.getElementById('popup-filter-date');
        const popupFilterHour = document.getElementById('popup-filter-hour');
        const popupApply = document.getElementById('popup-apply');
        const popupClear = document.getElementById('popup-clear');
        const popupClose = document.getElementById('popup-close');
        const mainContainer = document.getElementById('main-container');
        const confirmBg = document.getElementById('confirm-bg');
        const confirmYes = document.getElementById('confirm-yes');
        const confirmNo = document.getElementById('confirm-no');
        const confirmText = document.getElementById('confirm-text');

        let todos = [];
        let filterText = '';
        let filterDate = '';
        let filterHour = '';
        let deleteIdx = null; // for single delete
        let deleteAll = false; // for delete all

        function renderTodos() {
            todoList.innerHTML = '';
            let filtered = todos.filter(todo => {
                const textMatch = filterText === '' || todo.text.toLowerCase().includes(filterText.toLowerCase());
                const dateMatch = filterDate === '' || todo.date === filterDate;
                const hourMatch = filterHour === '' || todo.hour === filterHour;
                return textMatch && dateMatch && hourMatch;
            });
            filtered.forEach((todo, idx) => {
                const item = document.createElement('div');
                item.className = 'todo-item';
                if (todo.editing) {
                    item.innerHTML = `
                        <input type="text" class="edit-input" value="${todo.text}">
                        <input type="date" class="edit-date" value="${todo.date}">
                        <input type="time" class="edit-hour" value="${todo.hour}">
                        <button class="blue-btn save-btn">Save</button>
                        <button class="red-btn cancel-btn">Cancel</button>
                    `;
                    item.querySelector('.save-btn').onclick = () => {
                        const newText = item.querySelector('.edit-input').value;
                        const newDate = item.querySelector('.edit-date').value;
                        const newHour = item.querySelector('.edit-hour').value;
                        todos[idx].text = newText;
                        todos[idx].date = newDate;
                        todos[idx].hour = newHour;
                        todos[idx].editing = false;
                        renderTodos();
                    };
                    item.querySelector('.cancel-btn').onclick = () => {
                        todos[idx].editing = false;
                        renderTodos();
                    };
                } else {
                    item.innerHTML = `
                        <span class="todo-text">${todo.text} (${todo.date} ${todo.hour})</span>
                        <span class="todo-status">Status: ${todo.done ? 'Done' : 'Not Done'}</span>
                        <span class="todo-action">Action: ${todo.action ? 'In Action' : 'Not Yet'}</span>
                        <button class="status-btn ${todo.done ? 'done' : ''} toggle-done-btn">${todo.done ? 'Mark Undone' : 'Mark Done'}</button>
                        <button class="status-btn action toggle-action-btn">${todo.action ? 'Set Not Yet' : 'Set In Action'}</button>
                        <button class="blue-btn edit-btn">Edit</button>
                        <button class="red-btn delete-btn">Delete To Do</button>
                    `;
                    item.querySelector('.toggle-done-btn').onclick = () => {
                        todos[idx].done = !todos[idx].done;
                        renderTodos();
                    };
                    item.querySelector('.toggle-action-btn').onclick = () => {
                        todos[idx].action = !todos[idx].action;
                        renderTodos();
                    };
                    item.querySelector('.edit-btn').onclick = () => {
                        todos[idx].editing = true;
                        renderTodos();
                    };
                    item.querySelector('.delete-btn').onclick = () => {
                        deleteIdx = idx;
                        deleteAll = false;
                        confirmText.textContent = "Are you sure you want to delete this to-do?";
                        confirmBg.style.display = 'flex';
                    };
                }
                todoList.appendChild(item);
            });

            // Move container to top if there are todos
            if (todos.length > 0) {
                mainContainer.classList.add('top');
            } else {
                mainContainer.classList.remove('top');
            }
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const text = todoInput.value;
            const date = dateInput.value;
            const hour = hourInput.value;
            if (text && date && hour) {
                todos.push({ text, date, hour, done: false, action: false, editing: false });
                renderTodos();
                todoInput.value = '';
                dateInput.value = '';
                hourInput.value = '';
            }
        });

        deleteAllBtn.onclick = function() {
            deleteAll = true;
            confirmText.textContent = "Are you sure you want to delete all to-dos?";
            confirmBg.style.display = 'flex';
        };

        // Confirm delete logic
        confirmYes.onclick = function() {
            if (deleteAll) {
                todos = [];
            } else if (deleteIdx !== null) {
                todos.splice(deleteIdx, 1);
            }
            confirmBg.style.display = 'none';
            deleteIdx = null;
            deleteAll = false;
            renderTodos();
        };
        confirmNo.onclick = function() {
            confirmBg.style.display = 'none';
            deleteIdx = null;
            deleteAll = false;
        };

        // Filter popup logic
        filterBtn.onclick = function() {
            popupFilterInput.value = filterText;
            popupFilterDate.value = filterDate;
            popupFilterHour.value = filterHour;
            filterPopupBg.style.display = 'flex';
            popupFilterInput.focus();
        };
        popupClose.onclick = function() {
            filterPopupBg.style.display = 'none';
        };
        popupApply.onclick = function() {
            filterText = popupFilterInput.value;
            filterDate = popupFilterDate.value;
            filterHour = popupFilterHour.value;
            filterPopupBg.style.display = 'none';
            renderTodos();
        };
        popupClear.onclick = function() {
            popupFilterInput.value = '';
            popupFilterDate.value = '';
            popupFilterHour.value = '';
            filterText = '';
            filterDate = '';
            filterHour = '';
            filterPopupBg.style.display = 'none';
            renderTodos();
        };

        // Close popups on background click
        filterPopupBg.onclick = function(e) {
            if (e.target === filterPopupBg) filterPopupBg.style.display = 'none';
        };
        confirmBg.onclick = function(e) {
            if (e.target === confirmBg) confirmBg.style.display = 'none';
        };

        // Initial render
        renderTodos();