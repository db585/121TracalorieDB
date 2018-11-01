// Storage Controller

// Item Controller
const ItemCtrl = (function () {
  // Item constructor
  const Item = function (id, name, calories) {
    this.id = id
    this.name = name
    this.calories = calories
  }

  // Data structure / data
  const data = {
    items: [
      // { id: 0, name: 'Steak Dinner', calories: 1200 },
      // { id: 1, name: 'Supper', calories: 1000 },
      // { id: 2, name: 'Breakfast', calories: 800 }
    ],
    currentItem: null,
    totalCalories: 0
  }

  // Public methods
  return {
    getItems: function () {
      return data.items
    },

    addItem: function (name, calories) {
      // Create ID
      let ID = 0
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1
      }

      // Convert calories into int
      calories = parseInt(calories)

      // Create Item obj
      const newItem = new Item(ID, name, calories)

      // Add item to items array
      data.items.push(newItem)

      return newItem
    },

    getTotalCalories: function () {
      let total = 0

      // Loop throogh items
      data.items.forEach(item => {
        total += item.calories
      })

      data.totalCalories = total

      return data.totalCalories
    },

    logData: function () {
      return data
    }
  }
})()

// UI Controller
const UICtrl = (function () {
  // Private bindings
  const UISelectors = {
    itemList: '#item-list',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn'
  }

  // Public methods
  return {
    populateList: function (items) {
      let html = ''
      items.forEach(item => {
        html += `
        <li id="item-${item.id}" class="collection-item">
          <strong>${item.name}: </strong>
          <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
          <i class="edit-item fas fa-pencil-alt"></i>
          </a>
        </li>`
      })

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html
    },

    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: function (item) {
      // Create li element
      const li = document.createElement('li')

      // Add a class
      li.className = 'collection-item'

      // Add Id
      li.id = `item-${item.id}`

      // Add html
      li.innerHTML = ` <strong>${item.name}: </strong>
      <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
      <i class="edit-item fas fa-pencil-alt"></i>
      </a>`

      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },

    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories
    },

    clearInputFields: function () {
      document.querySelector(UISelectors.itemNameInput).value = ''
      document.querySelector(UISelectors.itemNameInput).classList.remove('valid')
      document.querySelector(UISelectors.itemNameInput).focus()
      document.querySelector(UISelectors.itemCaloriesInput).value = ''
      document.querySelector(UISelectors.itemCaloriesInput).classList.remove('valid')
    },

    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none'
    },

    showList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'block'
    },

    clearEditState: function () {
      UICtrl.clearInputFields()
      document.querySelector(UISelectors.updateBtn).style.display = 'none'
      document.querySelector(UISelectors.deleteBtn).style.display = 'none'
      document.querySelector(UISelectors.backBtn).style.display = 'none'
      document.querySelector(UISelectors.addBtn).style.display = 'inline'
    },

    getSelectors: function () {
      // Public UISelectors
      return UISelectors
    }
  }
})()

// App Controller
const App = (function (ItemCtrl, UICtrl) {
  // Load event listeners
  const LoadEventListeners = function () {
    // Get UI selectors from UICtrl
    const UISelectors = UICtrl.getSelectors()

    // Add event item
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)

    // Add event for edit icon click
    document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit)
  }

  // itemAddSubmit func
  const itemAddSubmit = function (e) {
    // Get item input from UIctrl
    const input = UICtrl.getItemInput()

    // Check inputs
    if (input.name !== '' && input.calories !== '') {
      // Add item to data
      const newItem = ItemCtrl.addItem(input.name, input.calories)

      // Check if this is first item to show list
      if (newItem.id === 0) {
        UICtrl.showList()
      }
      // Add item to UI list
      UICtrl.addListItem(newItem)

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories()

      // Show total calories in UI
      UICtrl.showTotalCalories(totalCalories)

      // Cleat input fields
      UICtrl.clearInputFields()
    } else {
      console.log('Please, enter correct data')
    }

    e.preventDefault()
  }

  // Update item submit func
  const itemUpdateSubmit = function (e) {
    // Check that edit icon was targeted
    if (e.target.classList.contains('edit-item')) {
      // Get li id
      const liID = e.target.parentNode.parentNode.id

      // Break liID into array
      const listIDArr = liID.split('-')
      // Get [1] el of arr
      const id = listIDArr[1]
      // console.log(id)

      // Get item
    }

    e.preventDefault()
  }

  // Init app - public methods
  return {
    init: function () {
      // Make init state of buttons on the page
      UICtrl.clearEditState()

      // Fetch items from Data structure/data
      const items = ItemCtrl.getItems()

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList()
      }

      // Populate the list with items
      UICtrl.populateList(items)

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories()

      // Show total calories in UI
      UICtrl.showTotalCalories(totalCalories)

      // Load event listeners
      LoadEventListeners()
    }
  }
})(ItemCtrl, UICtrl)

// console.log(ItemCtrl.logdata())
// Init App
App.init()
