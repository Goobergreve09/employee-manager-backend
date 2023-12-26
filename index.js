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
    const [rows, fields] = await promisePool.query('SELECT * FROM Departments');
    console.table(rows);
  } catch (error) {
    console.error('Error fetching departments:', error.message);
  }
  // Prompt user again after displaying the table
  await promptUser();
};

const viewAllRoles = async () => {
  try {
    const [rows, fields] = await promisePool.query('SELECT * FROM Roles');
    console.table(rows);
  } catch (error) {
    console.error('Error fetching departments:', error.message);
  }
  // Prompt user again after displaying the table
  await promptUser();
};
// Initial call to start the application

promptUser();





