DROP DATABASE IF EXISTS employee_manager_db;
CREATE DATABASE employee_manager_db;

USE employee_manager_db;

CREATE TABLE Departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE Roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Title VARCHAR(30) NOT NULL,
  department_id INT,
  Salary INT NOT NULL DEFAULT 40000,
  FOREIGN KEY (department_id) REFERENCES Departments(id)
);

CREATE TABLE Employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  title_id INT,
  department_id INT,
  salary INT NOT NULL,
  manager_id INT,
  FOREIGN KEY (title_id) REFERENCES Roles(id),
    FOREIGN KEY (department_id) REFERENCES Departments(id),
  FOREIGN KEY (manager_id) REFERENCES Employee(id)
);