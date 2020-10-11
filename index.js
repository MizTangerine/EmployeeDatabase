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
});
