// ***require packages
const mysql = require('mysql');
const inquirer = require('inquirer');
const dotenv = require('dotenv').config();
const cTable = require('console.table');

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
    if (err) { throw err; }
    console.log('Welcome to...');
    // Header
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
        , choices: [
            'View All Employees'
            , 'View Department List'
            , 'View Employees by Department'
            , 'View Employees by Manager'
            , 'View Employee Roles'

            , 'Add Department'
            , 'Add Employee Roles'
            , 'Add Employees'

            , 'Update Employee\'s Title'
            , 'Update Employee\'s Manager'

            , 'Delete Employees'

            , 'View the Total Budget of a Department'

            , 'Exit'
            , new inquirer.Separator()]
    })
        .then(function (ans) {
            switch (ans.action) {
                case 'Add Department':
                    addDept();
                    break;
                case 'Add Employee Roles':
                    addRoles();
                    break;
                case 'Add Employees':
                    addEmp();
                    break;
                case 'View Department List':
                    viewDept();
                    break;
                case 'View Employee Roles':
                    viewEmpRoles()
                    break;
                case 'View All Employees':
                    viewAll();
                    break;
                case 'View Employees by Department':
                    empByDept();
                    break;
                case 'View Employees by Manager':
                    empByMan();
                    break;
                case 'Update Employee\'s Title':
                    upEmpTitle();
                    break;
                case 'Update Employee\'s Manager':
                    upEmpMan();
                    break;
                case 'Delete Employees':
                    delEmp();
                    break;
                case 'View the Total Budget of a Department':
                    deptSalary();
                    break;
                case 'Exit':
                    console.log('Good Bye ;)')
                    connection.end();
                    break;
            };
        });
};

// ***View All Depts
async function viewDept() {
    connection.query("SELECT name AS Department FROM department ORDER BY id;", function (err, res) {
        if (err) throw err;
        console.log('');
        console.table(res);
        console.log('-----------------------------------------------------------');
        init();
    });
};
// ***View All Roles
function viewEmpRoles() {
    connection.query("SELECT r.title AS Title, r.salary AS Salary, d.name AS Department FROM role r JOIN department d ON r.department_id=d.id ORDER BY d.name, r.title, r.salary DESC;", function (err, res) {
        if (err) throw err;
        console.log('');
        console.table(res);
        console.log('-----------------------------------------------------------');
        init();
    });
};
// ***View All Employees
function viewAll() {
    connection.query("SELECT concat(e.first_name,' ', e.last_name) AS employee, r.title, r.salary, d.name AS department, concat(m.first_name,' ',m.last_name) AS manager, rm.title AS manger_title FROM employee e LEFT JOIN role r ON e.role_id=r.id LEFT JOIN department d ON d.id=r.department_id LEFT JOIN employee m ON e.manager_id=m.id LEFT JOIN role rm on m.role_id=rm.id ORDER BY e.first_name, e.last_name;", function (err, res) {
        if (err) throw err;
        console.log('');
        console.table(res);
        console.log('-----------------------------------------------------------');
        init();
    });
};
// ***View Employees by Department Choice
async function empByDept() {
    const depts = await deptsChoices();
    inquirer.prompt([
        {
            type: 'rawlist',
            message: 'Which department would you like to view?',
            name: 'viewDept',
            choices: depts
        }
    ])
        .then(function (ans) {
            connection.query("SELECT concat(e.first_name,' ', e.last_name) AS employee, r.title, r.salary, concat(m.first_name,' ',m.last_name) AS manager, rm.title AS manger_title FROM employee e LEFT JOIN role r ON e.role_id=r.id LEFT JOIN department d ON d.id=r.department_id LEFT JOIN employee m ON e.manager_id=m.id LEFT JOIN role rm on m.role_id=rm.id WHERE d.id=?;", [ans.viewDept], function (err, res) {
                if (err) throw err;
                console.log('');
                console.table(res);
                console.log('-----------------------------------------------------------');
                init();
            });
        });
};
// ***View Employees by selected Manager
async function empByMan() {
    const manager = await managerChoices();
    inquirer.prompt([
        {
            type: 'rawlist',
            message: 'Whose employees would you like to see?',
            name: 'manager',
            choices: manager
        }
    ])
        .then(function (ans) {
            connection.query("SELECT concat(e.first_name,' ', e.last_name) AS employee, r.title, r.salary, concat(m.first_name,' ',m.last_name) AS manager, rm.title AS manger_title FROM employee e LEFT JOIN role r ON e.role_id=r.id LEFT JOIN department d ON d.id=r.department_id LEFT JOIN employee m ON e.manager_id=m.id LEFT JOIN role rm on m.role_id=rm.id WHERE m.id=?;", [ans.manager], function (err, res) {
                if (err) throw err;
                console.log('');
                console.table(res);
                console.log('-----------------------------------------------------------');
                init();
            });
        });
};
// ***Add Dept
async function addDept() {
    let depts = await listDepts();
    console.table(depts);
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
                console.log('Department successfully added.');
                init();
            });
        });
};
// ***Add Roles
async function addRoles() {
    let titles = await viewTitles();
    console.table(titles);
    let depts = await deptsChoices();
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
            choices: depts
        }
    ])
        .then(function (ans) {
            connection.query("INSERT INTO role (title, salary, department_id) VALUES (?,?,?);", [ans.role, ans.salary, ans.dept], function (err, res) {
                if (err) throw err;
                console.log('New Job Title successfully added.');
                init();
            });
        });
};
// ***Add Employee
async function addEmp() {
    const roles = await roleChoices();
    const managers = await managerChoices();
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the Employee\'s First Name:',
            default: 'First Name',
            validate: function (answer) {
                if (answer.length < 1) {
                    return clog("A First Name is required.");
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the Employee\'s Last Name:',
            default: 'Last Name',
            validate: function (answer) {
                if (answer.length < 1) {
                    return clog("A Last Name is required.");
                }
                return true;
            }
        },
        {
            type: 'rawlist',
            name: 'role',
            message: 'Choose the Employee\'s Job Title:',
            choices: roles
        },
        {
            type: 'confirm',
            name: 'addManager',
            message: 'Would you like to add a Manager for this Employee?',
            default: true,
        },
        {
            when: input => {
                return input.addManager == true;
            },
            type: 'rawlist',
            name: 'manager',
            message: 'Choose the Employee\'s Manager',
            choices: managers
        }
    ])
        .then(function (ans) {
            connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);", [ans.firstName, ans.lastName, ans.role, ans.manager], function (err, res) {
                if (err) throw err;
                console.log('New Employee successfully added.');
                init();
            });
        });
};
// ***Update Employee Title
async function upEmpTitle() {
    const emp = await empChoices();
    const roles = await roleChoices();
    inquirer.prompt([
        {
            type: 'rawlist',
            name: 'emp',
            message: 'Choose the Employee to Update:',
            choices: emp
        },
        {
            type: 'rawlist',
            name: 'role',
            message: 'Choose the Employee\'s Job Title:',
            choices: roles
        }
    ]).then(function (ans) {
        connection.query("UPDATE employee SET role_id=? WHERE id=?;", [ans.role, ans.emp], function (err, res) {
            if (err) throw err;
            console.log('Employee\'s Job Title successfully updated.');
            init();
        });
    });
};
// ***Update Employee's Manager
async function upEmpMan() {
    const emp = await empChoices();
    const manager = await managerChoices();
    inquirer.prompt([
        {
            type: 'rawlist',
            name: 'emp',
            message: 'Choose the Employee to Update:',
            choices: emp
        },
        {
            type: 'rawlist',
            name: 'manager',
            message: 'Choose the Employee\'s Manager:',
            choices: manager
        }
    ]).then(function (ans) {
        connection.query("UPDATE employee SET manager_id=? WHERE id=?;", [ans.manager, ans.emp], function (err, res) {
            if (err) throw err;
            console.log('Employee\'s Manager successfully updated.');
            init();
        });
    });
};
// ***Delete selected Employee
async function delEmp() {
    const emp = await empChoices();
    inquirer.prompt([
        {
            type: 'rawlist',
            name: 'emp',
            message: 'Choose the Employee to Update:',
            choices: emp
        }
    ]).then(function (ans) {
        connection.query("DELETE FROM employee WHERE id=?;", [ans.emp], function (err, res) {
            if (err) throw err;
            console.log('Employee Deleted successfully.');
            init();
        });
    });
};
// ***View Total Salary of Each Department (renamed to NAME and VALUE for inquirer functionality)
function deptSalary() {
    connection.query("SELECT d.name AS Department, SUM(salary) AS Total_Salary FROM employee e LEFT JOIN role r ON e.role_id=r.id LEFT JOIN department d ON d.id=r.department_id GROUP BY d.name ORDER BY d.id;", function (err, res) {
        if (err) throw err;
        console.log('');
        console.table(res);
        console.log('-----------------------------------------------------------');
        init();
    });
};

