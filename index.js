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
            , 'Update Employee Title'
            , 'Update Employee\'s Manager'
            , 'Exit'
            , new inquirer.Separator()]
    })
        .then(function (response) {
            switch (response.action) {
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
                case 'Update Employee Title':
                    upEmpTitle();
                    break;
                case 'Update Employee\'s Manager':
                    upEmpMan();
                    break;
                case 'Exit':
                    clog('Good Bye ;)')
                    connection.end();
                    break;
            }
        });
};

// *** functions for question responses

function viewAll() {
    connection.query("SELECT concat(e.first_name,' ', e.last_name) AS employee, r.title, r.salary, d.name AS department, concat(m.first_name,' ',m.last_name) AS manager, rm.title AS manger_title FROM employee e LEFT JOIN role r ON e.role_id=r.id LEFT JOIN department d ON d.id=r.department_id LEFT JOIN employee m ON e.manager_id=m.id LEFT JOIN role rm on m.role_id=rm.id;", function (err, res) {
        if (err) throw err;
        clog('');
        console.table(res);
        clog('-----------------------------------------------------------');
        init();
    })

};

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
}

function addEmp() {
    clog('Add Emp')
    init();
}

function delEmp() {
    clog('Delete Employee')
    init();
}

function upEmpTitle() {
    clog('Update Emp Title')
    init();
}

function upEmpMan() {
    clog('Update Emps Manager')
    init();
}














