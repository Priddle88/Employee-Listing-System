const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const { listenerCount } = require('process');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();
let newRole;
let newSalary;
let newDept;
let newerRole;
var departments;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mainQ = () => {
    inquirer
        .prompt([
            {
                type: "list",
                choices: ["View all Employees", "Add Employee", "Update Employee Role", "View all Roles", "Add Role", "View all Departments", "Add Department"],
                message: 'What would you like to do?',
                name: 'main',
            }
        ]).then((response) => {
            if (response.main == "View all Departments") {
                connection.query(
                    'SELECT * FROM department',
                    function (err, results) {
                        console.table(results);
                        mainQ();
                    }
                );
            }
            if (response.main == "View all Roles") {
                connection.query(
                    'SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id',
                    function (err, results) {
                        console.table(results);
                        mainQ();
                    }
                );
            }
            if (response.main == "View all Employees") {
                viewManager();
                connection.query(
                    `SELECT employee.id AS id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary, employee.manager_id AS manager
                    FROM employee
                    INNER JOIN role
                    ON employee.role_id = role.id
                    JOIN department ON role.department_id = department.id`,
                    function (err, results) {
                        console.table(results);
                        mainQ();
                    }
                );
            }
            if (response.main == "Add Department") {
                addDepartment();
            }
            if (response.main == "Add Role") {
                addRole();
            }

        })
}

addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'text',
                message: 'What is the name of the department?',
                name: 'dpmtName',
            }
        ]).then((response) => {
            connection.query(
                `INSERT INTO department (name)
                VALUES ("${response.dpmtName}")`,
                function (err, results) {
                    mainQ();
                }
            )
        })
}

viewManager = () => {

    connection.query(
        `UPDATE employee
        SET employee.manager_id = CONCAT(employee.first_name, " ", employee.last_name)
        WHERE manager_id = 1`,
        function (err, results) {

        }
    )
}

// addDepartment = () => {
//     inquirer
//         .prompt([
//             {
//                 type: 'text',
//                 message: 'What is the name of the department?',
//                 name: 'dpmtName',
//             }
//         ]).then((response) => {
//             connection.query(
//                 `INSERT INTO department (name)
//                 VALUES ("${response.dpmtName}")`,
//                 function (err, results) {
//                     mainQ();
//                 }
//             )
//         })
// }

addRole = () => {

    connection.query(`SELECT name FROM department`,
        function (err, results) {
            departments = results;
            console.log(`This is test: departments`);
            inquirer
                .prompt([
                    {
                        type: 'text',
                        message: 'What is the name of the role?',
                        name: 'roleName',
                    },
                    {
                        type: 'text',
                        message: 'What is the salary of this role?',
                        name: 'roleSalary',
                    },
                    {
                        type: 'list',
                        choices: departments,
                        message: 'What department does this role belong to?',
                        name: 'roleDepartment',
                    }
                ]).then((response) => {

                    newDept = response.roleDepartment;
                    newerRole = response.roleName;
                    newSalary = response.roleSalary;
                    // newRole = insertRole(newerRole);
                    // console.log(newRole);
                    console.log(newDept);
                    console.log(newerRole);
                    console.log(newSalary);
                    findDeptId(newDept, newerRole, newSalary);
                    console.log(findDeptId(newDept));

                    // insertRole(newerRole, newSalary, findDeptId(newDept));
                    // connection.query(
                    //     `INSERT INTO role (title, salary, department_id)
                    //     VALUES ("${response.roleName}", ${response.roleSalary}, ${response.roleDepartment})`,
                    //     function (err, results) {
                    //         mainQ();
                    //     }
                    // )

                    console.log(findDeptId(newDept) + " " + newSalary + newerRole);
                    // return newNum, newSalary, newerRole;
                })
        }
    )
}

findDeptId = (newDept, newerRole, newSalary) => {
    console.log(`Testing test test ${newerRole} ${newSalary}`);
    connection.query(
        `SELECT id
        FROM department
        WHERE name = "${newDept}"`,
        function (err, results) {
            let depId = results;
            newRole = depId[0].id;
            insertRole(newerRole, newSalary, newRole);
            console.log(depId[0].id);
            console.log("This is here");
        }
    )
}

insertRole = (newerRole, newSalary, newRole) => {
    console.log(`This is a new test test: ${newRole} ${newerRole} ${newSalary}`);
    connection.query(
        `INSERT INTO role (title, salary, department_id)
        VALUES ("${newerRole}", "${newSalary}", ${newRole})`,
        function (err, results) {
            // console.table(results);
        }
    )
}

// Connect to database
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`),
    mainQ()
);

app.get('/api/department', (req, res) => {
    const sql = 'SELECT * FROM department';

    connection.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

app.get('/api/role', (req, res) => {
    const sql = 'SELECT * FROM role';

    connection.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});