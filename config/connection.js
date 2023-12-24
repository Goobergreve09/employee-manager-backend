const mysql = require('mysql2');
const util = require('util'); // To use promisify

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });


async function viewDepartments() {
    const query = util.promisify(connection.query).bind(connection);
    try {
      const departments = await query('SELECT * FROM Departments');

      console.log('Departments:');
      departments.forEach(department => {
        console.log(`ID: ${department.id}, Name: ${department.name}`);
      });
  
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      // Close the database connection
      connection.end();
    }
  }

  module.exports = viewDepartments;