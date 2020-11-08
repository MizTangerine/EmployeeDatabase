// ***require packages
const mysql = require('mysql');
const inquirer = require('inquirer');
const dotenv = require('dotenv').config();
const cTable = require('console.table');

const questions = require('./questions.js');

const clog = console.log

// ***create mysql connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.password,
    database: 'employee_db'
});

// ***connect to mysql, has header
connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Welcome to...');

    console.log('   ___  ___ ___  ____   _       ___   __ __    ___    ___ ');
    console.log('  \/  _]|   |   ||    \\ | |     \/   \\ |  |  |  \/  _]  \/  _]');
    console.log(' \/  [_ | _   _ ||  o  )| |    |     ||  |  | \/  [_  \/  [_ ');
    console.log('|    _]|  \\_\/  ||   _\/ | |___ |  O  ||  ~  ||    _]|    _]');
    console.log('|   [_ |   |   ||  |   |     ||     ||___, ||   [_ |   [_ ');
    console.log('|     ||   |   ||  |   |     ||     ||     ||     ||     |');
    console.log('|_____||___|___||__|   |_____| \\___\/ |____\/ |_____||_____|');
    console.log('                                                          ');
    console.log('     ___ ___   ____  ____    ____   ____    ___  ____     ');
    console.log('    |   |   | \/    ||    \\  \/    | \/    |  \/  _]|    \\    ');
    console.log('    | _   _ ||  o  ||  _  ||  o  ||   __| \/  [_ |  D  )   ');
    console.log('    |  \\_\/  ||     ||  |  ||     ||  |   |    _]|    \/    ');
    console.log('    |   |   ||  _  ||  |  ||  _  ||  |_. |   [_ |    \\    ');
    console.log('    |   |   ||  |  ||  |  ||  |  ||     ||     ||  .  \\   ');
    console.log('    |___|___||__|__||__|__||__|__||___,_||_____||__|\\_|   ');

    init();
});

// ***function to start questions
function init() {
    inquirer.prompt({
        type: 'rawlist'
        , name: 'action'
        , message: 'What would you like to do?'
        , choices: ['View all employees'
            , 'View Employees by Department'
            , 'View Employees by Manager'
            , 'Add Employee'
            , 'Remove Employee'
            , 'Update Employee\'s Job Title'
            , 'Update Employee\'s Manager'
            , 'Add additional Job Titles'
            , 'Add additional Departments'
            , 'Exit'
            , new inquirer.Separator()]
    })
        .then(function (ans) {
            switch (ans.action) {
                case 'View all employees':
                    viewAll();
                    break;
                case 'View Employees by Department':
                    empByDept();
                    break;
                case 'View Employees by Manager':
                    empByMan();
                    break;
                case 'Add Employee':
                    addEmp();
                    break;
                case 'Remove Employee':
                    delEmp();
                    break;
                case 'Update Employee\'s Job Title':
                    upEmpTitle();
                    break;
                case 'Update Employee\'s Manager':
                    upEmpMan();
                    break;
                case 'Add additional Job Titles':
                    addRoles();
                    // viewTitles()
                    break;
                case 'Add additional Departments':
                    addDepts();
                    break;
                case 'Exit':
                    clog('Good Bye ;)')
                    connection.end();
                    break;
            };
        });
};

