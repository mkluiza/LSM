// const express = require('express');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 3000; //8080

// // Serve static files
// app.use(express.static(path.join(__dirname)));

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    // Determine the file path
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Determine the content type
    let contentType = 'text/html';
    const extname = path.extname(filePath);
    switch (extname) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
    }

    // Read and serve the file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code == 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>');
            } else {
                // Server error
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`<h1>Server Error: ${err.code}</h1>`);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
