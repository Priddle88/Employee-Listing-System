const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const { listenerCount, exit } = require('process');
const inquirer = require('inquirer');
const { findIndex } = require('rxjs');

const PORT = process.env.PORT || 3001;
const app = express();
let newRole;
let newSalary;
let newDept;
let newerRole;
var departments;
let testNum = 0;
let empArray = [];
let roleArray = [];
let titleArray = [];
let managerArray = [];
let manArray = [];
let eName;
let eLast;
let eRole;
let eManager;
let empR = [];
let empN = [];
let listEmp = [];

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
            } else if (response.main == "View all Roles") {
                connection.query(
                    'SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id',
                    function (err, results) {
                        console.table(results);
                        mainQ();
                    }
                );
            } else if (response.main == "View all Employees") {
                viewManager();
                connection.query(
                    `SELECT employee.id AS id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary, employee.manager_id AS manager
                    FROM employee
                    INNER JOIN role
                    ON employee.role_id = role.id
                    JOIN department ON role.department_id = department.id
                    ORDER BY id`,
                    function (err, results) {
                        console.table(results);
                        mainQ();
                    }
                );
            } else if (response.main == "Add Department") {
                addDepartment();
            } else if (response.main == "Add Role") {
                addRole();
                console.log(`This is testNum: ${testNum}`);
            } else if (response.main == "Add Employee") {
                manArray = [];
                addEmployee();
                console.log(`This is testNum: ${testNum}`);
            } else if (response.main == "Update Employee Role") {
                // roleId();
                allEmp();
                empList();
            }

        })
}

mainMenu = (testNum) => {
    console.log(`Test num is equal to: ${testNum}`);
    if (testNum = 1) {
        mainQ();
    }
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

    // connection.query(
    //     `SELECT employee.id as manager
    //      FROM employee
    //       JOIN employee
    //       ON employee.manager_id = employee.id`,
    //     function (err, results) {
    //         console.log(results);
    //     }
    // )

    connection.query(
        `UPDATE employee
        SET employee.manager_id = CONCAT(employee.first_name, " ", employee.last_name)
        WHERE employee.manager_id > 0 `,
        function (err, results) {
            console.log(results);
        }
    )
}

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
    connection.query(
        `INSERT INTO role (title, salary, department_id)
        VALUES ("${newerRole}", "${newSalary}", ${newRole})`,
        function (err, results) {
            // console.table(results);
            testNum++;
            console.log(`This is testNum: ${testNum}`);
            console.log(`This is a new test test: ${newRole} ${newerRole} ${newSalary}`);
            if (testNum == 3) {
                mainQ();
            }
        }
    )
}

addEmployee = () => {
    selectRole();
}

selectRole = () => {
    viewManager();
    connection.query(`SELECT role.title AS title, employee.manager_id AS manager
     FROM role
     JOIN employee
     ON role.id = employee.id
     `,
        function (err, results) {


            // console.table(results);
            // console.log(results);
            titleArray = [];
            results.map((i) => {
                console.log(i.title);
                titleArray.push(i.title);
            });

            results.map((i) => {
                console.log(i.manager);
                managerArray.push(i.manager);
            });

            // console.log(manArray);
            let tst = managerTest();
            console.log(tst);
            console.log(`THIS IS WHAT I WANT TO LOOK AT ${manArray}`);
            manArray.push("null");
            managerArray = managerArray.filter(i => {
                return i !== null;
            })
            // console.log(titleArray);
            // console.log(managerArray);
            inquirer
                .prompt([
                    {
                        type: 'text',
                        message: 'What is the your first name?',
                        name: 'empName',
                    },
                    {
                        type: 'text',
                        message: 'What is the your last name?',
                        name: 'empLast',
                    },
                    {
                        type: 'list',
                        choices: titleArray,
                        message: 'What is your role?',
                        name: 'empRole',
                    },
                    {
                        type: 'list',
                        choices: manArray,
                        message: 'Who is your manager?',
                        name: 'empManager',
                    }
                ]).then((response) => {
                    console.log(`${response.empName} ${response.empLast} ${response.empRole} ${response.empManager}`);
                    eName = response.empName;
                    eLast = response.empLast;
                    eRole = response.empRole;
                    eManager = response.empManager;

                    fixRole(eRole, eName, eLast, eManager);
                })
        })
};

