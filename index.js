const inquirer = require("inquirer");

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

const promptUser = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "main",
      message: `What would you like to do?`,
      choices: mainChoices,
    },
  ]);
};

promptUser();
