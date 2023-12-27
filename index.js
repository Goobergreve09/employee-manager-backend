const inquirer = require("inquirer");
const promisePool = require("./config/connection");

const mistake = "If you wish to exit the prompt, PUSH Ctrl + C to Exit.";
const mistakeYellow = `\x1b[33m${mistake}\x1b[0m`;

const mainChoices = [
  "View All Employees",
  "View Employees by Manager",
  "View Employees by Department",
  "Add Employee",
  "Update Employee Role",
  "Delete Employee",
  "View All Roles",
  "Add Role",
  "Delete Role",
  "View All Departments",
  "Add Department",
  "Delete Department",
  "Total Utilized Budget by Department",
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
  //The switch method here is creating a series of clauses, when the answer is selected, then the function
  //will be executed.
  switch (answers.main) {
    case "View All Employees":
      await viewAllEmployees();
      break;

    case "View Employees by Manager":
      await viewEmployeebyManager();
      break;

    case "View Employees by Department":
      await viewEmployeebyDepartment();
      break;

    case "Add Employee":
      await addEmployee();
      break;

    case "Update Employee Role":
      await updateEmployeeRole();
      break;

    case "Delete Employee":
      await deleteEmployee();
      break;

    case "View All Roles":
      await viewAllRoles();
      break;

    case "Add Role":
      await addRole();
      break;

    case "Delete Role":
      await deleteRole();
      break;

    case "View All Departments":
      await viewAllDepartments();
      break;

    case "Add Department":
      await addDepartment();
      break;

    case "Delete Department":
      await deleteDepartment();
      break;

    case "Total Utilized Budget by Department":
      await viewTotalSalaryByDepartment();
      break;

    case "Quit":
      console.log("Quitting...");
      process.exit();

    default:
      console.log("Invalid choice");
  }
};

const viewAllDepartments = async () => {
  try {
    const [rows, fields] = await promisePool.query("SELECT * FROM Departments");
    console.table(rows);
  } catch (error) {
    console.error("Error fetching departments:", error.message);
  }
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
    console.error("Error fetching roles:", error.message);
  } finally {
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
    console.error("Error fetching employees:", error.message);
  } finally {
    promptUser();
  }
}

async function addEmployee() {
  try {
    const [roles] = await promisePool.query("SELECT id, Title FROM Roles");
    const [departments] = await promisePool.query(
      "SELECT id, name FROM Departments"
    );
    const [managers] = await promisePool.query(
      'SELECT id, CONCAT(first_name, " ", last_name) AS manager_name FROM Employee WHERE manager_id IS NULL'
    );
    managers.unshift({ id: null, manager_name: "No Manager" });
    //unshift is adding "No Manager" to the front of the managers array with an id of null

    // Prompt user for employee information
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
        choices: roles.map((role) => ({ name: role.Title, value: role.id })),
        //name is set to the roles title and value is set to the roles ID
        //role is the placeholder being used for an element being sent back from the roles array
      },
      {
        type: "list",
        name: "departmentId",
        message: "Select employee's department:",
        choices: departments.map((department) => ({
          name: department.name,
          value: department.id,
        })),
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
        choices: managers.map((manager) => ({
          name: manager.manager_name,
          value: manager.id,
        })),
      },
    ]);

    // Add the employee to the database
    await promisePool.execute(
      "INSERT INTO Employee (first_name, last_name, title_id, department_id, salary, manager_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        employeeData.firstName,
        employeeData.lastName,
        employeeData.roleId,
        employeeData.departmentId,
        employeeData.salary,
        employeeData.managerId,
      ]
    );

    console.log(
      "Employee",
      employeeData.firstName,
      employeeData.lastName,
      "added successfully!"
    );
  } catch (error) {
    console.error("Error adding employee:", error.message);
  } finally {
    promptUser();
  }
}
async function updateEmployeeRole() {
  try {
    // Fetch employee list, roles, departments, and managers
    const [employees] = await promisePool.query(
      'SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM Employee'
    );
    const [roles] = await promisePool.query(
      "SELECT id, Title, department_id FROM Roles"
    );
    const [departments] = await promisePool.query(
      "SELECT id, name FROM Departments"
    );
    const [managers] = await promisePool.query(
      'SELECT id, CONCAT(first_name, " ", last_name) AS manager_name FROM Employee'
    );

    // Prompt user for employee, new role, new department, new salary, and new manager details
    const updateData = await inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Select employee to update:",
        choices: employees.map((employee) => ({
          name: employee.employee_name,
          value: employee.id,
        })),
      },
      {
        type: "list",
        name: "newRoleId",
        message: "Select employee's new role:",
        choices: roles.map((role) => ({ name: role.Title, value: role.id })),
      },
      {
        type: "list",
        name: "newDepartmentId",
        message: "Select employee's new department:",
        choices: departments.map((department) => ({
          name: department.name,
          value: department.id,
        })),
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
        choices: [
          ...managers.map((manager) => ({
            name: manager.manager_name,
            value: manager.id,
          })),
          { name: "No Manager", value: null },
        ],
      },
    ]);

    // Update the employee's role, department, salary, and manager in the database
    const [result] = await promisePool.query(
      "UPDATE Employee SET title_id = ?, department_id = ?, salary = ?, manager_id = ? WHERE id = ?",
      [
        updateData.newRoleId,
        updateData.newDepartmentId,
        updateData.newSalary,
        updateData.newManagerId,
        updateData.employeeId,
      ]
    );

    console.log(
      "Employee role, department, salary, and manager updated successfully!"
    );
  } catch (error) {
    console.error("Error updating employee details:", error.message);
  } finally {
    promptUser();
  }
}

