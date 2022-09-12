-- SELECT department.name AS department, role.title
-- FROM role
-- ON role.department_id = department.id;

SELECT employee.id AS id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary, employee.manager_id AS manager
FROM employee
INNER JOIN role
ON employee.role_id = role.id
JOIN department ON role.department_id = department.id;
