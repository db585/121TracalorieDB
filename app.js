// Storage Controller

// Item Controller
const ItemCtrl = (function () {
  // Item constructor
  const Item = function (id, name, calories) {
    this.id = id
    this.name = name
    this.calories = calories
  }

  // Data structure / State
  const state = {
    items: [
      { id: 0, name: 'Steak Dinner', calories: 1200 },
      { id: 1, name: 'Supper', calories: 1000 },
      { id: 2, name: 'Breakfast', calories: 800 }
    ],
    currentItem: null,
    totalCalories: 0
  }

  // Public methods
  return {
    getItems: function () {
      return state.items
    },

    addItem: function (name, calories) {
      // Create ID
      let ID = 0
      if (state.items.length > 0) {
        ID = state.items[state.items.length - 1].id + 1
      }

      // Convert calories into int
      calories = parseInt(calories)

      // Create Item obj
      const newItem = new Item(ID, name, calories)

      // Add item to items array
      state.items.push(newItem)

      return newItem
    },

    logState: function () {
      return state
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
    addBtn: '.add-btn'
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
  }

  // itemAddSubmit func
  const itemAddSubmit = function (e) {
    // Get item input from UIctrl
    const input = UICtrl.getItemInput()

    // Check inputs
    if (input.name !== '' && input.calories !== '') {
      // Add item to state
      const newItem = ItemCtrl.addItem(input.name, input.calories)
    } else {
      console.log('Please, enter correct data')
    }

    e.preventDefault()
  }

  // Init app - public methods
  return {
    init: function () {
      // Fetch items from Data structure/State
      const items = ItemCtrl.getItems()

      // Populate the list with items
      UICtrl.populateList(items)

      // Load event listeners
      LoadEventListeners()
    }
  }
})(ItemCtrl, UICtrl)

// console.log(ItemCtrl.logState())
// Init App
App.init()
