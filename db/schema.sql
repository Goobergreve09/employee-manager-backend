DROP DATABASE IF EXISTS employee_manager_db;
CREATE DATABASE employee_manager_db;

USE employee_manager_db;

CREATE TABLE Departments (
  id INT NOT NULL,
  name VARCHAR(100) NOT NULL
);