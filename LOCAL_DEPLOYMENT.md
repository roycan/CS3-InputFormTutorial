# Local Server Deployment Guide
> A guide to deploy the Form Handling Tutorial project on your local machine

## Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)
- Basic understanding of terminal/command prompt

## Step-by-Step Deployment

### 1. Clone the Project
```bash
# Create a new directory for your project
mkdir form-tutorial
cd form-tutorial

# Copy all project files into this directory
```

### 2. Install Dependencies
```bash
# Install required packages
npm install
```

### 3. Configure the Server
- Open `server.js` and verify these settings:
  - Port number is set to `3000` (or your preferred port)
  - Static files are properly configured
  - All routes are working as expected

### 4. Start the Server

#### Development Mode
```bash
# Start with nodemon for development
npx nodemon server.js
```

#### Production Mode
```bash
# Start in production mode
node server.js
```

### 5. Access the Application
- Open your web browser
- Visit `http://localhost:3000`
- You should see the form tutorial homepage

## Project Structure
```
form-tutorial/
├── data/               # Stores form submissions
├── public/            # Static files (HTML, CSS, JS)
├── views/             # Handlebars templates
├── server.js          # Main server file
└── package.json       # Project configuration
```

## Common Issues and Solutions

### Port Already in Use
If port 3000 is already in use:
1. Change the port number in `server.js`
2. Restart the server
3. Access using the new port number

### Missing Dependencies
If you see module not found errors:
1. Delete `node_modules` folder
2. Run `npm install` again

### Data Directory Missing
If the data directory is missing:
1. Create a `data` folder in the project root
2. The server will automatically create required files

## Best Practices
1. Always use `npm install` to install dependencies
2. Keep your Node.js version updated
3. Monitor server logs for errors
4. Regularly backup the data directory
5. Use nodemon in development for auto-reloading

## Need Help?
- Check the server logs for error messages
- Review the Express.js documentation
- Verify all file paths are correct
- Ensure proper file permissions

Remember: This is an educational project. Keep security in mind if deploying in a production environment!
