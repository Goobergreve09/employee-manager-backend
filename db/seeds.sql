INSERT INTO Departments (id, name)
VALUES  ( 01, "Sales" ),
        (02, "Finance"),
        (03, "Legal"),
        (04, "Engineering");

INSERT INTO Roles (id, title, department, salary)
VALUES
  (01, 'Sales Lead', 'Sales', 100000),
  (02, 'Salesperson', 'Sales', 80000),
  (03, 'Lead Engineer', 'Engineering', 150000),
  (04, 'Software Engineer', 'Engineering', 120000),
  (05, 'Account Manager', 'Finance', 160000),
  (06, 'Accountant', 'Finance', 125000),
  (07, 'Legal Team Lead', 'Legal', 250000),
  (08, 'Lawyer', 'Legal', 190000);