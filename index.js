const inquirer = require("inquirer");
const promisePool = require('./config/connection');


const mainChoices = [
  "View All Employees",
  "Add Employee",
  "Update Employee Role",
  "View All Roles",
  "Add Role",
  "View All Departments",
  "Add Department",
  "Quit",
];


const promptUser = async () => {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "main",
      message: `What would you like to do?`,
      choices: mainChoices,
    },
  ]);

  switch (answers.main) {
    case "View All Employees":
      await viewAllEmployees();
      break;

    case "Add Employee":
      await addEmployee();
      break;

    case "Update Employee Role":
      await updateEmployeeRole();
      break;

    case "View All Roles":
      await viewAllRoles();
      break;

    case "Add Role":
      await addRole();
      break;

    case "View All Departments":
      await viewAllDepartments();
      break;

    case "Add Department":
      await addDepartment();
      break;

    case "Quit":
      console.log("Quitting...");
      // You may want to close the connection here if necessary
      break;

    default:
      console.log("Invalid choice");
  }
};

const viewAllDepartments = async () => {
  try {
    const [rows, fields] = await promisePool.query('SELECT * FROM Departments WHERE id > 100');
    console.table(rows);
  } catch (error) {
    console.error('Error fetching departments:', error.message);
  }
  // Prompt user again after displaying the table
  await promptUser();
};

async function viewAllRoles() {
  try {
    // Fetch and display roles with department names
    const [rows] = await promisePool.query(`
      SELECT r.id, r.Title, d.name AS Department, r.Salary
      FROM Roles r
      JOIN Departments d ON r.department_id = d.id
      WHERE r.id > 200
    `);
    console.table(rows);
  } catch (error) {
    console.error('Error fetching roles:', error.message);
  } finally {
    // Prompt user again or end the connection
    promptUser();
  }
}

async function viewAllEmployees() {
  try {
    // Fetch and display employees with their roles and departments
    const [rows] = await promisePool.query(`
    SELECT
      e.id,
      e.first_name,
      e.last_name,
      r.Title AS Role,
      d.name AS Department,
      e.salary,
      CONCAT(m.first_name, ' ', m.last_name) AS Manager
    FROM Employee e
    LEFT JOIN Roles r ON e.title_id = r.id
    LEFT JOIN Departments d ON e.department_id = d.id
    LEFT JOIN Employee m ON e.manager_id = m.id
    WHERE e.id > 300
  `);
    console.table(rows);
  } catch (error) {
    console.error('Error fetching employees:', error.message);
  } finally {
    // Prompt user again or end the connection
    promptUser();
  }
}
// Initial call to start the application

promptUser();





