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
        choices: [ 
                    "View Employees (by Last Name)",
                    "View Employees (by Department)",
                    "View Employees (by Manager)",
                    "View Employees (by ID)",
                    "View Departments", 
                    "View Roles", 
                    new inquirer.Separator(), 
                    "Add a Department", 
                    "Add a Role", 
                    "Add an Employee", 
                    new inquirer.Separator(), 
                    "Update Employee Role", 
                    "Update Employee Manager", 
                    new inquirer.Separator(),
                    "Remove Employee", 
                    "   <EXIT>", 
                    new inquirer.Separator()
                ]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if(answer.tracker === "View Employees (by Last Name)") {
          allEmployeesLastName();
        }
        else if(answer.tracker === "View Employees (by Department)") {
          allEmployeesDepartment();
        }
        else if(answer.tracker === "View Employees (by Manager)") {
          allEmployeesManager();
        }
        else if(answer.tracker === "View Employees (by ID)") {
          allEmployeesID();
        }
        else if (answer.tracker === "View Departments") {
          allDepartments();
        }
        else if(answer.tracker === "View Roles") {
          allRoles();
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
          updateEmployeeRole();
        } 
        else if(answer.tracker === "Update Employee Manager") {
          updateEmployeeManager();
        } 
        else if(answer.tracker === "Remove Employee") {
          removeEmployee();
        } 
        else{
          connection.end();
        }
    });
};

//=================================================//
//          All The View Functions                 //
//=================================================//

//// View all Employees By Last Name \\\
function allEmployeesLastName() {
    // Query the database for all Departs
    let query = "SELECT  employee.id AS Employee_ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, department.name AS Department, role.salary AS Salary,CONCAT(s.first_name, ' ', s.last_name) AS Manager "
                + "FROM employee "
                + "LEFT JOIN role ON employee.role_id = role.id "
                + "LEFT JOIN department ON role.department_id = department.id "
                + "LEFT JOIN employee s ON s.id = employee.manager_id "   
                + "ORDER BY employee.last_name ASC;"
    connection.query(query, function(err, results) {
        if (err) throw err;
    
        // Create a table to print out the results to the terminal
        let r = new Table({
            columns:[{name: 'Employee_ID'}, 
            {name: 'Last_Name', alignment: 'left'}, 
            {name: 'First_Name', alignment: 'left'}, 
            {name: 'Title', alignment: 'left'}, 
            {name: 'Department', alignment: 'left'}, 
            {name: 'Salary', alignment: 'left'}, 
            {name: 'Manager', alignment: 'left'}]
        });
    
        for (let i = 0 ; i < results.length; i++){
            r.addRow({Employee_ID: results[i].Employee_ID, Last_Name: results[i].Last_Name, First_Name: results[i].First_Name, Title: results[i].Title, Department: results[i].Department, Salary: results[i].Salary, Manager: results[i].Manager});
        }
        r.printTable();
    
        console.log("");
        start();  // Take user back to beginning
    });
};

//// View all Employees By Department and sort employees by Last Name within the Department \\\
function allEmployeesDepartment() {
    // Query the database for all Departs
    let query = "SELECT  employee.id AS Employee_ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, department.name AS Department, role.salary AS Salary,CONCAT(s.first_name, ' ', s.last_name) AS Manager "
                + "FROM employee " 
                + "LEFT JOIN role ON employee.role_id = role.id " 
                + "LEFT JOIN department ON role.department_id = department.id "
                + "LEFT JOIN employee s ON s.id = employee.manager_id "
                + "ORDER BY department.name, employee.last_name ASC;"
    connection.query(query, function(err, results) {
        if (err) throw err;
    
        // Create a table to print out the results to the terminal
        let r = new Table({
            columns:[{name: 'Department', alignment: 'left'},
            {name: 'Employee_ID'}, 
            {name: 'Last_Name', alignment: 'left'}, 
            {name: 'First_Name', alignment: 'left'}, 
            {name: 'Title', alignment: 'left'},  
            {name: 'Salary', alignment: 'left'}, 
            {name: 'Manager', alignment: 'left'}]
        });
    
        for (let i = 0 ; i < results.length; i++){
            r.addRow({Department: results[i].Department, Employee_ID: results[i].Employee_ID, Last_Name: results[i].Last_Name, First_Name: results[i].First_Name, Title: results[i].Title, Salary: results[i].Salary, Manager: results[i].Manager});
        }
        r.printTable();
    
        console.log("");
        start();  // Take user back to beginning
    });
};

