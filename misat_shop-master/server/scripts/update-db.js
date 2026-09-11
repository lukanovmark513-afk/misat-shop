const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../database.sqlite");
const schemaPath = path.join(__dirname, "../database/migrations/schema.sql");

console.log("Updating database...");

if (!fs.existsSync(schemaPath)) {
  console.error("Schema file not found!");
  process.exit(1);
}

if (fs.existsSync(dbPath)) {
  const backupPath = dbPath + ".backup";
  fs.copyFileSync(dbPath, backupPath);
  console.log("Backup created");
}

const db = new sqlite3.Database(dbPath);
const schema = fs.readFileSync(schemaPath, "utf-8");

const queries = schema.split(";").map(q => q.trim()).filter(q => q.length > 0 && !q.startsWith("--"));

console.log("Executing " + queries.length + " queries...");

let executed = 0, errors = 0, skipped = 0;

db.serialize(() => {
  queries.forEach((query, i) => {
    db.run(query, (err) => {
      if (err) {
        if (err.message.includes("already exists") || err.message.includes("duplicate column")) {
          skipped++;
        } else {
          errors++;
          console.log("Error: " + err.message);
        }
      } else {
        executed++;
      }
      process.stdout.write("\rProgress: " + (executed+errors+skipped) + "/" + queries.length + " | OK: " + executed + " | Skipped: " + skipped + " | Errors: " + errors);
    });
  });

  db.close(() => {
    console.log("\n\nDone! OK: " + executed + ", Skipped: " + skipped + ", Errors: " + errors);
  });
});
