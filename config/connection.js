const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const tables = ['Departments', 'Role', 'Employee'];

  // Loop through each table and execute a SELECT query
  tables.forEach((table) => {
    const query = `SELECT * FROM ${table}`;
    connection.query(query, function (err, results, fields) {
      if (err) {
        console.error(`Error retrieving data from ${table}: ${err.message}`);
      } else {
        console.log(`Data from ${table}:`);
        console.log(results);
      }
    });
  });
