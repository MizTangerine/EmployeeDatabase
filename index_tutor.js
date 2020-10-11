const mysql = require('mysql');
const inquirer = require('inquirer');
const dotenv = require('dotenv').config();

const questions = require('./questions.js');

// create mysql connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.password,
    database: 'employee_db'
});

// connect to mysql
connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySql Connected...');
    // viewEmployees()
    addEmployee()
    connection.end()
});

//view employees

function viewEmployees() {
    connection.query(`select e.first_name, e.last_name
        , r.title, r.salary, d.name as department
        , concat(m.first_name,' ',m.last_name) as manager, rm.title as manger_title
        from employee e
        left join role r on e.role_id=r.id
        left join department d on d.id=r.department_id
        left join employee m on e.manager_id=m.id
        left join role rm on m.role_id=rm.id
        ;`, function (err, res) {
        if (err) throw err;
        console.table(res);
    })
}
const addEmp = [
    {
        type: 'input',
        name: 'first_name',
        message: 'Enter Employee\'s First Name:',
        default: 'first',
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'Enter Employee\'s Last Name:',
        default: 'last',
    },
    {
        type: 'list',
        name: 'title',
        message: 'Choose Employee\'s Job Title:',
        choices: ['president', 'vp', 'accounting'] //from query JOB TITLES
    },
    {
        type: 'list',
        name: 'manager',
        message: 'Choose Employee\'s Manager:',
        choices: [] //from query MANAGERS
    },
]

function getTitles(callback) {
    connection.query(`select distinct
    concat(m.first_name,' ',m.last_name) as manager, e.manager_id, rm.title as manger_title
   from employee e
   join employee m on e.manager_id=m.id
   left join role rm on m.role_id=rm.id
   order by concat(m.first_name,' ',m.last_name)
   ;
    `, callback)
}

function addEmployee() {
    getTitles(function (err, res) {
        console.table(res)
        const addEmp = [
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter Employee\'s First Name:',
                default: 'first',
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Enter Employee\'s Last Name:',
                default: 'last',
            },
            {
                type: 'list',
                name: 'title',
                message: 'Choose Employee\'s Job Title:',
                choices: ['president', 'vp', 'accounting'] //from query JOB TITLES
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Choose Employee\'s Manager:',
                choices: res.map(emp => emp.manager) //from query MANAGERS
            },
        ]
        inquirer.prompt(addEmp).then(function (inqRes) {
            let managerId = res.find(manager => manager.manager === inqRes.manager).manager_id
            console.log('managerId', managerId)
            console.log(inqRes)
        })

    });
    //query to grab employee job title
    //query to grab employee manager
}


// ends the connection whenever anything closes the process
process.on('exit', () => {
    connection.end()
})