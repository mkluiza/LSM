
// if (filePath === './') {
//     filePath = './index.html';
// }

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from current directory
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// $ ssh { hébergement_id } @git.{ datacenter_id }.gpaas.net 'deploy {repository}.git
// $ ssh eee0a83c - 7ce1 - 11f0 - bd2b-00163eada87b @git.sd6.gpaas.net 'deploy default.git'
//  ssh eee0a83c-7ce1-11f0-bd2b-00163eada87b@git.sd6.gpaas.net 'clean default.git'

// git remote add gandi ssh://git@your_git_server/your_app_name.git

// git_server = ssh://git@git.sd6.gpaas.net/vhosts/default/
// app_name = 
// user_name_gandi_sftp = eee0a83c-7ce1-11f0-bd2b-00163eada87b
// host_name_gandi = git.sd6.gpaas.net / sftp.sd6.gpaas.net / ssh.sd6.gpaas.net
// psswd = Tdw8bky9aP7dZYV
//  control_panel_user_name+ = 11319408