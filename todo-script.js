document.addEventListener('DOMContentLoaded', () => { //Saara html ho jaega uske baad hi js run karega
    console.log("JS Loaded ✅");
    const taskInput = document.getElementById('task-input'); //user jo task input karega usko store kar raha hai
    const form = document.querySelector('.input-area'); //form element ko select kar raha hai
    const taskList = document.getElementById('task-list'); //task list ko store kar raha hai
    taskList.addEventListener('mouseenter', () => {
        taskList.classList.add('show-scrollbar');
    });
    taskList.addEventListener('mouseleave', () => {
        taskList.classList.remove('show-scrollbar');
    });
    const emptyImage = document.getElementById('empty-image'); //empty image ko store kar raha hai
    const dueDateInput = document.getElementById('due-date'); //due date input field ko store kar raha hai
    const prioritySelect = document.getElementById('priority-select'); //priority select field ko store kar raha hai
    
    const toggleEmptyState = () => {
        const isEmpty = taskList.children.length === 0; //task list ke children ki length check kar raha hai, agar length 0 hai to isEmpty true hoga, warna false
        emptyImage.style.display = isEmpty ? 'block' : 'none'; //agar isEmpty true hai to empty image ko block display karo, warna none display karo
        taskList.style.display = isEmpty ? 'none' : 'block'; //agar isEmpty true hai to task list ko none display karo, warna block display karo
        updateProgress(); //progress bar ko update kar raha hai, taki user ko pata chale ki uske kitne tasks complete hai aur kitne pending hai
    };

    const saveTasks = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked,
            dueDate: li.getAttribute('data-date'),
            priority: li.getAttribute('data-priority')
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }; //ye function tasks ko local storage me save karne ke liye hai, taki user jab page reload kare to uske tasks wapas aa jaye

    const loadTasksFromLocalStorage = () => { //ye function local storage se tasks ko load karne ke liye hai, taki user jab page reload kare to uske tasks wapas aa jaye
        const savedTasks = JSON.parse (localStorage.getItem('tasks')) || []; //Get stored data, Convert string → object, If nothing → use empty array

        savedTasks.forEach(task => {
            addTask(task.text, task.completed, task.dueDate, task.priority);
        });

        toggleEmptyState();
    };

    const updateProgress = () => {
        const total = taskList.querySelectorAll('li').length;
        const completed = taskList.querySelectorAll('li.completed').length;
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
        document.getElementById('progress-text').textContent = total === 0 ? 'No tasks yet': `${completed} of ${total} task${total !== 1 ? 's' : ''} completed`;
        
        const bar = document.getElementById('progress-bar');
        bar.style.width = `${percent}%`;
        if (percent === 100 && total > 0) {
            bar.style.background = 'linear-gradient(to right, #36f643, #b2ff59)'; 
        } else if (percent >= 50) {
            bar.style.background = 'linear-gradient(to right, #ff9900, #ffd448)'; 
        } else {
            bar.style.background = 'linear-gradient(to right, #ff0400, #fe6161)'; 
        }
    };
    
    const triggerConfetti = () => {
        const total = taskList.querySelectorAll('li').length;
        const completed = taskList.querySelectorAll('li.completed').length;
        if (total === 0 || completed !== total) return;
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ffffff']
        });
        setTimeout(() => {
            confetti({
                particleCount: 80,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ffffff']
            });
        }, 200);
        setTimeout(() => {
            confetti({
                particleCount: 80,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ffffff']
            });
        }, 400);
    };

    const addTask = (text, completed = false, dueDate = null, priority = 'null') => { //naya task add karne ke liye function create kar raha hai, jisme text aur completed parameters le raha hai. text parameter me user ke input ko store kar raha hai, aur completed parameter me task complete hai ya nahi, iska status store kar raha hai
        const taskPriority = (priority && priority !== 'null') ? priority : (prioritySelect.value || 'medium'); //agar priority parameter me valid value hai to usko use karo, warna select field se priority le lo, agar select field me bhi koi value nahi hai to default 'medium' use karo
        const taskText =  text || taskInput.value.trim(); //user ke input ko trim kar raha hai, yani extra spaces hata raha hai
        if (!taskText) return; //agar user ne kuch bhi input nahi kiya hai to function se bahar aa jao

        const taskDate = dueDate || dueDateInput.value; //agar due date parameter me diya gaya hai to usko use karo, warna input field se due date le lo

        const li = document.createElement('li'); //naya list item create kar raha hai

        const formatDate = (dateStr) => { //date ko format karne ke liye function create kar raha hai, taki date user friendly format me show ho
            if (!dateStr) return ''; //agar date string nahi hai to empty string return karo
            const date = new Date(dateStr);  //date string ko date object me convert kar raha hai
            return date.toLocaleDateString('en-IN', {  //date ko local date string me convert kar raha hai, jisme day, month aur year show ho
                day: 'numeric', //day ko numeric format me show karo, yani 1, 2, 3, etc.
                month: 'short', //month ko short format me show karo, yani Jan, Feb, Mar, etc.
                year: 'numeric' //year ko numeric format me show karo, yani 2024, 2025, etc.
            }); //ye format date function task ke due date ko user friendly format me show karne ke liye hai, taki user easily samajh sake ki task kab due hai
        }; //ye function task ke due date ko user friendly format me show karne ke liye hai, taki user easily samajh sake ki task kab due hai
    
    const getDateStatus = (dateStr) => { //date status ko determine karne ke liye function create kar raha hai, taki task overdue hai, today hai ya upcoming hai, iska status determine kar sake
        if (!dateStr) return '';

        const today = new Date(); //current date ko get kar raha hai
        const due = new Date(dateStr); //due date string ko date object me convert kar raha hai

        today.setHours(0,0,0,0); //tells the time to be 00:00:00.000, yani date ke time ko reset kar raha hai, taki date comparison sahi se ho sake
        due.setHours(0,0,0,0); //due date ke time ko bhi reset kar raha hai, taki date comparison sahi se ho sake 

        if (due < today) return 'overdue'; //agar due date current date se pehle hai to overdue return karo
        if (due.getTime() === today.getTime()) return 'today'; //agar due date current date ke barabar hai to today return karo
        return 'upcoming'; //agar due date current date ke baad hai to upcoming return karo, yani task future me due hai
    };

    const status = getDateStatus(taskDate); //task date ke status ko get kar raha hai, taki task ke due date ke hisab se uska status determine kar sake, yani task overdue hai, today hai ya upcoming hai

        li.innerHTML = `
        <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
        <span>${taskText}</span>
        ${taskDate ? `<small class="due-date ${status}">📅 ${formatDate(taskDate)}</small>` : ''} 
        <span class="priority-badge ${taskPriority}">${taskPriority}</span>
        <div class="task-buttons">
            <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;

        li.classList.add(`priority-${taskPriority}`);
        if (taskDate) {
            li.setAttribute('data-date', taskDate);
        }
        li.setAttribute('data-priority', taskPriority);

        const checkbox = li.querySelector('.checkbox');

        const taskSpan = li.querySelector('span');
        taskSpan.addEventListener('click', () => {
            taskSpan.classList.toggle('expanded');
        });

        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');

        const updateTaskState = () => {
            const isChecked = checkbox.checked;

            li.classList.toggle('completed', isChecked);

            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? 0.5 : 1;
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
        };

        // Run when checkbox changes
        checkbox.addEventListener('change', () => {
            updateTaskState();
            saveTasks(); // save on checkbox change
            updateProgress();
            triggerConfetti();
        });

        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                li.classList.add('removing');
                li.addEventListener('animationend', () => {
                    taskInput.value = li.querySelector('span').textContent;
                    dueDateInput.value = li.getAttribute('data-date') || '';
                    prioritySelect.value = li.getAttribute('data-priority') || 'medium';
                    li.remove();
                    toggleEmptyState();
                    saveTasks();
                    taskInput.focus();
                }, { once: true });
            }
        });

        deleteBtn.addEventListener('click', () => {
            li.classList.add('removing');
            li.addEventListener('animationend', () => {  
                li.remove();
                toggleEmptyState();
                saveTasks();
                updateProgress();
            }, { once: true });                     
        });

        taskList.appendChild(li); //task list me naya list item add kar raha hai
        taskInput.value = ''; //input field ko clear kar raha hai
        dueDateInput.value = ''; //due date input field ko bhi clear kar raha hai
        taskInput.focus(); //input field pe focus kar raha hai, taki user turant naya task add kar sake
        
        updateTaskState(); // ensure correct initial state
        toggleEmptyState(); //we are calling this func. after adding a task isiliye yahan addTask func. mein likha hai. Empty state ko toggle kar raha hai, yani agar task list me abhi bhi koi task nahi hai to empty image show karo, warna hide karo
        saveTasks(); //save task to local storage whenever a new task is added
    };

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    }); //jab user input field me enter key press karega, to wo naya task add kar dega, taki user easily task add kar sake
    
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // stop page reload
        addTask(); // call function properly
    });
    loadTasksFromLocalStorage(); //load tasks from local storage when the page loads
});