Elegance Rentals - Outfit Rental Platform
A full-stack web application for renting traditional and formal outfits. Features separate user and admin panels with authentication, outfit management, and order tracking.
🌟 Features
User Panel

Browse available outfits (Lehengas, Sarees, Gowns, etc.)
Filter by category and search functionality
View detailed outfit information (price, deposit, sizes)
User authentication (signup/login)
Place rental orders
View order history

Admin Panel

Secure admin authentication
Add new outfits with image upload
Manage existing outfits (edit/delete)
View all orders
View registered users
Dashboard with statistics

🚀 Live Demo
Website: https://elegance-rentals-fullstack.onrender.com
Admin Panel: https://elegance-rentals-fullstack.onrender.com/admin-login.html
🛠️ Tech Stack
Frontend

HTML5
CSS3
JavaScript (Vanilla)
Responsive Design

Backend

Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
Multer (file uploads)
bcrypt.js (password hashing)

📦 Installation
Prerequisites

Node.js (v14 or higher)
MongoDB
npm or yarn

Setup

Clone the repository

bashgit clone <your-repo-url>
cd elegance-rentals

Install dependencies

bashnpm install

Create environment variables

Create a .env file in the root directory:
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=production

Start the server

bashnpm start

Access the application


User Panel: http://localhost:5000
Admin Panel: http://localhost:5000/admin-login.html

📁 Project Structure
elegance-rentals/
├── models/
│   ├── User.js          # User schema
│   ├── Item.js          # Outfit item schema
│   └── Order.js         # Order schema
├── routes/
│   ├── auth.js          # User authentication routes
│   ├── adminAuth.js     # Admin authentication routes
│   ├── admin.js         # Admin panel routes
│   └── items.js         # Item routes
├── middleware/
│   ├── auth.js          # User authentication middleware
│   └── adminAuth.js     # Admin authentication middleware
├── public/
│   ├── index.html       # User homepage
│   ├── login.html       # User login page
│   ├── admin-login.html # Admin login page
│   ├── admin.html       # Admin dashboard
│   ├── uploads/         # Uploaded images
│   └── styles.css       # Styling
├── server.js            # Main server file
├── package.json
└── .env
🔐 Authentication
User Authentication

JWT-based authentication
Secure password hashing with bcrypt
Protected routes for user operations

Admin Authentication

Separate admin authentication system
Role-based access control
Admin-only routes protected with middleware

🎨 Features in Detail
Outfit Management

Upload outfit images
Set rental price and deposit
Specify available sizes
Add descriptions and categories
Edit/delete existing outfits

Order System

Users can place rental orders
Track order status
View order history
Admin can view all orders

🚀 Deployment
This project is deployed on Render.
Deployment Steps:

Push code to GitHub
Connect repository to Render
Set environment variables in Render dashboard
Deploy automatically on push

🔧 Environment Variables
VariableDescriptionMONGO_URLMongoDB connection stringJWT_SECRETSecret key for JWT tokensPORTServer port (default: 5000)NODE_ENVEnvironment (production/development)
📝 API Endpoints
Authentication

POST /api/auth/register - Register new user
POST /api/auth/login - User login
POST /api/admin-auth/login - Admin login

Items

GET /api/items - Get all items
GET /api/items/:id - Get single item

Admin Routes (Protected)

GET /api/admin/items - Get all items (admin)
POST /api/admin/items/add - Add new item
PUT /api/admin/items/:id - Update item
DELETE /api/admin/items/:id - Delete item
GET /api/admin/orders - Get all orders

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
📄 License
This project is open source and available under the MIT License.

👨‍💻 Author
Name - Prachi dilip karad
github profile - (https://github.com/Prachikarad)

🙏 Acknowledgments

Thanks to all contributors
Inspired by modern rental platforms
Built with ❤️ for traditional outfit rentals
