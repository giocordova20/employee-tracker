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
          allRoles();
        }
        else if(answer.tracker === "Add a Department") {
          allRoles();
        }
        else if(answer.tracker === "Add a Role") {
          allRoles();
        }
        else if(answer.tracker === "Add an Employee") {
          allRoles();
        }
        else if(answer.tracker === "Update Employee Role") {
          allRoles();
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
      connection.end();
    });
  }
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
      connection.end();
    });
  }
  




