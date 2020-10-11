
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
    console.log('    |   |   ||  _  ||  |  ||  _  ||  |_  |   [_ |    \\    ');
    console.log('    |   |   ||  |  ||  |  ||  |  ||     ||     ||  .  \\   ');
    console.log('    |___|___||__|__||__|__||__|__||___,_||_____||__|\\_|   ');

    connection.end()
});

// ends the connection whenever anything closes the process
process.on('exit', () => {
    connection.end()
})