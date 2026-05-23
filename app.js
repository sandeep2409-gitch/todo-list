/**
 * TaskFlow Application Logic
 * Premium, Lightweight, zero-dependency task management controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Application State & Selectors
  // ==========================================================================
  let tasks = [];
  let currentFilter = 'all';

  // DOM Elements
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const emptyState = document.getElementById('empty-state');
  
  // Date & Time Widgets
  const timeDisplay = document.getElementById('current-time');
  const dateDisplay = document.getElementById('current-date');
  
  // Stats Counters
  const percentageDisplay = document.getElementById('completion-percentage');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const totalCountDisplay = document.getElementById('total-count');
  const pendingCountDisplay = document.getElementById('pending-count');
  const completedCountDisplay = document.getElementById('completed-count');
  
  // Filters & Actions
  const filterButtons = document.querySelectorAll('.btn-filter');
  const btnClearCompleted = document.getElementById('btn-clear-completed');
  
  // Quote Elements
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');

  // SVG Icons library
  const icons = {
    edit: `<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
    delete: `<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
    save: `<svg viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>`,
    calendar: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`
  };

  // Productivity Quotes List
  const quotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "Your mind is for having ideas, not holding them.", author: "David Allen" },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
    { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
    { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
    { text: "One day or day one. You decide.", author: "Unknown" },
    { text: "Make each day your masterpiece.", author: "John Wooden" }
  ];

  // ==========================================================================
  // 2. Core Initializations
  // ==========================================================================
  
  // Set random quote
  function setRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteText.textContent = `"${quote.text}"`;
    quoteAuthor.textContent = quote.author;
  }

  // Update DateTime values
  function updateDateTime() {
    const now = new Date();
    
    // Sleek Local Clock format
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const displayHours = String(hours).padStart(2, '0');
    
    timeDisplay.textContent = `${displayHours}:${minutes}:${seconds} ${ampm}`;
    
    // Sleek Calendar format
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString('en-US', options);
  }

  // Local Storage Integration
  function loadTasks() {
    try {
      const stored = localStorage.getItem('taskflow_tasks');
      tasks = stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Could not load tasks from LocalStorage', e);
      tasks = [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Could not save tasks to LocalStorage', e);
    }
  }

  // ==========================================================================
  // 3. UI Sync & Counters
  // ==========================================================================
  
  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Update numerical targets
    totalCountDisplay.textContent = total;
    pendingCountDisplay.textContent = pending;
    completedCountDisplay.textContent = completed;
    
    // Progress fill & percentage
    percentageDisplay.textContent = `${percent}%`;
    progressBarFill.style.width = `${percent}%`;
    progressBarFill.setAttribute('aria-valuenow', percent);
    
    // Clear completed action state
    btnClearCompleted.disabled = completed === 0;
  }

  // Format created date badge in task card
  function formatDate(isoString) {
    const date = new Date(isoString);
    const hours = String(date.getHours() % 12 || 12).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes} ${ampm}`;
  }

  // ==========================================================================
  // 4. Rendering Tasks Checklist
  // ==========================================================================
  
  function renderTasks() {
    // Clear existing view
    todoList.innerHTML = '';
    
    // Filter tasks based on current filter state
    const filteredTasks = tasks.filter(task => {
      if (currentFilter === 'pending') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true; // 'all'
    });
    
    // Toggle Empty State display
    if (filteredTasks.length === 0) {
      emptyState.classList.remove('hidden');
      todoList.classList.add('hidden');
    } else {
      emptyState.classList.add('hidden');
      todoList.classList.remove('hidden');
    }
    
    // Dynamically build and inject task card list elements
    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'todo-item';
      li.id = `task-card-${task.id}`;
      li.setAttribute('role', 'listitem');
      
      li.innerHTML = `
        <div class="todo-content">
          <label for="check-${task.id}" class="checkbox-hidden-label">
            <input 
              type="checkbox" 
              id="check-${task.id}" 
              class="checkbox-hidden" 
              ${task.completed ? 'checked' : ''}
              data-id="${task.id}"
            >
            <div class="checkbox-custom" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </label>
          <div class="todo-label-wrapper">
            <span class="todo-text" id="label-${task.id}">${escapeHTML(task.text)}</span>
            <span class="todo-date" aria-label="Created at">
              ${icons.calendar} ${formatDate(task.createdAt)}
            </span>
          </div>
        </div>
        <div class="todo-actions">
          <button class="btn-icon btn-icon-edit" data-id="${task.id}" aria-label="Edit task description">
            ${icons.edit}
          </button>
          <button class="btn-icon btn-icon-delete" data-id="${task.id}" aria-label="Delete task">
            ${icons.delete}
          </button>
        </div>
      `;
      
      // Bind inline events inside list element for micro interactions
      
      // Checkbox complete toggle
      const checkbox = li.querySelector('.checkbox-hidden');
      checkbox.addEventListener('change', () => toggleTaskComplete(task.id));
      
      // Edit button handler
      const editBtn = li.querySelector('.btn-icon-edit');
      editBtn.addEventListener('click', () => toggleEditMode(task.id, li));
      
      // Delete button handler
      const deleteBtn = li.querySelector('.btn-icon-delete');
      deleteBtn.addEventListener('click', () => deleteTask(task.id));
      
      todoList.appendChild(li);
    });
  }

  // Helper utility to safely escape raw strings for display to avoid XSS issues
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // ==========================================================================
  // 5. State Modifications & Operations
  // ==========================================================================

  // Add Task Function
  function addTask(e) {
    e.preventDefault();
    const text = todoInput.value.trim();
    
    if (!text) {
      // Small input visual shake effect if empty
      todoInput.parentElement.style.borderColor = '#ef4444';
      todoInput.parentElement.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.2)';
      setTimeout(() => {
        todoInput.parentElement.style.borderColor = '';
        todoInput.parentElement.style.boxShadow = '';
      }, 1000);
      return;
    }
    
    const newTask = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      text: text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    // Add new task to the front of list (new tasks display at the top)
    tasks.unshift(newTask);
    saveTasks();
    updateStats();
    
    // Reset inputs
    todoInput.value = '';
    todoInput.focus();
    
    renderTasks();
  }

  // Toggle Task Completion State
  function toggleTaskComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    task.completed = !task.completed;
    saveTasks();
    updateStats();
    
    // If the active filter hides the toggled card, trigger slide out animation
    if (currentFilter !== 'all') {
      const card = document.getElementById(`task-card-${id}`);
      if (card) {
        card.classList.add('removing');
        card.addEventListener('transitionend', () => {
          renderTasks();
        }, { once: true });
      }
    } else {
      // Just visually update target items to allow smooth checkmark toggle
      const textSpan = document.getElementById(`label-${id}`);
      const checkbox = document.getElementById(`check-${id}`);
      if (textSpan && checkbox) {
        // Safe check state sync
        checkbox.checked = task.completed;
      }
    }
  }

  // In-place Task Editing Engine
  function toggleEditMode(id, element) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const textSpan = element.querySelector('.todo-text');
    const actionsWrapper = element.querySelector('.todo-actions');
    const editBtn = element.querySelector('.btn-icon-edit');
    
    const isEditing = element.classList.contains('editing');
    
    if (!isEditing) {
      // ENTER EDIT MODE
      element.classList.add('editing');
      
      // Store current display content
      const originalText = task.text;
      
      // Inject glassmorphic edit input
      textSpan.outerHTML = `<input type="text" class="edit-input" id="edit-input-${id}" value="${escapeHTML(originalText)}" maxlength="120">`;
      
      // Swap Edit button for Save icon button
      editBtn.className = 'btn-icon btn-icon-save';
      editBtn.innerHTML = icons.save;
      editBtn.setAttribute('aria-label', 'Save edited task description');
      
      const input = element.querySelector('.edit-input');
      input.focus();
      input.select(); // Highlight the text for immediate override
      
      // Mobile UX Optimization: Smooth scroll editing field into view if bumped by keyboard
      setTimeout(() => {
        input.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
      
      // Keyboard save listener
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          saveEdit(id, element, input.value);
        } else if (e.key === 'Escape') {
          cancelEdit(id, element, originalText);
        }
      });
      
      // Click save listener
      const newSaveBtn = element.querySelector('.btn-icon-save');
      // Remove old listener, rebind save action
      newSaveBtn.replaceWith(newSaveBtn.cloneNode(true));
      const boundSaveBtn = element.querySelector('.btn-icon-save');
      boundSaveBtn.addEventListener('click', () => {
        const currentInput = element.querySelector('.edit-input');
        saveEdit(id, element, currentInput.value);
      });
      
    } else {
      // ALREADY IN EDIT MODE, CLICKING SAVE
      const currentInput = element.querySelector('.edit-input');
      saveEdit(id, element, currentInput.value);
    }
  }

  // Save the modified editing results
  function saveEdit(id, element, newValue) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const val = newValue.trim();
    if (!val) {
      // Revert to original if empty
      cancelEdit(id, element, task.text);
      return;
    }
    
    task.text = val;
    saveTasks();
    
    // Cleanly rebuild and render the list
    renderTasks();
  }

  // Cancel editing operations cleanly
  function cancelEdit(id, element, originalText) {
    renderTasks();
  }

  // Animated Task Deletion
  async function deleteTask(id) {
    const card = document.getElementById(`task-card-${id}`);
    if (!card) return;
    
    // Trigger smooth CSS slide/shrink transition
    card.classList.add('removing');
    
    // Leverage the Web Animations API to wait for styles transitions safely
    const activeAnimations = card.getAnimations();
    if (activeAnimations.length > 0) {
      await Promise.race([
        Promise.allSettled(activeAnimations.map(anim => anim.finished)),
        new Promise(resolve => setTimeout(resolve, 400)) // Safety timeout matching CSS duration
      ]);
    }
    
    // Remove element from memory tasks array
    tasks = tasks.filter(t => t.id !== id);
    
    saveTasks();
    updateStats();
    renderTasks();
  }

  // Clear all Completed tasks with custom transitions
  async function clearCompleted() {
    const completedTasks = tasks.filter(t => t.completed);
    if (completedTasks.length === 0) return;
    
    // Mark cards for animating removal simultaneously
    const animationPromises = completedTasks.map(async task => {
      const card = document.getElementById(`task-card-${task.id}`);
      if (card) {
        card.classList.add('removing');
        const activeAnimations = card.getAnimations();
        if (activeAnimations.length > 0) {
          return Promise.race([
            Promise.allSettled(activeAnimations.map(a => a.finished)),
            new Promise(r => setTimeout(r, 400))
          ]);
        }
      }
      return Promise.resolve();
    });
    
    await Promise.all(animationPromises);
    
    // Update core database arrays
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    updateStats();
    renderTasks();
  }

  // ==========================================================================
  // 6. User Control Event Bindings
  // ==========================================================================

  // Submit new task capture
  todoForm.addEventListener('submit', addTask);

  // Clear completed tasks handler
  btnClearCompleted.addEventListener('click', clearCompleted);

  // Filter selection toggles
  filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      currentFilter = button.dataset.filter;
      renderTasks();
    });
  });

  // ==========================================================================
  // 7. Execution Loop Start
  // ==========================================================================
  
  // Set dynamic quote footer
  setRandomQuote();

  // Run dynamic clocks
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // Load and render initial datasets
  loadTasks();
  updateStats();
  renderTasks();

  // Service Worker Cache Registration (for full offline application support)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('TaskFlow Service Worker registered successfully.'))
        .catch(err => console.warn('Service Worker registration failed:', err));
    });
  }
});