// *** functions for question responses
// working
function viewAll() {
    connection.query("SELECT concat(e.first_name,' ', e.last_name) AS employee, r.title, r.salary, d.name AS department, concat(m.first_name,' ',m.last_name) AS manager, rm.title AS manger_title FROM employee e LEFT JOIN role r ON e.role_id=r.id LEFT JOIN department d ON d.id=r.department_id LEFT JOIN employee m ON e.manager_id=m.id LEFT JOIN role rm on m.role_id=rm.id;", function (err, res) {
        if (err) throw err;
        clog('');
        console.table(res);
        clog('-----------------------------------------------------------');
        init();
    })

};
// working
function empByDept() {
    connection.query("SELECT name AS Department FROM department ORDER BY id;", function (err, res) {
        if (err) throw err;
        const dept = res.map(function (dept) {
            // clog('dept: ', dept)
            return dept.Department
        });
        inquirer.prompt([
            {
                type: 'rawlist',
                message: 'Which department would you like to view?',
                name: 'viewDept',
                choices: dept
            }
        ]).then(function (ans) {
            connection.query("SELECT concat(e.first_name,' ', e.last_name) AS employee, r.title, r.salary, concat(m.first_name,' ',m.last_name) AS manager, rm.title AS manger_title FROM employee e LEFT JOIN role r ON e.role_id=r.id LEFT JOIN department d ON d.id=r.department_id LEFT JOIN employee m ON e.manager_id=m.id LEFT JOIN role rm on m.role_id=rm.id WHERE d.name=?;", [ans.viewDept], function (err, res) {
                if (err) throw err;
                clog('');
                console.table(res);
                clog('-----------------------------------------------------------');
                init();
            })
        })
    })
};
// working
function empByMan() {
    connection.query("SELECT DISTINCT CONCAT(m.first_name,' ', m.last_name) AS Manager, m.id, r.title FROM employee e JOIN employee m ON e.manager_id=m.id JOIN role r ON m.role_id=r.id ORDER BY m.last_name;", function (err, res) {
        if (err) throw err;
        const manager = res.map(function (manager) {
            // clog('manager: ', manager)
            return manager.Manager
        });
        // clog(manager)
        inquirer.prompt([
            {
                type: 'rawlist',
                message: 'Whose employees would you like to see?',
                name: 'manager',
                choices: manager
            }
        ]).then(function (ans) {
            connection.query("SELECT concat(e.first_name,' ', e.last_name) AS employee, r.title, r.salary, concat(m.first_name,' ',m.last_name) AS manager, rm.title AS manger_title FROM employee e LEFT JOIN role r ON e.role_id=r.id LEFT JOIN department d ON d.id=r.department_id LEFT JOIN employee m ON e.manager_id=m.id LEFT JOIN role rm on m.role_id=rm.id WHERE m.id=?;", [res.find((manager) => manager.Manager === ans.manager).id], function (err, res) {
                if (err) throw err;
                // clog(ans.id)
                clog('');
                console.table(res);
                clog('-----------------------------------------------------------');
                init();
            })
        })
    })
};

function addEmp() {
    clog('Add Emp')
    init();
};

function delEmp() {
    clog('Delete Employee')
    init();
};

function upEmpTitle() {
    clog('Update Emp Title')
    init();
};

function upEmpMan() {
    clog('Update Emps Manager')
    init();
};
// working without the viewTitles
function addRoles() {
    // viewTitles(
    connection.query("SELECT id, name AS Department FROM department ORDER BY id;", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                name: 'role',
                message: 'Enter a new Title:',
                default: 'New Job Title',
                validate: function (answer) {
                    if (answer.length < 1) {
                        return clog("A Job Title is required.");
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the Salary:',
                default: '100000',
                validate: function (value) {
                    var valid = !isNaN(parseFloat(value));
                    return valid || 'Please enter a number';
                },
            },
            {
                type: 'rawlist',
                name: 'dept',
                message: 'Choose the Department:',
                choices: res.map(dept => dept.Department)
            }
        ])
            .then(function (ans) {
                const addedDept = res.filter(dept => dept.Department === ans.dept);
                connection.query("INSERT INTO role (title, salary, department_id) VALUES (?,?,?);", [ans.role, ans.salary, addedDept[0].id], function (err, res) {
                    if (err) throw err;
                    clog('New Job Title successfully added.');
                    init();
                });
            });
    })
    // );
}

// function viewTitles(cb) {
//     connection.query("SELECT r.title AS Title, r.salary AS Salary, d.name AS Department FROM role r JOIN department d ON r.department_id=d.id ORDER BY d.name, r.salary DESC;", function (err, res) {
//         if (err) throw err;
//         clog('')
//         console.table(res);
//         clog('-----------------------------------------------------------');
//         cb();
//     });
// };

// working
function addDepts() {
    viewDepts(
        function () {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'dept',
                    message: 'Enter a new Department:',
                    default: 'New Department',
                    validate: function (answer) {
                        if (answer.length < 1) {
                            return console.log("A Department is required.");
                        }
                        return true;
                    }
                }
            ])
                .then(function (ans) {
                    connection.query("INSERT INTO department (name) VALUES (?);", [ans.dept], function (err, res) {
                        if (err) throw err;
                        clog('Department successfully added.');
                        init();
                    });
                });
        }
    );
}
// ***Shows Current Depts before adding a new one
function viewDepts(cb) {
    connection.query("SELECT id, name AS Department FROM department ORDER BY id;", function (err, res) {
        if (err) throw err;
        clog('')
        console.table(res);
        clog('-----------------------------------------------------------');
        cb();
    })
};















