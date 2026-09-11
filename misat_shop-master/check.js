const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

(async () => {
  try {
    const db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });

    console.log('Database opened');

    const info = await db.all('PRAGMA table_info(users)');
    console.log('Table structure:');
    console.table(info);

    const hasHash = info.some(c => c.name === 'password_hash');
    const hasPassword = info.some(c => c.name === 'password');

    console.log('password_hash exists?', hasHash);
    console.log('password exists?', hasPassword);

    if (!hasHash && hasPassword) {
      console.log('Renaming password -> password_hash...');
      await db.exec('ALTER TABLE users RENAME COLUMN password TO password_hash');
      console.log('Done!');

      const newInfo = await db.all('PRAGMA table_info(users)');
      console.log('Updated structure:');
      console.table(newInfo);
    }

    const users = await db.all('SELECT id, email, first_name, last_name, phone FROM users LIMIT 5');
    console.log('Users count:', users.length);
    if (users.length > 0) {
      console.table(users);
    }

    await db.close();
    console.log('Done!');

  } catch (error) {
    console.error('Error:', error.message);
  }
})();