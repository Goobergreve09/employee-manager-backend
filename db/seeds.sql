INSERT INTO Departments (id, name)
VALUES
  (101, 'Sales'),
  (102, 'Finance'),
  (103, 'Legal'),
  (104, 'Engineering');

INSERT INTO Roles (id, Title, department_id, Salary)
VALUES
  (201, 'Sales Lead', 101, 100000),
  (202, 'Salesperson', 101, 80000),
  (203, 'Lead Engineer', 104, 150000),
  (204, 'Software Engineer', 104, 120000),
  (205, 'Account Manager', 102, 160000),
  (206, 'Accountant', 102, 125000),
  (207, 'Legal Team Lead', 103, 250000),
  (208, 'Lawyer', 103, 190000);

INSERT INTO Employee (id, first_name, last_name, title_id, department_id, salary, manager_id)
VALUES
  (301, 'John', 'Doe', 201, 101, 100000, NULL),
  (302, 'Mike', 'Chan', 202, 101, 80000, 301),
  (303, 'Ashley', 'Rodriguez', 203, 104, 150000, NULL),
  (304, 'Kevin', 'Tupik', 204, 104, 120000, 303),
  (305, 'Kunal', 'Singh', 205, 102, 160000, NULL),
  (306, 'Malia', 'Brown', 206, 102, 125000, 305),
  (307, 'Sarah', 'Lourd', 207, 103, 250000, NULL),
  (308, 'Tom', 'Allen', 208, 103, 190000, 307);