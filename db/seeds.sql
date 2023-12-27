INSERT INTO Departments (name)
VALUES
  ('Sales'),
  ('Finance'),
  ( 'Legal'),
  ( 'Engineering');

INSERT INTO Roles (Title, department_id, Salary)
VALUES
  ('Sales Lead', 1, 100000),
  ('Salesperson', 1, 80000),
  ('Lead Engineer', 4, 150000),
  ('Software Engineer', 4, 120000),
  ('Account Manager', 2, 160000),
  ('Accountant', 2, 125000),
  ('Legal Team Lead', 3, 250000),
  ('Lawyer', 3, 190000);

INSERT INTO Employee (first_name, last_name, salary, manager_id)
VALUES
  ('John', 'Doe',  100000, NULL),
  ('Mike', 'Chan',  80000, 1),
  ('Ashley', 'Rodriguez', 150000, NULL),
  ('Kevin', 'Tupik', 120000, 3),
  ('Kunal', 'Singh', 160000, NULL),
  ('Malia', 'Brown', 125000, 5),
  ('Sarah', 'Lourd', 250000, NULL),
  ('Tom', 'Allen',  190000, 7);