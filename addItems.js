// addItems.js
const mongoose = require('mongoose');
const Item = require('./models/Item');

mongoose.connect('mongodb://localhost:27017/loginApp')
  .then(async () => {
    console.log('Connected, inserting items...');
    const items = [
      { name: "Red Lehenga", price: 1200, deposit: 2000, image: "https://images.unsplash.com/photo-1520975918319-2d3c7e49557b", description: "Beautiful bridal lehenga", sizes: ["S","M","L"], category: "Lehenga" },
      { name: "Golden Saree", price: 900, deposit: 1500, image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f", description: "Elegant golden saree", sizes: ["S","M","L"], category: "Saree" },
      { name: "Black Gown", price: 800, deposit: 1000, image: "https://images.unsplash.com/photo-1520975920562-0d92e0ca5661", description: "Evening gown", sizes: ["S","M","L"], category: "Gown" },
    ];
    await Item.deleteMany({});
    await Item.insertMany(items);
    console.log('Inserted items');
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
