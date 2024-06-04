import nedb from "nedb-promises";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const database_names = ["company", "order", "users"];
const db = {};

database_names.forEach((name) => {
  const database_directory = path.join(dirname, `${name}.db`);
  db[name] = new nedb({
    filename: database_directory,
    autoload: true,
  });
});

export default db;