async function addRole() {
  try {
    const [departments] = await promisePool.query(
      "SELECT id, name FROM Departments"
    );

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
        choices: departments.map((department) => ({
          name: department.name,
          value: department.id,
        })),
      },
    ]);

    // Insert the new role into the database
    const [result] = await promisePool.query(
      "INSERT INTO Roles (Title, Salary, department_id) VALUES (?, ?, ?)",
      [roleData.title, roleData.salary, roleData.departmentId]
    );

    if (result.affectedRows > 0) {
      console.log("New role added successfully!");
    } else {
      console.log("Role not added. Please check your input.");
    }
  } catch (error) {
    console.error("Error adding new role:", error.message);
  } finally {
    promptUser();
  }
}

async function addDepartment() {
  try {
    // Prompt user for new department details
    const departmentData = await inquirer.prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Enter the new department name:",
      },
    ]);

    // Insert the new department into the database
    const [result] = await promisePool.query(
      "INSERT INTO Departments (name) VALUES (?)",
      [departmentData.departmentName]
    );

    console.log("Department added successfully!");
  } catch (error) {
    console.error("Error adding department:", error.message);
  } finally {
    promptUser();
  }
}

const viewEmployeebyManager = async () => {
  // also the same as 'async function viewEmployeebyManager () {'
  try {
    const [managers] = await promisePool.query(
      'SELECT id, CONCAT(first_name, " ", last_name) AS manager_name FROM Employee WHERE manager_id IS NULL'
    );

    const managerSelection = await inquirer.prompt({
      type: "list",
      name: "managerId",
      message: "Select a manager:",
      choices: managers.map((manager) => ({
        name: manager.manager_name,
        value: manager.id,
      })),
    });

    // Fetch and display employees with their roles and departments for the selected manager
    const [rows] = await promisePool.query(
      `
      SELECT
        e.id,
        e.first_name,
        e.last_name,
        r.Title AS Role,
        d.name AS Department,
        e.salary
      FROM Employee e
      LEFT JOIN Roles r ON e.title_id = r.id
      LEFT JOIN Departments d ON e.department_id = d.id
      WHERE e.manager_id = ?;
    `,
      [managerSelection.managerId]
    );

    console.table(rows);
  } catch (error) {
    console.error("Error fetching employees by manager:", error.message);
  } finally {
    promptUser();
  }
};

