document.addEventListener('DOMContentLoaded', () => {
    const menuItemsContainer = document.getElementById('menuItems');
    const addItemForm = document.getElementById('addItemForm');

    // Function to fetch menu items from the back end and display them in the UI
// Function to fetch menu items from the back end and display them in the UI
const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menuitems');
      
      if (response.ok) {
        const data = await response.json();
        displayMenuItems(data);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

    // Function to display menu items in the UI
    const displayMenuItems = (menuItems) => {
        menuItemsContainer.innerHTML = '';
        menuItems.forEach((menuItem) => {
            const itemElement = createMenuItemElement(menuItem);
            menuItemsContainer.appendChild(itemElement);
        });
    };

    // Function to create a menu item element
    const createMenuItemElement = (menuItem) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('menuItem');
        itemElement.innerHTML = `
            <p><strong>Category:</strong> ${menuItem.category}</p>
            <p><strong>Description:</strong> ${menuItem.description}</p>
            <p><strong>Price:</strong> $${menuItem.price}</p>
            <p><strong>Vegetarian:</strong> ${menuItem.vegetarian ? 'Yes' : 'No'}</p>
            <button class="deleteBtn" data-id="${menuItem.id}">Delete</button>
        `;
        return itemElement;
    };

// Function to handle form submission and add a new menu item
const handleFormSubmit = async (event) => {
    event.preventDefault();
    const categoryInput = document.getElementById('category');
    const descriptionInput = document.getElementById('description');
    const priceInput = document.getElementById('price');
    const vegetarianInput = document.getElementById('vegetarian');

    const newMenuItem = {
        category: categoryInput.value,
        description: descriptionInput.value,
        price: parseFloat(priceInput.value),
        vegetarian: vegetarianInput.checked,
    };

    try {
        const response = await fetch('/api/menuitems', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMenuItem),
        });

        if (response.ok) {
            categoryInput.value = '';
            descriptionInput.value = '';
            priceInput.value = '';
            vegetarianInput.checked = false;
            fetchMenuItems();
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

    // Function to handle delete button click and delete a menu item
    const handleDeleteButtonClick = async (event) => {
        if (event.target.classList.contains('deleteBtn')) {
            const menuItemId = event.target.dataset.id;
            try {
                const response = await fetch(`/api/menuitems/${menuItemId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    fetchMenuItems();
                } else {
                    const errorData = await response.json();
                    console.error('Error:', errorData.error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    // Attach event listeners
    addItemForm.addEventListener('submit', handleFormSubmit);
    menuItemsContainer.addEventListener('click', handleDeleteButtonClick);

    // Initial fetch of menu items
    fetchMenuItems();
});