//// View all Employees By Managers and sort employees by Last Name for each Manager \\\
function allEmployeesManager() {
    // Query the database for all Departs
    let query = "SELECT  employee.id AS Employee_ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, department.name AS Department, role.salary AS Salary,CONCAT(s.first_name, ' ', s.last_name) AS Manager "
                + "FROM employee " 
                + "LEFT JOIN role ON employee.role_id = role.id " 
                + "LEFT JOIN department ON role.department_id = department.id "
                + "LEFT JOIN employee s ON s.id = employee.manager_id "
                + "ORDER BY department.name, employee.last_name ASC;"
    connection.query(query, function(err, results) {
        if (err) throw err;
    
        // Create a table to print out the results to the terminal
        let r = new Table({
            columns:[{name: 'Manager', alignment: 'left'},
            {name: 'Employee_ID'}, 
            {name: 'Last_Name', alignment: 'left'}, 
            {name: 'First_Name', alignment: 'left'}, 
            {name: 'Title', alignment: 'left'},  
            {name: 'Salary', alignment: 'left'},
            {name: 'Department', alignment: 'left'}]
        });
    
        for (let i = 0 ; i < results.length; i++){
            r.addRow({Manager: results[i].Manager, Employee_ID: results[i].Employee_ID, Last_Name: results[i].Last_Name, First_Name: results[i].First_Name, Title: results[i].Title, Salary: results[i].Salary, Department: results[i].Department});
        }
        r.printTable();
    
        console.log("");
        start();  // Take user back to beginning
    });
};

//// View all Employees By ID \\\
function allEmployeesID() {
    // Query the database for all Departs
    let query = "SELECT  employee.id AS Employee_ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, department.name AS Department, role.salary AS Salary,CONCAT(s.first_name, ' ', s.last_name) AS Manager "
                + "FROM employee "
                + "LEFT JOIN role ON employee.role_id = role.id "
                + "LEFT JOIN department ON role.department_id = department.id "
                + "LEFT JOIN employee s ON s.id = employee.manager_id "   
                + "ORDER BY employee.id ASC;"
    connection.query(query, function(err, results) {
        if (err) throw err;
    
        // Create a table to print out the results to the terminal
        let r = new Table({
            columns:[{name: 'Employee_ID'}, 
            {name: 'Last_Name', alignment: 'left'}, 
            {name: 'First_Name', alignment: 'left'}, 
            {name: 'Title', alignment: 'left'}, 
            {name: 'Department', alignment: 'left'}, 
            {name: 'Salary', alignment: 'left'}, 
            {name: 'Manager', alignment: 'left'}]
        });
    
        for (let i = 0 ; i < results.length; i++){
            r.addRow({Employee_ID: results[i].Employee_ID, Last_Name: results[i].Last_Name, First_Name: results[i].First_Name, Title: results[i].Title, Department: results[i].Department, Salary: results[i].Salary, Manager: results[i].Manager});
        }
        r.printTable();
    
        console.log("");
        start();  // Take user back to beginning
    });
};

