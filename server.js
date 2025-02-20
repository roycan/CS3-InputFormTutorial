/* nodemon config
{
  "watch": ["server.js", "views/", "public/"],
  "ext": "js,json,hbs,html,css",
  "ignore": ["node_modules/", "data/"],
  "env": {
    "NODE_ENV": "development"
  }
}
*/

// ==========================================
// 🎓 Educational Web Server with Express.js
// This server handles form submissions and serves web pages
// ==========================================

// Import required packages
const express = require("express");  // The main web framework
const app = express();              // Create our web application
const path = require("path");       // For working with file paths
const bodyParser = require("body-parser");  // For parsing form data
const hbs = require("hbs");         // Template engine for dynamic web pages
const fs = require("fs");           // For working with files

// ===================
// 📝 Setup Templates
// ===================
// Tell Express we want to use Handlebars templates
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Register useful template helpers (functions we can use in our templates)
hbs.registerHelper("isArray", Array.isArray);  // Check if something is an array
hbs.registerHelper("join", (arr, separator) => arr.join(separator));  // Join array items
hbs.registerHelper("add", (a, b) => a + b);    // Add numbers
hbs.registerHelper("eq", (a, b) => a === b);   // Compare values

// ===================
// 💾 Data Storage Setup
// ===================
// Create a data directory if it doesn't exist
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// This is where we store all form submissions
const submissionsPath = path.join(dataDir, "submissions.json");
let formSubmissions = {
    personal: [],    // Personal information forms
    contact: [],     // Contact forms
    profile: [],     // Profile forms
    interests: [],   // Interest forms
    terms: [],       // Terms acceptance forms
};

// Load existing submissions or create new file
try {
    if (fs.existsSync(submissionsPath)) {
        const data = fs.readFileSync(submissionsPath, "utf8");
        formSubmissions = JSON.parse(data);
    } else {
        // Create initial submissions file
        fs.writeFileSync(
            submissionsPath,
            JSON.stringify(formSubmissions, null, 2),
        );
    }
} catch (error) {
    console.error("📛 Error loading submissions:", error);
}

// ===================
// 🔍 Logging Middleware
// ===================
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🌐 ${req.method} ${req.path}`);
    next();
});

// ===================
// 📁 Static Files Setup
// ===================
// Serve files from the 'public' folder with proper MIME types
app.use(express.static(path.join(__dirname, "public"), {
    index: 'index.html',
    extensions: ['html', 'htm'],
    setHeaders: (res, filePath, stat) => {
        // Set proper content types
        if (filePath.endsWith('.html')) {
            res.set('Content-Type', 'text/html');
        } else if (filePath.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
        } else if (filePath.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
        // Add cache control for better performance
        res.set('Cache-Control', 'public, max-age=300');
    }
}));

// Handle form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ===================
// 🛣️ Routes
// ===================

// Home page - serve the static index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// View all submissions
app.get("/submissions", (req, res) => {
    try {
        const data = fs.readFileSync(submissionsPath, "utf8");
        const allSubmissions = JSON.parse(data);
        const flattenedSubmissions = Object.entries(allSubmissions)
            .reduce((acc, [type, submissions]) => {
                return [
                    ...acc,
                    ...submissions.map((sub) => ({ ...sub, formType: type })),
                ];
            }, [])
            .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
        res.render("submissions", { submissions: flattenedSubmissions });
    } catch (error) {
        console.error("📛 Error reading submissions:", error);
        res.render("submissions", { submissions: [] });
    }
});

// Handle form submissions
app.post("/submit/:formType", (req, res) => {
    console.log(`📝 Received ${req.params.formType} form submission:`, req.body);

    try {
        const formType = req.params.formType;
        if (!formSubmissions[formType]) {
            throw new Error("Invalid form type");
        }

        const formData = {
            ...req.body,
            submissionDate: new Date().toISOString(),
        };

        formSubmissions[formType].push(formData);
        fs.writeFileSync(
            submissionsPath,
            JSON.stringify(formSubmissions, null, 2),
        );

        res.json({
            status: "success",
            message: "Form submitted successfully",
            data: formData,
        });
    } catch (error) {
        console.error("📛 Error processing form submission:", error);
        res.status(400).json({
            status: "error",
            message: error.message || "Error processing form submission",
        });
    }
});

// ===================
// ❌ Error Handling
// ===================

// Handle 404 (Page Not Found) errors
app.use((req, res, next) => {
    res.status(404).render('error', {
        message: 'Page not found'
    });
});

// Handle server errors
app.use((err, req, res, next) => {
    console.error("🚨 Server error:", err);
    res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
});

// ===================
// 🚀 Start Server
// ===================
const startServer = async (port) => {
    try {
        await new Promise((resolve, reject) => {
            const server = app.listen(port, '0.0.0.0', () => {
                console.log(`[${new Date().toISOString()}] 🚀 Server running on port ${port}`);
                resolve(server);
            });

            server.on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`Port ${port} is busy, trying ${port + 1}`);
                    resolve(startServer(port + 1));
                } else {
                    reject(err);
                }
            });
        });
    } catch (err) {
        console.error('🚨 Failed to start server:', err);
        process.exit(1);
    }
};

// Start the server on port 3000 (or the port specified in environment variables)
const PORT = process.env.PORT || 3000;
startServer(PORT);