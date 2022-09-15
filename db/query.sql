-- SELECT department.name AS department, role.title
-- FROM role
-- ON role.department_id = department.id;

-- (SELECT employee.id, first_name, last_name, role.title AS title, department.name AS department, role.salary, CONCAT(employee.first_name, " ", employee.last_name) AS manager FROM employee INNER JOIN role
-- ON employee.role_id = role.id
-- JOIN department ON role.department_id = department.id WHERE manager_id = 1)
-- JOIN
-- (SELECT employee.id AS id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary, employee.manager_id AS manager
-- FROM employee
-- INNER JOIN role
-- ON employee.role_id = role.id
-- JOIN department ON role.department_id = department.id)


-- SELECT employee.id AS id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary, employee.manager_id AS manager
-- FROM employee
-- INNER JOIN role
-- ON employee.role_id = role.id
-- JOIN department ON role.department_id = department.id;


-- INSERT INTO employee (manager_id) 
-- VALUES (employee.first_name)
-- WHERE employee.manager_id > 0;
-- UPDATE employee
-- SET employee.manager_id = CONCAT(employee.first_name, " ", employee.last_name)
-- WHERE manager_id = 1;

-- SELECT name FROM department;

-- SELECT CONCAT(employee.first_name, " ", employee.last_name) as manager
--         FROM employee
--         WHERE role_id = 1;

-- UPDATE employee
-- SET employee.manager_id = CONCAT(employee.first_name, " ", employee.last_name)
-- WHERE employee.manager_id > 0;

-- SELECT CONCAT(employee.first_name, " ", employee.last_name) as manager
--          FROM employee
--          WHERE employee.role_id = 1,

-- SELECT id, CONCAT(employee.first_name, " ", employee.last_name) AS manager
-- FROM employee
-- WHERE role_id = 1

-- UPDATE employee
-- SET employee.manager_id = results
-- WHERE employee.manager_id > 0;

-- SELECT * FROM employee;

-- SELECT CONCAT(employee.first_name, " ", employee.last_name) as employees, role.title AS title
--         FROM employee
--         JOIN role
--         ON role.id = employee.id

-- `SELECT employee.first_name as employees, role.title AS title
--         FROM employee
--         JOIN role
--         ON role.id = employee.id

-- SELECT id
-- FROM role
-- WHERE title = "Manager"

SELECT first_name FROM employee;

-- UPDATE employee
-- SET employee.role_id = 1
-- WHERE employee.first_name = "Spider";