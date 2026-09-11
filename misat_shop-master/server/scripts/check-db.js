const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "../database.sqlite");

if (!fs.existsSync(dbPath)) {
  console.error("Database not found!");
  process.exit(1);
}

const db = new sqlite3.Database(dbPath);

console.log("CHECKING DATABASE");
console.log("================================");

db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, tables) => {
  if (err) {
    console.error("Error:", err);
    db.close();
    return;
  }
  
  console.log("Tables (" + tables.length + "):");
  tables.forEach(t => console.log("  - " + t.name));
  
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    console.log("Users: " + (row?.count || 0));
    
    db.get("SELECT email, first_name, last_name, role FROM users WHERE role = 'admin'", (err, admin) => {
      if (admin) {
        console.log("Admin:");
        console.log("  Email: " + admin.email);
        console.log("  Name: " + admin.first_name + " " + admin.last_name);
        console.log("  Password: Admin@MISAT2025!");
      } else {
        console.log("Admin not found");
      }
      
      db.close();
    });
  });
});
