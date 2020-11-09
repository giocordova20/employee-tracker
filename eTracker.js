var mysql = require("mysql");
var inquirer = require("inquirer");
var figlet = require("figlet");
const {Table} = require('console-table-printer');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "employee_trackerDB"
});

console.log("")
figlet('Employee Tracker', function(err, data) {
  if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
  }
  console.log(data)
  console.log("")
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
 start();

});

// function which prompts the user for what action they should take
function start() {
    inquirer
      .prompt({
        name: "tracker",
        type: "list",
        message: "What would you like to do?",
        choices: [ "View Departments", "View Roles", "View Employees", new inquirer.Separator(),"Add a Department", "Add a Role", "Add an Employee", new inquirer.Separator(), "Update Employee Role", new inquirer.Separator()]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.tracker === "View Departments") {
          allDepartments();
        }
        else if(answer.tracker === "View Roles") {
          allRoles();
        }
        else if(answer.tracker === "View Employees") {
          allEmployees();
        }
        else if(answer.tracker === "Add a Department") {
          addDepartment();
        }
        else if(answer.tracker === "Add a Role") {
          addRole();
        }
        else if(answer.tracker === "Add an Employee") {
          addEmployee();
        }
        else if(answer.tracker === "Update Employee Role") {
          updateRole();
        } else{
          connection.end();
        }
    });
};

function allDepartments() {
    // Query the database for all Departs
    connection.query("SELECT * FROM department", function(err, results) {
      if (err) throw err;

    //   console.log("");
    //   console.log("results:  " , results);      

    // Create a table to print out the results to the terminal
      let d = new Table({
          columns:[{name: 'ID'},{name: 'Department', alignment: 'left'}]
      });

      for (let i = 0 ; i < results.length; i++){
          d.addRow({ID: results[i].id, Department: results[i].name});
      }
      d.printTable();
    
      console.log("");
      start();  // Take user back to beginning
    });
};

function allRoles() {
// Query the database for all Departs
connection.query("SELECT * FROM role", function(err, results) {
    if (err) throw err;


    // Create a table to print out the results to the terminal
    let r = new Table({
        columns:[{name: 'ID'},{name: 'Title', alignment: 'left'}, {name: 'Salary', alignment: 'left'}, {name: 'Department_ID', alignment: 'left'}]
    });

    for (let i = 0 ; i < results.length; i++){
        r.addRow({ID: results[i].id, Title: results[i].title, Salary: results[i].salary, Department_ID: results[i].department_id});
    }
    r.printTable();

    console.log("");
    start();  // Take user back to beginning
    });
};

function allEmployees() {
    // Query the database for all Departs
    connection.query("SELECT * FROM employee", function(err, results) {
        if (err) throw err;
    
    
        // Create a table to print out the results to the terminal
        let r = new Table({
            columns:[{name: 'ID'},{name: 'First_Name', alignment: 'left'}, {name: 'Last_Name', alignment: 'left'}, {name: 'Role_ID', alignment: 'left'}, {name: 'Manager_ID', alignment: 'left'}]
        });
    
        for (let i = 0 ; i < results.length; i++){
            r.addRow({ID: results[i].id, First_Name: results[i].first_name, Last_Name: results[i].last_name, Role_ID: results[i].role_id, Manager_ID: results[i].manager_id});
        }
        r.printTable();
    
        console.log("");
        start();  // Take user back to beginning
        });
    };






