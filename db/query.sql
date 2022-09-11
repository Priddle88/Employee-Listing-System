SELECT department.name AS department, role.title
FROM role
ON role.department_id = department.id;