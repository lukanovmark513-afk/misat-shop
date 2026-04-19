const bcrypt = require('bcrypt');
const password = 'jagzaj-mAngar-9xomfi';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) throw err;
    console.log(hash);
});