managerTest = () => {
    connection.query(
        `SELECT CONCAT(employee.first_name, " ", employee.last_name) as manager
        FROM employee
        WHERE role_id = 1`,
        function (err, results) {
            results.forEach(i => manArray.push(i.manager));
        }
    )
}

fixRole = (x, y, z, a) => {
    connection.query(
        `SELECT id
        FROM role
        WHERE title = ?`, [x],
        function (err, results) {
            let depId = results;
            newRole = depId[0].id;
            insertEmployee(y, z, newRole, a);
            console.log(newRole, y, z, a);
            return;
        }
    )
};

fixRoleAgain = (x) => {
    connection.query(
        `SELECT id
        FROM role
        WHERE title = ?`, [x],
        function (err, results) {

        })
}

insertEmployee = (first, last, role, manager) => {
    connection.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ("${first}", "${last}", ${role}, "${manager}")`,
        function (err, results) {
            // console.table(results);
            testNum++;
            console.log(`This is testNum: ${testNum}`);
            console.log(`This is a new test test: ${first}, ${last}, ${role}, ${manager}`);
            if (testNum >= 1) {
                mainQ();
            }
            return;
        }
    )
};

fixManager = (x) => {
    connection.query(
        `UPDATE employee
        SET employee.manager_id = employee.id
        WHERE CONCAT(employee.first_name, " ", employee.last_name) = ?`, [x],
        function (err, results) {

        }
    )
};

roleId = () => {
    connection.query(
        `SELECT role.title as title FROM role`,
        function (err, results) {
            console.log(results);
            // results.forEach(i => roleArray.push(i.title));
        })
}

empList = () => {
    connection.query(
        `SELECT employee.first_name as employees, role.title AS title
         FROM employee
         JOIN role
         ON role.id = employee.id`,
        function (err, results) {
            results.forEach(i => empArray.push(i.employees));
            results.forEach(i => roleArray.push(i.title));
            console.log(empArray);

            empPrompts();
            // console.log(`${empR[0]} and ${empN[0]}`);
        }
    )
}

empPrompts = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                choices: listEmp,
                message: 'Select an employee to update',
                name: 'empName',
            },
            {
                type: 'list',
                choices: roleArray,
                message: 'What is their role?',
                name: 'empRole',
            }
        ]).then((response) => {
            empN = [];
            empR = [];
            empN.push(response.empName);
            empR.push(response.empRole);
            findRoleId();
            // console.log(`${empR} and ${empN}`);

            // connection.query(
            //     `SELECT id
            //     FROM role
            //     WHERE title = "empArray"`,
            //     function (err, results) {
            //         // console.log(`IMPORTANT: ${x} + ${y}`);
            //         console.log(results);
            //         console.log(` and ${empN}`);
            //         mainQ();
            //     }
            // )
        })
}

findRoleId = () => {
    connection.query(
        `SELECT id
        FROM role
        WHERE title = "${empR}"`,
        function (err, results) {
            // console.log(`IMPORTANT: ${x} + ${y}`);
            console.log(results[0].id);
            console.log(`${results[0].id} and ${empN}`);
            connection.query(
                `UPDATE employee
                SET employee.role_id = ${results[0].id} 
                WHERE employee.first_name = "${empN}"`,
                function (err, results) {
                    console.log(results);
                    mainQ();
                })

        }
    )
}

updateEmp = (x, y) => {
    console.log(`IMPORTANT: ${x} + ${y}`);
    connection.query(
        `UPDATE employee
        SET employee.role_id = ?
        WHERE employee.first_name = ?`, [y, x],
        function (err, results) {
            console.log(`IMPORTANT: ${x} + ${y}`);
            mainQ();
        }
    )
};

allEmp = () => {
    connection.query(
        `SELECT first_name FROM employee`,
        function (err, results) {
            // console.log(results[0].first_name);
            listEmp = [];
            console.log(results[0].first_name);
            results.forEach(i => listEmp.push(i.first_name));
            console.log(listEmp);
            console.log(`END of This`);
        })
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

app.get('/api/employee', (req, res) => {
    const sql = 'SELECT * FROM employee';

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