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

async function viewAllRoles() {
  try {
    // Fetch and display roles with department names
    const [rows] = await promisePool.query(`
      SELECT r.id, r.Title, d.name AS Department, r.Salary
      FROM Roles r
      JOIN Departments d ON r.department_id = d.id
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
    `);

    console.table(rows);
  } catch (error) {
    console.error('Error fetching employees:', error.message);
  } finally {
    // Prompt user again or end the connection
    promptUser();
  }
}

async function addEmployee() {
  try {
    // Fetch roles and departments
    const [roles] = await promisePool.query('SELECT id, Title FROM Roles');
    const [departments] = await promisePool.query('SELECT id, name FROM Departments');
    const [managers] = await promisePool.query('SELECT id, CONCAT(first_name, " ", last_name) AS manager_name FROM Employee WHERE manager_id IS NULL');
    managers.unshift({ id: null, manager_name: 'No Manager' });
    
    // Prompt user for employee details
    const employeeData = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter employee's first name:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter employee's last name:",
      },
      {
        type: "list",
        name: "roleId",
        message: "Select employee's role:",
        choices: roles.map(role => ({ name: role.Title, value: role.id }))
      },
      {
        type: "list",
        name: "departmentId",
        message: "Select employee's department:",
        choices: departments.map(department => ({ name: department.name, value: department.id }))
      },
      {
        type: "input",
        name: "salary",
        message: "Enter employee's salary:",
      },
      {
        type: "list",
        name: "managerId",
        message: "Select employee's manager:",
        choices: managers.map(manager => ({ name: manager.manager_name, value: manager.id }))
      },
    ]);

    // Add the employee to the database
    await promisePool.execute(
      'INSERT INTO Employee (first_name, last_name, title_id, department_id, salary, manager_id) VALUES (?, ?, ?, ?, ?, ?)',
      [employeeData.firstName, employeeData.lastName, employeeData.roleId, employeeData.departmentId, employeeData.salary, employeeData.managerId]
    );

    console.log('Employee', employeeData.firstName, employeeData.lastName, 'added successfully!');
  } catch (error) {
    console.error('Error adding employee:', error.message);
  } finally {
    // Prompt user again or end the connection
    promptUser();
  }
}
async function updateEmployeeRole() {
  try {
    // Fetch employee list, roles, departments, and managers
    const [employees] = await promisePool.query('SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM Employee');
    const [roles] = await promisePool.query('SELECT id, Title, department_id FROM Roles');
    const [departments] = await promisePool.query('SELECT id, name FROM Departments');
    const [managers] = await promisePool.query('SELECT id, CONCAT(first_name, " ", last_name) AS manager_name FROM Employee');

    // Prompt user for employee, new role, new department, new salary, and new manager details
    const updateData = await inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Select employee to update:",
        choices: employees.map(employee => ({ name: employee.employee_name, value: employee.id })),
      },
      {
        type: "list",
        name: "newRoleId",
        message: "Select employee's new role:",
        choices: roles.map(role => ({ name: role.Title, value: role.id })),
      },
      {
        type: "list",
        name: "newDepartmentId",
        message: "Select employee's new department:",
        choices: departments.map(department => ({ name: department.name, value: department.id })),
      },
      {
        type: "input",
        name: "newSalary",
        message: "Enter employee's new salary:",
      },
      {
        type: "list",
        name: "newManagerId",
        message: "Select employee's new manager:",
        choices: [...managers.map(manager => ({ name: manager.manager_name, value: manager.id })), { name: "No Manager", value: null }],
      },
    ]);

    // Update the employee's role, department, salary, and manager in the database
    const [result] = await promisePool.query(
      'UPDATE Employee SET title_id = ?, department_id = ?, salary = ?, manager_id = ? WHERE id = ?',
      [updateData.newRoleId, updateData.newDepartmentId, updateData.newSalary, updateData.newManagerId, updateData.employeeId]
    );

    console.log('Employee role, department, salary, and manager updated successfully!');
  } catch (error) {
    console.error('Error updating employee details:', error.message);
  } finally {
    // Prompt user again or end the connection
    promptUser();
  }
}

async function addRole() {
  try {
    // Fetch department list
    const [departments] = await promisePool.query('SELECT id, name FROM Departments');

    // Prompt user for new role details
    const roleData = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the new role title:",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the new role salary:",
      },
      {
        type: "list",
        name: "departmentId",
        message: "Select the department for the new role:",
        choices: departments.map(department => ({ name: department.name, value: department.id })),
      },
    ]);

    // Insert the new role into the database
    const [result] = await promisePool.query(
      'INSERT INTO Roles (Title, Salary, department_id) VALUES (?, ?, ?)',
      [roleData.title, roleData.salary, roleData.departmentId]
    );

    if (result.affectedRows > 0) {
      console.log('New role added successfully!');
    } else {
      console.log('Role not added. Please check your input.');
    }
  } catch (error) {
    console.error('Error adding new role:', error.message);
  } finally {
    // Prompt user again or end the connection
    promptUser();
  }
}
// Initial call to start the application

promptUser();





