const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const { listenerCount } = require('process');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mainQ = () => {
    inquirer
        .prompt([
            {
                type: "list",
                choices: ["Add Department", "Add Role", "Add Employee"],
                message: 'What would you like to do?',
                name: 'main',
            }
        ]).then((response) => {
            if (response.main == "Add Department") {
                addDepartment();
            }

        })
}

addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'text',
                message: 'What is the name of the department?',
                name: 'department',
            }
        ]).then((response) => {
                
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
    mainQ(),
    console.log(`Connected to the employees_db database.`)
);

// console.table(db.department);

connection.query(
    'SELECT * FROM department',
    ['Page', 45],
    function(err, results) {
      console.table(results);
    }
  );

// mainQ = () => {
//     inquirer
//         .prompt([
//             {
//                 type: list,
//                 choices: ["Add Department", "Add Role", "Add Employee"],
//                 message: 'What would you like to do?',
//                 name: 'main',
//             }
//         ]).then((response) => {
//             if (response.main == "Add Department") {
//                 // addDepartment();
//                 console.table(db.department);
//             }

//         })
// }

// addDepartment = () => {
//     inquirer
//         .prompt([
//             {
//                 type: text,
//                 message: 'What is the name of the department?',
//                 name: 'department',
//             }
//         ]).then((response) => {
            

//         })
// }