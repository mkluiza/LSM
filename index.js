
// if (filePath === './') {
//     filePath = './index.html';
// }

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from current directory
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// $ ssh { hébergement_id } @git.{ datacenter_id }.gpaas.net 'deploy {repository}.git
// $ ssh eee0a83c - 7ce1 - 11f0 - bd2b-00163eada87b @git.sd6.gpaas.net 'deploy default.git'
//  ssh eee0a83c-7ce1-11f0-bd2b-00163eada87b@git.sd6.gpaas.net 'clean default.git'