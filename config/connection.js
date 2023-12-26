const mysql = require('mysql2');



const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Butterypopcorn94*",
  database: "employee_manager_db"
});

const promisePool = pool.promise();

module.exports = promisePool;
