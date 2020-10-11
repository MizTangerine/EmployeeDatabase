const inquirer = require('inquirer')

const validate =
{
    string: (inp) => {
        if (inp == '') {
            return 'An Entry is Required';
        }
        return true;
    }
}

const questions = [
    {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View all employees', 'View all employees by Department', 'View all employees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Title', 'Update Employee\'s Manager']
    },
    {
        type: 'input',
        name: 'first_name',
        message: 'Enter Employee\'s First Name:',
        default: 'first',
        validate: validate.string
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'Enter Employee\'s Last Name:',
        default: 'last',
        validate: validate.string
    },
    {
        type: 'list',
        name: 'title',
        message: 'Choose Employee\'s Job Title:',
        choices: [] //from query JOB TITLES
    },
    {
        type: 'list',
        name: 'manager',
        message: 'Choose Employee\'s Manager:',
        choices: [] //from query MANAGERS
    },
    {
        type: 'list',
        name: 'remove',
        message: 'Choose Employee to be Removed:',
        choices: [] //from query EMPLOYEES
        //how to prompt to be sure?
    },
    {
        type: 'list',
        name: 'emp_newtitle',
        message: 'Choose Employee to Update Job Title:',
        choices: [] //from query EMPLOYEES
    },
    {
        type: 'list',
        name: 'newtitle',
        message: 'Choose Employee\'s new Job Title:', //use employee from emp_newtitle
        choices: [] //from query JOB TITLES
    },
    {
        // duplicated with emp_newtitle question, use/modify previous question?
        type: 'list',
        name: 'emp_newboss',
        message: 'Choose Employee to Update Manager:',
        choices: [] //from query EMPLOYEES
    },
    {
        type: 'list',
        name: 'newmanager',
        message: 'Choose Employee\'s new Manager:', //use employee from emp_newboss
        choices: [] //from query MANAGERS
    },

];

module.exports = questions