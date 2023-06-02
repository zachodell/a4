const express = require('express');
const cors = require('cors');
const path = require('path');
const { Constants } = require('./utils/Constants');
const menuItemAccessor = require('./db/MenuItemAccessor'); // Import the exported object
const { MenuItem } = require('./entity/MenuItem'); // Import the MenuItem class

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define the REST API routes for menu items
app.get('/api/menuitems', async (req, res) => {
  try {
    const menuItems = await menuItemAccessor.getAllItems();
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/menuitems', async (req, res) => {
  try {
    const menuItemData = req.body;
    const menuItem = new MenuItem(generateUniqueID(), menuItemData.category, menuItemData.description, menuItemData.price, menuItemData.vegetarian);
    const addedItem = await menuItemAccessor.addItem(menuItem);
    res.status(201).json(addedItem);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid request body' });
  }
});

app.listen(Constants.PORT_NUM, () => {
  console.log(`Server started on port ${Constants.PORT_NUM}`);
});

// Helper function to generate a unique ID
function generateUniqueID() {
  // Generate a random number between 100 and 999
  return Math.floor(Math.random() * 900) + 100;
}