// ***functions for choices

async function deptsChoices() {
    return new Promise((res, rej) => {
        connection.query("SELECT name, id AS value FROM department ORDER BY name;", (err, results, fields) => {
            if (err) throw err;
            res(results);
        });
    });
};

async function listDepts() {
    return new Promise((res, rej) => {
        connection.query("SELECT name AS Department FROM department ORDER BY id;", (err, results, fields) => {
            if (err) throw err;
            res(results);
        });
    });
};

async function roleChoices() {
    return new Promise((res, rej) => {
        connection.query("SELECT CONCAT(r.title,', ',d.name) AS name, r.id AS value FROM role r JOIN department d ON r.department_id=d.id ORDER by d.name, r.title;", (err, results, fields) => {
            if (err) throw err;
            res(results);
        });
    });
};

async function managerChoices() {
    return new Promise((res, rej) => {
        connection.query("SELECT DISTINCT CONCAT(m.first_name,' ', m.last_name, ', ', r.title) AS name, m.id AS value FROM employee e JOIN employee m ON e.manager_id=m.id JOIN role r ON m.role_id=r.id ORDER BY m.last_name;", function (err, results, fields) {
            if (err) throw err;
            res(results);
        });
    });
};

async function viewTitles() {
    return new Promise((res, rej) => {
        connection.query("SELECT r.title AS Title, r.salary AS Salary, d.name AS Department FROM role r JOIN department d ON r.department_id=d.id ORDER BY r.title;", function (err, results) {
            if (err) throw err;
            res(results);
        });
    });
};

async function empChoices() {
    return new Promise((res, rej) => {
        connection.query("SELECT concat(e.first_name,' ', e.last_name, ', ', r.title) AS name, e.id AS value FROM employee e JOIN role r on e.role_id=r.id ORDER BY e.first_name, e.last_name;", function (err, results) {
            if (err) throw err;
            res(results);
        });
    });
};