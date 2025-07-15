export default class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || []
    this.categories = JSON.parse(localStorage.getItem('categories')) || [
      { id: 'math', name: 'Maths', emoji: '📐', symbol: '∑' },
      { id: 'science', name: 'Science', emoji: '🔬', symbol: '⚗️' },
      { id: 'english', name: 'English', emoji: '📚', symbol: '✍️' },
      { id: 'history', name: 'History', emoji: '🏛️', symbol: '⏳' },
      { id: 'drama', name: 'Drama', emoji: '🎭', symbol: '🎪' },
      { id: 'news', name: 'News', emoji: '📰', symbol: '📡' },
      { id: 'hpe', name: 'HPE', emoji: '⚽', symbol: '💪' }
    ]
    this.sidebarOpen = false
    this.editingCategory = null
    this.selectedCategory = null
  }

  init() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    const app = document.querySelector('#app')
    app.innerHTML = `
      <div class="app-container">
        <div class="sidebar ${this.sidebarOpen ? 'open' : ''}">
          <div class="sidebar-header">
            <h3>Categories</h3>
            <button class="close-sidebar" onclick="taskManager.toggleSidebar()">×</button>
          </div>
          <div class="filter-section">
            <h4>Filter by Category</h4>
            <div class="filter-options">
              <button class="filter-btn ${this.selectedCategory === null ? 'active' : ''}" 
                      onclick="taskManager.filterByCategory(null)">All Tasks</button>
              ${this.categories.map(category => `
                <button class="filter-btn ${this.selectedCategory === category.id ? 'active' : ''}" 
                        onclick="taskManager.filterByCategory('${category.id}')">
                  ${category.emoji} ${category.name}
                </button>
              `).join('')}
            </div>
          </div>
          <div class="categories-list">
            ${this.categories.map(category => `
              <div class="category-item" data-category-id="${category.id}">
                <div class="category-display">
                  <span class="category-emoji">${category.emoji}</span>
                  <span class="category-symbol">${category.symbol}</span>
                  <span class="category-name">${category.name}</span>
                  <button class="edit-category-btn" onclick="taskManager.editCategory('${category.id}')">✏️</button>
                </div>
                <div class="category-edit" style="display: none;">
                  <input type="text" class="edit-name" value="${category.name}" placeholder="Category name">
                  <input type="text" class="edit-emoji" value="${category.emoji}" placeholder="Emoji" maxlength="2">
                  <input type="text" class="edit-symbol" value="${category.symbol}" placeholder="Symbol" maxlength="2">
                  <div class="edit-actions">
                    <button onclick="taskManager.saveCategory('${category.id}')">Save</button>
                    <button onclick="taskManager.cancelEditCategory('${category.id}')">Cancel</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          <button class="add-category-btn" onclick="taskManager.addNewCategory()">+ Add Category</button>
        </div>

        <div class="main-content">
          <div class="header">
            <button class="sidebar-toggle" onclick="taskManager.toggleSidebar()">☰</button>
            <h1>Task Manager</h1>
          </div>

          <div class="task-form">
            <div class="form-row">
              <input type="text" id="taskInput" placeholder="Enter a new task..." />
              <select id="categorySelect">
                <option value="">No Category</option>
                ${this.categories.map(category => `
                  <option value="${category.id}">${category.emoji} ${category.name}</option>
                `).join('')}
              </select>
            </div>
            <div class="form-row">
              <input type="date" id="dueDateInput" />
              <select id="prioritySelect">
                <option value="">No Priority</option>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button id="addTaskBtn">Add Task</button>
            </div>
          </div>

          <div class="tasks-container">
            <div class="tasks-list">
              ${this.renderTasks()}
            </div>
          </div>
        </div>
      </div>
    `
  }

  renderTasks() {
    let filteredTasks = [...this.tasks]
    
    // Filter by category if one is selected
    if (this.selectedCategory !== null) {
      filteredTasks = filteredTasks.filter(task => task.categoryId === this.selectedCategory)
    }
    
    const sortedTasks = this.sortTasks(filteredTasks)
    
    if (sortedTasks.length === 0) {
      const message = this.selectedCategory !== null ? 'No tasks in this category.' : 'No tasks yet. Add one above!'
      return `<div class="empty-state">${message}</div>`
    }

    return sortedTasks.map(task => {
      const category = this.categories.find(c => c.id === task.categoryId)
      const priorityColor = {
        '': '#3b82f6',
        low: '#4ade80',
        medium: '#fbbf24',
        high: '#ef4444'
      }[task.priority]

      return `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
          <div class="task-content">
            <div class="task-main">
              <div class="priority-indicator" style="background-color: ${priorityColor}"></div>
              <input type="checkbox" ${task.completed ? 'checked' : ''} 
                     onchange="taskManager.toggleTask('${task.id}')" />
              <span class="task-text">${task.text}</span>
              <button class="expand-btn" onclick="taskManager.toggleExpanded('${task.id}')" title="Toggle subtasks">
                ${task.expanded ? '▼' : '▶'}
              </button>
            </div>
            ${(task.subtasks && task.subtasks.length > 0) ? `
              <div class="subtask-progress">
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${this.getSubtaskProgress(task)}%"></div>
                </div>
                <span class="progress-text">${this.getCompletedSubtasks(task)}/${task.subtasks.length} subtasks</span>
              </div>
            ` : ''}
            <div class="task-tags">
              ${task.dueDate ? `<span class="tag due-date">📅 ${this.formatDate(task.dueDate)}</span>` : ''}
              ${task.priority ? `<span class="tag priority priority-${task.priority}">${task.priority.toUpperCase()}</span>` : ''}
              ${category ? `<span class="tag category">${category.emoji} ${category.name}</span>` : ''}
            </div>
            ${task.expanded ? `
              <div class="subtasks-container">
                <div class="add-subtask">
                  <input type="text" class="subtask-input" placeholder="Add a subtask..." 
                         onkeypress="if(event.key==='Enter') taskManager.addSubtask('${task.id}', this.value)" />
                  <button onclick="taskManager.addSubtask('${task.id}', this.previousElementSibling.value)">+</button>
                </div>
                <div class="subtasks-list">
                  ${(task.subtasks || []).map(subtask => `
                    <div class="subtask-item ${subtask.completed ? 'completed' : ''}" data-subtask-id="${subtask.id}">
                      <input type="checkbox" ${subtask.completed ? 'checked' : ''} 
                             onchange="taskManager.toggleSubtask('${task.id}', '${subtask.id}')" />
                      <span class="subtask-text">${subtask.text}</span>
                      <button class="delete-subtask-btn" onclick="taskManager.deleteSubtask('${task.id}', '${subtask.id}')">×</button>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
          <button class="delete-btn" onclick="taskManager.deleteTask('${task.id}')">🗑️</button>
        </div>
      `
    }).join('')
  }

  sortTasks(tasks) {
    return tasks.sort((a, b) => {
      // Completed tasks go to bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }

      // Sort by due date (earliest first, no date goes last)
      if (a.dueDate && b.dueDate) {
        const dateA = new Date(a.dueDate)
        const dateB = new Date(b.dueDate)
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA - dateB
        }
      } else if (a.dueDate && !b.dueDate) {
        return -1
      } else if (!a.dueDate && b.dueDate) {
        return 1
      }

      // Sort by priority (high > medium > low)
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityA = priorityOrder[a.priority] || 0
      const priorityB = priorityOrder[b.priority] || 0
      if (priorityA !== priorityB) {
        return priorityB - priorityA
      }

      // Sort alphabetically
      return a.text.localeCompare(b.text)
    })
  }

  attachEventListeners() {
    const addBtn = document.getElementById('addTaskBtn')
    const taskInput = document.getElementById('taskInput')

    addBtn.addEventListener('click', () => this.addTask())
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTask()
    })
  }

  addTask() {
    const taskInput = document.getElementById('taskInput')
    const dueDateInput = document.getElementById('dueDateInput')
    const prioritySelect = document.getElementById('prioritySelect')
    const categorySelect = document.getElementById('categorySelect')
    
    const text = taskInput.value.trim()
    if (!text) return

    const task = {
      id: Date.now().toString(),
      text,
      completed: false,
      subtasks: [],
      expanded: false,
      dueDate: dueDateInput.value || null,
      priority: prioritySelect.value,
      categoryId: categorySelect.value || null,
      createdAt: new Date().toISOString()
    }

    this.tasks.push(task)
    this.saveToStorage()
    
    // Clear inputs
    taskInput.value = ''
    dueDateInput.value = ''
    prioritySelect.value = ''
    categorySelect.value = ''
    
    this.render()
    this.attachEventListeners()
  }

  toggleTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId)
    if (task) {
      task.completed = !task.completed
      this.saveToStorage()
      this.render()
      this.attachEventListeners()
    }
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter(t => t.id !== taskId)
    this.saveToStorage()
    this.render()
    this.attachEventListeners()
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen
    this.render()
    this.attachEventListeners()
  }

  filterByCategory(categoryId) {
    this.selectedCategory = categoryId
    this.render()
    this.attachEventListeners()
  }

  editCategory(categoryId) {
    this.editingCategory = categoryId
    const categoryItem = document.querySelector(`[data-category-id="${categoryId}"]`)
    categoryItem.querySelector('.category-display').style.display = 'none'
    categoryItem.querySelector('.category-edit').style.display = 'block'
  }

  saveCategory(categoryId) {
    const categoryItem = document.querySelector(`[data-category-id="${categoryId}"]`)
    const name = courseItem.querySelector('.edit-name').value.trim()
    const emoji = courseItem.querySelector('.edit-emoji').value.trim()
    const symbol = courseItem.querySelector('.edit-symbol').value.trim()

    if (!name) return

    const category = this.categories.find(c => c.id === categoryId)
    if (category) {
      category.name = name
      category.emoji = emoji
      category.symbol = symbol
    }

    this.editingCategory = null
    this.saveToStorage()
    this.render()
    this.attachEventListeners()
  }

  cancelEditCategory(categoryId) {
    this.editingCategory = null
    this.render()
    this.attachEventListeners()
  }

  addNewCategory() {
    const newCategory = {
      id: Date.now().toString(),
      name: 'New Category',
      emoji: '📖',
      symbol: '📝'
    }
    this.categories.push(newCategory)
    this.saveToStorage()
    this.render()
    this.attachEventListeners()
    this.editCategory(newCategory.id)
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  saveToStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks))
    localStorage.setItem('categories', JSON.stringify(this.categories))
  }

  toggleExpanded(taskId) {
    const task = this.tasks.find(t => t.id === taskId)
    if (task) {
      task.expanded = !task.expanded
      this.saveToStorage()
      this.render()
      this.attachEventListeners()
    }
  }

  addSubtask(taskId, text) {
    if (!text || !text.trim()) return
    
    const task = this.tasks.find(t => t.id === taskId)
    if (task) {
      // Ensure subtasks array exists
      if (!task.subtasks) {
        task.subtasks = []
      }
      
      const subtask = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      }
      task.subtasks.push(subtask)
      this.saveToStorage()
      this.render()
      this.attachEventListeners()
    }
  }

  toggleSubtask(taskId, subtaskId) {
    const task = this.tasks.find(t => t.id === taskId)
    if (task) {
      const subtask = task.subtasks.find(s => s.id === subtaskId)
      if (subtask) {
        subtask.completed = !subtask.completed
        this.saveToStorage()
        this.render()
        this.attachEventListeners()
      }
    }
  }

  deleteSubtask(taskId, subtaskId) {
    const task = this.tasks.find(t => t.id === taskId)
    if (task) {
      task.subtasks = task.subtasks.filter(s => s.id !== subtaskId)
      this.saveToStorage()
      this.render()
      this.attachEventListeners()
    }
  }

  getSubtaskProgress(task) {
    if (!task.subtasks || task.subtasks.length === 0) return 0
    const completed = task.subtasks.filter(subtask => subtask.completed).length
    return Math.round((completed / task.subtasks.length) * 100)
  }

  getCompletedSubtasks(task) {
    if (!task.subtasks) return 0
    return task.subtasks.filter(subtask => subtask.completed).length
  }
}

// Make taskManager globally available
window.taskManager = new TaskManager()