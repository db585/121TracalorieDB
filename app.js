// Storage Controller
const StorageCtrl = (function () {
  // public methods
  return {
    storeItem: function (item) {
      let items

      // Check if items exists in LS
      if (window.localStorage.getItem('items') === null) {
        items = []

        // Push new item
        items.push(item)

        // Save to LS
        window.localStorage.setItem('items', JSON.stringify(items))
      } else {
        // Get what is already in LS
        items = JSON.parse(window.localStorage.getItem('items'))

        // Push new item
        items.push(item)

        // Re-save to LS
        window.localStorage.setItem('items', JSON.stringify(items))
      }
    },

    getItemsFromStorage: function () {
      let items

      // Check if items already in LS
      if (window.localStorage.getItem('items') === null) {
        items = []
      } else {
        // Get items from LS
        items = JSON.parse(window.localStorage.getItem('items'))
      }

      return items
    },

    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(window.localStorage.getItem('items'))

      // Loop though items
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem)
        }
      })

      // Re-save to LS
      window.localStorage.setItem('items', JSON.stringify(items))
    },

    deleteItemFromStorage: function (id) {
      let items = JSON.parse(window.localStorage.getItem('items'))

      // Loop though items
      items.forEach((item, index) => {
        if (id === item.id) {
          items.splice(index, 1)
        }
      })

      // Re-save to LS
      window.localStorage.setItem('items', JSON.stringify(items))
    },

    clearItemsFromStorage: function () {
      window.localStorage.removeItem('items')
    }
  }
})()

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
    // items: [
    //   // { id: 0, name: 'Steak Dinner', calories: 1200 },
    //   // { id: 1, name: 'Supper', calories: 1000 },
    //   // { id: 2, name: 'Breakfast', calories: 800 }
    // ],
    items: StorageCtrl.getItemsFromStorage(),
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

    getItemById: function (id) {
      let found = null

      // Loop through data
      data.items.forEach(item => {
        if (item.id === id) {
          found = item
        }
      })

      return found
    },

    updateItem: function (name, calories) {
      // Calories to number
      calories = parseInt(calories)

      let found = null

      // Loop through data to search for currentItem
      data.items.forEach(item => {
        if (item.id === data.currentItem.id) {
          item.name = name
          item.calories = calories
          found = item
        }
      })
      return found
    },

    deleteItem: function (id) {
      // Get ids
      const ids = data.items.map((item) => {
        return item.id
      })
      // console.log('ids: ', ids)
      // debugger

      // Get index
      const index = ids.indexOf(id)
      // debugger

      data.items.splice(index, 1)
      // debugger
      console.log('data.items after splice ', data.items)
    },

    clearAllItens: function () {
      data.items = []
    },

    setCurrentItem: function (item) {
      data.currentItem = item
    },

    getCurrentItem: function () {
      return data.currentItem
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
    listItems: '#item-list li',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn'
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

    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems)

      // Turn nodelist into array
      listItems = Array.from(listItems)

      // Loop through array and search for item
      listItems.forEach(listItem => {
        const itemID = listItem.getAttribute('id')

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = ` <strong>${item.name}: </strong>
          <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
          <i class="edit-item fas fa-pencil-alt"></i>
          </a>`
        }
      })
    },

    deleteListItem: function (id) {
      const itemID = `#item-${id}`
      const item = document.querySelector(itemID)
      item.remove()
    },

    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems)

      // Turn nodelist into array
      listItems = Array.from(listItems)

      listItems.forEach(listItem => {
        listItem.remove()
      })
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

    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories
      UICtrl.showEditState()
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

    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline'
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
      document.querySelector(UISelectors.backBtn).style.display = 'inline'
      document.querySelector(UISelectors.addBtn).style.display = 'none'
    },

    getSelectors: function () {
      // Public UISelectors
      return UISelectors
    }
  }
})()

// App Controller
const App = (function (ItemCtrl, UICtrl, StorageCtrl) {
  // Load event listeners
  const LoadEventListeners = function () {
    // Get UI selectors from UICtrl
    const UISelectors = UICtrl.getSelectors()

    // Add event item
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)

    // Disbale submit on enter
    document.addEventListener('keypress', (e) => {
      // Check if Enter key pressed(keycode is 13) (e.which is for old browsers)
      // But both are depreciated
      // e.key and e.code are modern equivalents
      if (e.keyCode === 13 || e.which === 13 || e.key === 'Enter' || e.code === 'Enter') {
        // console.log('e.keyCode: ', e.keyCode)
        // console.log('e.which: ', e.which)
        // console.log('e.key: ', e.key)
        // console.log('e.code: ', e.code)

        e.preventDefault()
        return false
      }
    })

    // Add event listener for edit icon click
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)

    // Add event listener for update button
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit)

    // Add event listener for delete button
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit)

    // Add event listener for back button
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState)

    // Add event listener for clear button
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick)
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

      // Store item in LS
      StorageCtrl.storeItem(newItem)

      // Cleat input fields
      UICtrl.clearInputFields()
    } else {
      console.log('Please, enter correct data')
    }

    e.preventDefault()
  }

  // Item edit click func
  const itemEditClick = function (e) {
    // Check that edit icon was targeted
    if (e.target.classList.contains('edit-item')) {
      // Get li id
      const liID = e.target.parentNode.parentNode.id

      // Break liID into array
      const listIDArr = liID.split('-')
      // Get [1] el of arr which is a number of item
      const id = parseInt(listIDArr[1])
      // console.log(id)

      // Get full item by id
      const itemToEdit = ItemCtrl.getItemById(id)
      // console.log(itemToEdit)

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit)

      // Add item to form
      UICtrl.addItemToForm()
    }

    e.preventDefault()
  }

  // Update item Submit
  const itemUpdateSubmit = function (e) {
    // Get item input
    const input = UICtrl.getItemInput()

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories)

    // Update UI
    UICtrl.updateListItem(updatedItem)

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories()

    // Show total calories in UI
    UICtrl.showTotalCalories(totalCalories)

    // Update LS
    StorageCtrl.updateItemStorage(updatedItem)

    // Cleat edit state
    UICtrl.clearEditState()

    e.preventDefault()
  }

  const itemDeleteSubmit = function (e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem()

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id)

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id)

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories()
    console.log('totalCalories ', totalCalories)

    // Show total calories in UI
    UICtrl.showTotalCalories(totalCalories)

    // Delete form LS
    StorageCtrl.deleteItemFromStorage(currentItem.id)

    // Cleat edit state
    UICtrl.clearEditState()

    e.preventDefault()
  }

  const clearAllItemsClick = function (e) {
    // Delete all items from data structture
    ItemCtrl.clearAllItens()

    // Remove from UI
    UICtrl.removeItems()

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories()

    // Show total calories in UI
    UICtrl.showTotalCalories(totalCalories)

    // Clear from LS
    StorageCtrl.clearItemsFromStorage()

    // Cleat edit state
    UICtrl.clearEditState()

    // Hide ul element
    UICtrl.hideList()
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
})(ItemCtrl, UICtrl, StorageCtrl)

// console.log(ItemCtrl.logdata())
// Init App
App.init()