//// View all Departments \\\\
function allDepartments() {
    // Query the database for all Departs
    connection.query("SELECT * FROM department ORDER BY name ASC", function(err, results) {
        if (err) throw err;

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

//// View all Roles \\\\
function allRoles() {
// Query the database for all Departs
    let query = "SELECT role.id, role.title, role.salary, role.department_id, department.name AS Department FROM role INNER JOIN department ON role.department_id = department.id;";

    connection.query(query, function(err, results) {
        if (err) throw err;

        // Create a table to print out the results to the terminal
        let r = new Table({
            columns:[{name: 'ID'},{name: 'Title', alignment: 'left'}, {name: 'Salary', alignment: 'left'}, {name: 'Department', alignment: 'left'}]
        });

        for (let i = 0 ; i < results.length; i++){
            r.addRow({ID: results[i].id, Role: results[i].title, Salary: results[i].salary, Department: results[i].Department});
        }
        r.printTable();

        console.log("");
        start();  // Take user back to beginning
    });
};



//=================================================//
//          All The Add Functions                 //
//=================================================//

//// Add a Department \\\\
function addDepartment() {
    // Propmt user for the department to add
    inquirer
    .prompt([
      {
        name: "dept",
        type: "input",
        message: "What is the name of the department you would like to add?"
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.dept
        },
        function(err) {
          if (err) throw err;
          console.log(`The department ${answer.dept} was created successfully!`);

          allDepartments(); // Show all departments to verify new department was added
        }
      );
    });
};

//// Add a Role \\\\
function addRole() {

    // Get all the data from the department table
    connection.query("SELECT * FROM department ORDER BY name", function(err, results) {
        if (err) throw err;
        
        console.log("   department in addRole():  ", results);

        // Create an array only for the Department names and an array only for the department ids
        let existingDepts = [];
        let existingDeptsID = [];
        for (let i = 0 ; i < results.length; i++){
            existingDepts.push(results[i].name);
            existingDeptsID.push(results[i].id);
        }
        console.log("existingDepts", existingDepts);
        console.log("existingDeptsID", existingDeptsID);


        
        // Propmt user for the role to add
        inquirer
        .prompt([
            {
            name: "role",
            type: "input",
            message: "  What is the Title of the role you would like to add?"
            },
            {
                name: "salary",
                type: "input",
                message: "  What is the salary for this role? (i.e., 75000)",
                validate: function(value) {
                    if (isNaN(value) === false) { /// *** Add validation for empty input *** \\\\
                    return true;
                    }
                    console.log("  Please enter a valid Salary input. (i.e., 75000)")
                    return false;
                }
            },
            {
                name: "dept",
                type: "rawlist",
                message: "  What is the department for this role?",
                choices:  existingDepts
            },
    ])
    .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info

        console.log("")
        console.log("    IN THE .then")
        console.log({answer});
        console.log({existingDeptsID});

        console.log("BEFORE THE for loop")
        let id = "";
        for (let i = 0; i < existingDepts.length; i++){
            console.log("existingDepts:   " ,existingDepts[i])
            if (answer.dept === existingDepts[i]){
                id = existingDeptsID[i]
            }
        }
        console.log({id})
        console.log("    ----    ")

        // let query = `INSERT INTO role (title, salary, department_id) VALUES (${answer.role}, ${answer.salary}, ${id})`

        connection.query(
        "INSERT INTO role SET ?",
        {
            title: answer.role,
            salary: answer.salary,
            department_id: id
        },
        function(err) {
            if (err) throw err;
            console.log(`The Role was created successfully! \n Title: ${answer.role} , Salary: ${answer.salary}, Department_ID: ${answer.dept}`);
            console.log("");

            allRoles(); // Show all roles to verify new department was added
        }
      );
    });
  });
};

const existingDepts = [];
const existingDeptsID = [];
function deptInfo(){
        connection.query("SELECT * FROM department ORDER BY name", function(err, results) {
            if (err) throw err;
            
            // console.log("    * departments", results);

            // Create an array only for the Department names and an array only for the department ids
            for (let i = 0 ; i < results.length; i++){
                existingDepts.push(results[i].name);
                existingDeptsID.push(results[i].id);
            }
            // console.log({existingDepts});
            // console.log({existingDeptsID});
        });
    };
deptInfo()

const existingMgrs = [];
const existingMgrsID = [];
function existingManagers(){
    let managerQuery = "SELECT employee.id AS Employee_ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title "
                        + "FROM employee "
                        + "INNER JOIN role ON employee.role_id = role.id WHERE role.title LIKE '%manager%' OR role.title = 'CEO' OR role.title = 'Vice President';"

    connection.query(managerQuery, function(err, results) {
        if (err) throw err;

        // console.log("    existingManagers:   ", results);

        // Create an array only for the Department names and an array only for the department ids
        for (let i = 0 ; i < results.length; i++){
        existingMgrs.push(results[i].Last_Name + ", " + results[i].First_Name);
        existingMgrsID.push(results[i].Employee_ID);
        }
        // console.log({existingMgrs});
        // console.log({existingMgrsID});
    });

};
existingManagers();

