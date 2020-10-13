// ***require packages
const mysql = require('mysql');
const inquirer = require('inquirer');
const dotenv = require('dotenv').config();

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

    // console.log('   ___  ___ ___  ____   _       ___   __ __    ___    ___ ');
    // console.log('  \/  _]|   |   ||    \\ | |     \/   \\ |  |  |  \/  _]  \/  _]');
    // console.log(' \/  [_ | _   _ ||  o  )| |    |     ||  |  | \/  [_  \/  [_ ');
    // console.log('|    _]|  \\_\/  ||   _\/ | |___ |  O  ||  ~  ||    _]|    _]');
    // console.log('|   [_ |   |   ||  |   |     ||     ||___, ||   [_ |   [_ ');
    // console.log('|     ||   |   ||  |   |     ||     ||     ||     ||     |');
    // console.log('|_____||___|___||__|   |_____| \\___\/ |____\/ |_____||_____|');
    // console.log('                                                          ');
    // console.log('     ___ ___   ____  ____    ____   ____    ___  ____     ');
    // console.log('    |   |   | \/    ||    \\  \/    | \/    |  \/  _]|    \\    ');
    // console.log('    | _   _ ||  o  ||  _  ||  o  ||   __| \/  [_ |  D  )   ');
    // console.log('    |  \\_\/  ||     ||  |  ||     ||  |   |    _]|    \/    ');
    // console.log('    |   |   ||  _  ||  |  ||  _  ||  |_. |   [_ |    \\    ');
    // console.log('    |   |   ||  |  ||  |  ||  |  ||     ||     ||  .  \\   ');
    // console.log('    |___|___||__|__||__|__||__|__||___,_||_____||__|\\_|   ');

    init();
});

// ***function to start questions
function init() {
    inquirer.prompt({
        type: 'list'
        , name: 'action'
        , message: 'What would you like to do?'
        , choices: ['View all employees'
            , 'View Employees by Department'
            , 'View Employees by Manager'
            , 'Add Employee'
            , 'Remove Employee'
            , 'Update Employee Title'
            , 'Update Employee\'s Manager'
            , 'Exit']
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
    clog('View All');
    init();
};

function empByDept() {
    clog('Emps by Dept');
    init();
};

function empByMan() {
    clog('Emps by Manager')
    init();
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














