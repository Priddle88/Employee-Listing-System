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

// Main menu of the page. Where everything begins
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

// Goes to the main menu after a testnum is equal to 3
mainMenu = (testNum) => {
    console.log(`Test num is equal to: ${testNum}`);
    if (testNum = 1) {
        mainQ();
    }
}

// Adds a department
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

// Views the managers
viewManager = () => {

    connection.query(
        `UPDATE employee
        SET employee.manager_id = CONCAT(employee.first_name, " ", employee.last_name)
        WHERE employee.manager_id > 0 `,
        function (err, results) {
            console.log(results);
        }
    )
}

// Adds a role
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
                    console.log(newDept);
                    console.log(newerRole);
                    console.log(newSalary);
                    findDeptId(newDept, newerRole, newSalary);
                    console.log(findDeptId(newDept));

                    console.log(findDeptId(newDept) + " " + newSalary + newerRole);
                })
        }
    )
}

// Finds a department id based off a department name
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

// Creates a new role
insertRole = (newerRole, newSalary, newRole) => {
    connection.query(
        `INSERT INTO role (title, salary, department_id)
        VALUES ("${newerRole}", "${newSalary}", ${newRole})`,
        function (err, results) {
            testNum++;
            console.log(`This is testNum: ${testNum}`);
            console.log(`This is a new test test: ${newRole} ${newerRole} ${newSalary}`);
            if (testNum == 3) {
                mainQ();
            }
        }
    )
}

// Creates the employees
addEmployee = () => {
    viewManager();
    connection.query(`SELECT role.title AS title, employee.manager_id AS manager
     FROM role
     JOIN employee
     ON role.id = employee.id
     `,
        function (err, results) {

            titleArray = [];
            results.map((i) => {
                console.log(i.title);
                titleArray.push(i.title);
            });

            results.map((i) => {
                console.log(i.manager);
                managerArray.push(i.manager);
            });


            let tst = managerTest();
            console.log(tst);
            console.log(`THIS IS WHAT I WANT TO LOOK AT ${manArray}`);
            manArray.push("null");
            managerArray = managerArray.filter(i => {
                return i !== null;
            });

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

// Creates a list of managers
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

// recieves and returns an id for role
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

// gets the id for a role
fixRoleAgain = (x) => {
    connection.query(
        `SELECT id
        FROM role
        WHERE title = ?`, [x],
        function (err, results) {

        })
}

// Creates a new employee
insertEmployee = (first, last, role, manager) => {
    connection.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ("${first}", "${last}", ${role}, "${manager}")`,
        function (err, results) {
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

// Fixes the managers names to be where they should
fixManager = (x) => {
    connection.query(
        `UPDATE employee
        SET employee.manager_id = employee.id
        WHERE CONCAT(employee.first_name, " ", employee.last_name) = ?`, [x],
        function (err, results) {

        }
    )
};

// Gets roles
roleId = () => {
    connection.query(
        `SELECT role.title as title FROM role`,
        function (err, results) {
            console.log(results);
        })
}

// List of roles 
empList = () => {
    connection.query(
        `SELECT role.title AS title
         FROM role`,
        function (err, results) {
            roleArray = [];
            results.forEach(i => roleArray.push(i.title));

            empPrompts();
        }
    )
}

// Prompts to update the role for an employee
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
        })
}

// Updates the employee role for a specific employee
findRoleId = () => {
    connection.query(
        `SELECT id
        FROM role
        WHERE title = "${empR}"`,
        function (err, results) {
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

// Updates the employee role for a specific employee
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

// Fills an array of all employess
allEmp = () => {
    connection.query(
        `SELECT first_name FROM employee`,
        function (err, results) {
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

// Send the data of departments
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

// Send the data of roles
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

// Send the data of employee
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

// Launch the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});