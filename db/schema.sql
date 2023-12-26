DROP DATABASE IF EXISTS employee_manager_db;
CREATE DATABASE employee_manager_db;

USE employee_manager_db;

CREATE TABLE Departments (
  id INT NOT NULL,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE Role (
  id PRIMARY KEY,
  Title VARCHAR(100) NOT NULL,
  Salary DECIMAL NOT NULL,
  department_id INT NOT NULL

);

CREATE TABLE  Employee (
  id PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NOT NULL
)