//// Add an Employee \\\\
function addEmployee() {
    // First query the database to display all the available departments
    connection.query("SELECT * FROM role ORDER BY title", function(err, results) {
        if (err) throw err;
        
        // console.log("    * roles", results);

        // Create an array only for the Department names and an array only for the department ids
        let existingRoles = [];
        let existingRolesID = [];
        ID = [];
        for (let i = 0 ; i < results.length; i++){
            existingRoles.push(results[i].title);
            existingRolesID.push(results[i].id);
        }
        // console.log({existingRoles});
        // console.log({existingRolesID});


        connection.query("SELECT * FROM department ORDER BY name", function(err, results) {
            if (err) throw err;
            
            // console.log("    * departments", results);

            // Create an array only for the Department names and an array only for the department ids
            let existingDepts = [];
            let existingDeptsID = [];
            for (let i = 0 ; i < results.length; i++){
                existingDepts.push(results[i].name);
                existingDeptsID.push(results[i].id);
            }
            // console.log({existingDepts});
            // console.log({existingDeptsID});
        });


    
    // Propmt user for the employee to add
        inquirer
        .prompt([
            {
              name: "firstname",
              type: "input",
              message: "  What is the employee's first name?"
            },
            {
              name: "lastname",
              type: "input",
              message: "  What is the employee's last name?"
            },  
            {
              name: "role",
              type: "rawlist",
              message: "  What is this employee's Role?",
              choices: existingRoles
            },
            {
            name: "manager",
            type: "rawlist",
            message: "  Who is this Employee's Manager?",
            choices: existingMgrs
            },
        ])
        .then(function(answer) {

            // console.log("")
            // console.log("    IN THE .then")
            // console.log({answer});
            // console.log({existingRolesID});
            // console.log({existingMgrsID});
    
            // console.log("BEFORE THE for rolesID loop")
            let roleID = "";
            for (let i = 0; i < existingRoles.length; i++){
                console.log("existingRoles:   " ,existingRoles[i])
                if (answer.role === existingRoles[i]){
                    roleID = existingRolesID[i]
                }
            }
            // console.log({roleID})
            // console.log("    ----    ")
    

            // console.log({existingDepts});
            // console.log({existingDeptsID});
    
            // console.log("BEFORE THE for mgrID loop")
            let mgrID = "";
            for (let i = 0; i < existingMgrs.length; i++){
                console.log("existingMgrs:   " ,existingMgrs[i])
                if (answer.manager === existingMgrs[i]){
                    mgrID = existingMgrsID[i]
                }
            }
            // console.log({mgrID})
            // console.log("    ----    ")



            // when finished prompting, insert a new item into the db with that info
            connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: answer.firstname,
                last_name: answer.lastname,
                role_id: roleID,
                manager_id: mgrID
            },
            function(err) {
                if (err) throw err;
                console.log(`The employee was added successfully! \n  ${answer.firstname} ${answer.lastname}, Role: ${answer.role}, Manager: ${answer.manager} `);
                console.log("")

                allEmployeesLastName(); // Show all Employees to verify new department was added
            }
            );
        });
    });
};


const existingEmployee = [];
const existingEmployeeID = [];

function existingEmployees(){
        // First query the database to display all the available departments
        connection.query("SELECT * FROM employee ORDER BY last_name ASC", function(err, results) {
            if (err) throw err;
            
            console.log("    * employees", results);
    
            // Create an array only for the Department names and an array only for the department ids
            for (let i = 0 ; i < results.length; i++){
                existingEmployee.push(results[i].last_name + ', '+ results[i].first_name);
                existingEmployeeID.push(results[i].id);
            }
            console.log({existingEmployee});
            console.log({existingEmployeeID});
    
        });
};
existingEmployees();

//// Remove an Employee \\\\
function removeEmployee() {

    // Propmt user for the employee to add
        inquirer
        .prompt([
            // {
            //   name: "firstname",
            //   type: "input",
            //   message: "  What is the employee's first name?"
            // },
            // {
            //   name: "lastname",
            //   type: "input",
            //   message: "  What is the employee's last name?"
            // },  
            {
              name: "employee",
              type: "rawlist",
              message: "  Which employe would you like to remove?",
              choices: existingEmployee
            }
            // ,
            // {
            // name: "manager",
            // type: "rawlist",
            // message: "  Who is this Employee's Manager?",
            // choices: existingMgrs
            // },
        ])
        .then(function(answer) {

            // console.log("")
            // console.log("    IN THE .then")
            console.log({answer});
            // console.log({existingRolesID});
            // console.log({existingMgrsID});
    
            console.log("    BEFORE THE for loop")
            let removeID = "";
            for (let i = 0; i < existingEmployee.length; i++){
                console.log("existingEmployee:   " ,existingEmployee[i])
                if (answer.employee === existingEmployee[i]){
                    removeID = existingEmployeeID[i]
                }
            }
            console.log({removeID})
            // console.log("    ----    ")
    

            // console.log({existingDepts});
            // console.log({existingDeptsID});
    
            // console.log("BEFORE THE for mgrID loop")
            // let mgrID = "";
            // for (let i = 0; i < existingMgrs.length; i++){
            //     console.log("existingMgrs:   " ,existingMgrs[i])
            //     if (answer.manager === existingMgrs[i]){
            //         mgrID = existingMgrsID[i]
            //     }
            // }
            // console.log({mgrID})
            // console.log("    ----    ")



            // When finished prompting, remove the employee
            connection.query(`DELETE FROM employee WHERE employee.id = ${removeID}`,
            // {
            //     first_name: answer.firstname,
            //     last_name: answer.lastname,
            //     role_id: roleID,
            //     manager_id: mgrID
            // },
            function(err) {
                if (err) throw err;
                console.log(`The employee was removed successfully! \n  ${answer.firstname} ${answer.lastname}`);
                console.log("")

                allEmployeesLastName(); // Show all Employees to verify new department was added
            }
            );
        });
    };