const viewEmployeebyDepartment = async () => {
  try {
    const [departments] = await promisePool.query(
      "SELECT id, name FROM Departments"
    );

    const departmentSelection = await inquirer.prompt({
      type: "list",
      name: "departmentId",
      message: "Select a department:",
      choices: departments.map((department) => ({
        name: department.name,
        value: department.id,
      })),
    });

    // Fetch and display employees with their roles and departments for the selected department
    const [rows] = await promisePool.query(
      `
      SELECT
        e.id,
        e.first_name,
        e.last_name,
        r.Title AS Role,
        d.name AS Department,
        e.salary
      FROM Employee e
      LEFT JOIN Roles r ON e.title_id = r.id
      LEFT JOIN Departments d ON e.department_id = d.id
      WHERE e.department_id = ?;
    `,
      [departmentSelection.departmentId]
    );

    console.table(rows);
  } catch (error) {
    console.error("Error fetching employees by department:", error.message);
  } finally {
    promptUser();
  }
};

const deleteEmployee = async () => {
  try {
    const [employees] = await promisePool.query(
      'SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM Employee'
    );

    const employeeSelection = await inquirer.prompt({
      type: "list",
      name: "employeeId",
      message: `Select an employee to delete: ${mistakeYellow}`,
      choices: employees.map((employee) => ({
        name: employee.employee_name,
        value: employee.id,
      })),
    });
    // Delete the selected employee from the database
    await promisePool.query("DELETE FROM Employee WHERE id = ?", [
      employeeSelection.employeeId,
    ]);

    console.log("Employee deleted successfully!");
  } catch (error) {
    console.error("Error deleting employee:", error.message);
  } finally {
    promptUser();
  }
};

const deleteRole = async () => {
  try {
    // Fetch and display a list of roles
    const [roles] = await promisePool.query("SELECT id, Title FROM Roles");

    // Prompt user to select a role to delete
    const roleSelection = await inquirer.prompt({
      type: "list",
      name: "roleId",
      message: `Select a role to delete: ${mistakeYellow}`,
      choices: roles.map((role) => ({ name: role.Title, value: role.id })),
    });

    // Delete the selected role from the database
    await promisePool.query("DELETE FROM Roles WHERE id = ?", [
      roleSelection.roleId,
    ]);

    console.log("Role deleted successfully!");
  } catch (error) {
    console.error("Error deleting role:", error.message);
  } finally {
    // Prompt user again or end the connection
    promptUser();
  }
};
const deleteDepartment = async () => {
  try {
    const [departments] = await promisePool.query(
      "SELECT id, name FROM Departments"
    );

    const departmentSelection = await inquirer.prompt({
      type: "list",
      name: "departmentId",
      message: `Select a department to delete: ${mistakeYellow}`,
      choices: departments.map((department) => ({
        name: department.name,
        value: department.id,
      })),
    });

    await promisePool.query("DELETE FROM Departments WHERE id = ?", [
      departmentSelection.departmentId,
    ]);

    console.log("Department deleted successfully!");
  } catch (error) {
    console.error("Error deleting department:", error.message);
  } finally {
    promptUser();
  }
};

const viewTotalSalaryByDepartment = async () => {
  try {
    const [departments] = await promisePool.query(
      "SELECT id, name FROM Departments"
    );

    const departmentChoice = await inquirer.prompt({
      type: "list",
      name: "departmentId",
      message: "Select a department:",
      choices: departments.map((department) => ({
        name: department.name,
        value: department.id,
      })),
    });

    // Fetch and display the total salary sum for the selected department
    const [rows] = await promisePool.query(
      `
      SELECT d.name AS Department, SUM(e.salary) AS TotalSalary
      FROM Employee e
      JOIN Departments d ON e.department_id = d.id
      WHERE e.department_id = ?
      GROUP BY e.department_id
    `,
      [departmentChoice.departmentId]
    );

    console.table(rows);
  } catch (error) {
    console.error("Error fetching total salary by department:", error.message);
  } finally {
    // Prompt user again or end the connection
    promptUser();
  }
};
// Initial call to start the application

promptUser();
