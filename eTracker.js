var mysql = require("mysql");
var inquirer = require("inquirer");
var figlet = require("figlet");

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
        if (answer.postOrBid === "View Departments") {
          allDepartments();
        }
        else if(answer.postOrBid === "View Roles") {
          allRoles();
        }
        else if(answer.postOrBid === "View Employees") {
          allRoles();
        }
        else if(answer.postOrBid === "Add a Department") {
          allRoles();
        }
        else if(answer.postOrBid === "Add a Role") {
          allRoles();
        }
        else if(answer.postOrBid === "Add an Employee") {
          allRoles();
        }
        else if(answer.postOrBid === "Update Employee Role") {
          allRoles();
        } else{
          connection.end();
        }
      });
  }


