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


SELECT employee.id AS id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary, employee.manager_id AS manager
FROM employee
INNER JOIN role
ON employee.role_id = role.id
JOIN department ON role.department_id = department.id;

UPDATE employee
SET employee.manager_id = CONCAT(employee.first_name, " ", employee.last_name)
WHERE manager_id = 1;