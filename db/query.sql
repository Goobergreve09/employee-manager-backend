SELECT
    Employee.id AS 'Employee ID',
    Employee.first_name AS 'First Name',
    Employee.last_name AS 'Last Name',
    Roles.title AS 'Job Title',
    Departments.name AS 'Department',
    Roles.salary AS 'Salary',
    CONCAT(Manager.first_name, ' ', Manager.last_name) AS 'Manager'
FROM
    Employee
JOIN
    Roles ON Employee.title = Roles.title
JOIN
    Departments ON Roles.department = Departments.name
LEFT JOIN
    Employee AS Manager ON Employee.manager = Manager.id;