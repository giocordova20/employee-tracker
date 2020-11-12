var mysql = require("mysql");
var inquirer = require("inquirer");
var figlet = require("figlet");
const {Table} = require('console-table-printer');
const { exit } = require("process");
const { restoreDefaultPrompts } = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
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

//================================================//
//   Get all the Departments on application start //
//================================================//
const existingDepts = [];
const existingDeptsID = [];
function deptInfo(){
    existingDepts.splice(0,existingDepts.length);
    existingDeptsID.splice(0,existingDeptsID.length);

    connection.query("SELECT * FROM department ORDER BY name", function(err, results) {
        if (err) throw err;
        
        // Create an array only for the Department names and an array only for the department ids
        for (let i = 0 ; i < results.length; i++){
            existingDepts.push(results[i].name);
            existingDeptsID.push(results[i].id);
        };
    });

};
deptInfo()

//========================================//
//    Get all Roles on application start  //
//========================================//
const existingRoles = [];
const existingRolesID = [];
const existingRolesSal = [];
const existingRolesDept = [];

function roleInfo(){
    existingRoles.splice(0, existingRoles.length);
    existingRolesID.splice(0, existingRolesID.length);
    // Query the database for all the available Roles and Role ID
    connection.query("SELECT role.id, role.title, role.salary, role.department_id, department.name AS Department FROM role INNER JOIN department ON role.department_id = department.id;", function(err, results) {
        if (err) throw err;
        
        // Create an array only for the role names and an array only for the role ids
        for (let i = 0 ; i < results.length; i++){
            existingRoles.push(results[i].title);
            existingRolesID.push(results[i].id);
            existingRolesSal.push(results[i].salary);
            existingRolesDept.push(results[i].Department);
        }
    })
};
roleInfo();


//================================================//
//    Get all the Employees on application start  //
//================================================//
const existingEmployee = [];
const existingEmployeeID = [];
function existingEmployees(){
    existingEmployee.splice(0,existingEmployee.length);
    existingEmployeeID.splice(0,existingEmployee.length);

    // First query the database to display all the available departments
    connection.query("SELECT * FROM employee ORDER BY last_name ASC", function(err, results) {
        if (err) throw err;
            
        // Create an array only for the Department names and an array only for the department ids
        for (let i = 0 ; i < results.length; i++){
            existingEmployee.push(results[i].last_name + ', '+ results[i].first_name);
            existingEmployeeID.push(results[i].id);
        }
    });
};
existingEmployees();


//=================================================================//
//   Get all the Manager using Manager Role on application start   //
//=================================================================//
const existingMgrs = [];
const existingMgrsID = [];
function existingManagers(){
    let managerQuery = "SELECT employee.id AS Employee_ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title "
                        + "FROM employee "
                        + "INNER JOIN role ON employee.role_id = role.id WHERE role.title LIKE '%manager%' OR role.title = 'CEO' OR role.title = 'Vice President';"

    connection.query(managerQuery, function(err, results) {
        if (err) throw err;


        // Create an array only for the Department names and an array only for the department ids
        for (let i = 0 ; i < results.length; i++){
        existingMgrs.push(results[i].Last_Name + ", " + results[i].First_Name);
        existingMgrsID.push(results[i].Employee_ID);
        }
    });

};
existingManagers();

//====================================================================//
//       Prompt the user for the action they want to take             //
//====================================================================//
function start() {
    console.log("");
    console.log("");
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
                    "  xx Remove Employee xx", 
                    "         <EXIT>", 
                    new inquirer.Separator()
                ]
      })
      .then(function(answer) {
          console.log("");
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
        else if(answer.tracker === "  xx Remove Employee xx") {
          removeEmployee();
        } 
        else{
            connection.end();
            exitTracker();
        }
    });
};

//=================================================//
//           All The View Functions                //
//=================================================//

//========================================//
//    View all Employees By Last Name     //
//========================================//

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

//============================================================================================//
//    View all Employees By Department and sort employees by Last Name within the Department  //
//============================================================================================//
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

//====================================================================================== //
//    View all Employees By Managers and sort employees by Last Name for each Manager    //
//====================================================================================== //
function allEmployeesManager() {
    // Query the database for all Departs
    let query = "SELECT  employee.id AS Employee_ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, department.name AS Department, role.salary AS Salary,CONCAT(s.first_name, ' ', s.last_name) AS Manager "
                + "FROM employee "
                + "LEFT JOIN role ON employee.role_id = role.id "
                + "LEFT JOIN department ON role.department_id = department.id "
                + "LEFT JOIN employee s ON s.id = employee.manager_id "
                + "ORDER BY Manager, employee.last_name ASC;";
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

//==================================//
//     View all Employees By ID     //     
//==================================//
function allEmployeesID() {
    // Query the database for all Departs
    let query = "SELECT  employee.id AS Employee_ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, department.name AS Department, role.salary AS Salary,CONCAT(s.first_name, ' ', s.last_name) AS Manager "
                + "FROM employee "
                + "LEFT JOIN role ON employee.role_id = role.id "
                + "LEFT JOIN department ON role.department_id = department.id "
                + "LEFT JOIN employee s ON s.id = employee.manager_id "   
                + "ORDER BY employee.id ASC;";
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

//=============================//
//    View all Departments     // 
//=============================//
function allDepartments() {
    
    let query = "SELECT * FROM department;"
    connection.query(query, function(err, result){
        if (err) throw err;

        // Create a table to print out the results to the terminal
        let d = new Table({
            columns:[{name: 'ID'},{name: 'Department', alignment: 'left'}]
        });
    
        for (let i = 0 ; i < result.length; i++){
            d.addRow({ID: result[i].id, Department: result[i].name});
        };
        console.log("");
        d.printTable();
        console.log("");
        start();  // Take user back to beginning
    });
};

//======================//
//   View all Roles     //
//======================//
function allRoles() {
    
    let query = "SELECT role.id, role.title, role.salary, role.department_id, department.name AS Department FROM role INNER JOIN department ON role.department_id = department.id;"
    connection.query(query, function(err, result){
        if (err) throw err;

        // Create a table to print
        let r = new Table({
            columns:[{name: 'ID'},{name: 'Role', alignment: 'left'}, {name: 'Salary', alignment: 'left'},{name: 'Department', alignment: 'left'}]
        });
    
        for (let i = 0 ; i < result.length; i++){
            r.addRow({ID: result[i].id, Role: result[i].title, Salary: result[i].salary, Department: result[i].Department});
        }
        // console.log("");
        r.printTable();
        console.log("");
    
        start();  // Take user back to beginning
    });
    
};

//==============================================================================//
//                            All The Add Functions                            //
//=============================================================================//

//============================//
//    Add a Department        //
//============================//
function addDepartment() {
    // Propmt user for the department to add
    inquirer
    .prompt([
      {
        name: "dept",
        type: "input",
        message: "  What is the name of the department you would like to add?"
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

          console.log("");
          console.log(`The department ${answer.dept} was created successfully!`);
          
        //   allDepartments();
          start();
        }
        );
    });
};


//========================//
//    Add a Role          //
//========================//
function addRole() {
    // Get all the data from the department table
    connection.query("SELECT * FROM department ORDER BY name", function(err, results) {
        if (err) throw err;
        
        // Create an array only for the Department names and an array only for the department ids
        let existingDepts = [];
        let existingDeptsID = [];
        for (let i = 0 ; i < results.length; i++){
            existingDepts.push(results[i].name);
            existingDeptsID.push(results[i].id);
        }

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
                    if (isNaN(value) === false) {
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
        let id = "";
        for (let i = 0; i < existingDepts.length; i++){
            if (answer.dept === existingDepts[i]){
                id = existingDeptsID[i]
            }
        }
        connection.query(
            "INSERT INTO role SET ?",
            {
                title: answer.role,
                salary: answer.salary,
                department_id: id
            },
            function(err) {
                if (err) throw err;
                
                console.log("");
                console.log(`The Role was created successfully! \n Role: ${answer.role}, Salary: ${answer.salary}, Department: ${answer.dept}`);
                
                // allRoles(); // Show all roles to verify new department was added
                start();
            }
        );
    });
  });
};

//============================//
//    Add an Employee         //
//============================//
function addEmployee() {
    // First query the database to display all the available departments
    connection.query("SELECT * FROM department ORDER BY name", function(err, results) {
        if (err) throw err;
        
        // Create an array only for the Department names and an array only for the department ids
        let existingDepts = [];
        let existingDeptsID = [];
        for (let i = 0 ; i < results.length; i++){
            existingDepts.push(results[i].name);
            existingDeptsID.push(results[i].id);
        };
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
        let roleID = "";
        for (let i = 0; i < existingRoles.length; i++){
            if (answer.role === existingRoles[i]){
                roleID = existingRolesID[i]
            }
        };

        let mgrID = "";
        for (let i = 0; i < existingMgrs.length; i++){
            if (answer.manager === existingMgrs[i]){
                mgrID = existingMgrsID[i]
            }
        };

        // Insert a new employee into the DB
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

            console.log("");
            console.log(`The employee was added successfully! \n  ${answer.firstname} ${answer.lastname}, Role: ${answer.role}, Manager: ${answer.manager} `);
            console.log("");

            existingEmployees();    // Make sure the new employee info is added to the employee arrays
            allEmployeesLastName(); // Show all Employees to verify new department was added
        }
        );
    });
};

//===========================//
//    Remove an Employee     //
//===========================//
function removeEmployee() {


    connection.query("SELECT * FROM employee ORDER BY last_name;", function(err, result){
        if (err) throw err;
                
        let empID = [];
        let empNameLF = [];
        for (let i = 0; i < result.length; i++){
            empID.push(result[i].id);
            empNameLF.push(result[i].last_name + ", " + result[i].first_name );
        };


        let mgrID = [];
        let mgrNameLF = [];
        let mgrQuery = "SELECT employee.id AS Employee_ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title "
                        + "FROM employee "
                        + "INNER JOIN role ON employee.role_id = role.id WHERE role.title LIKE '%manager%' OR role.title = 'CEO' OR role.title = 'Vice President';"
        connection.query(mgrQuery, function(err, result){
            if (err) throw error;
            for (let i = 0; i < result.length; i++){
                mgrID.push(result[i].Employee_ID);
                mgrNameLF.push(result[i].Last_Name + ', '+ result[i].First_Name);
            };
        });

        // Propmt user for the employee to remove
        inquirer
        .prompt([
            {
                name: "employee",
                type: "rawlist",
                message: "  Which employee would you like to remove?",
                choices: empNameLF
            }
        ])
        .then(function(answer) {
            let removeID = "";
            for (let i = 0; i < empNameLF.length; i++){
                if (answer.employee === empNameLF[i]){
                    removeID = empID[i];
                }
            };

            if (mgrNameLF.includes(answer.employee)){
                console.log("  The employee you are trying to delet is a Manager. Please see the administrator. ")
                start();
            }
            else {
                // Remove the employee from the DB
                connection.query(`DELETE FROM employee WHERE employee.id = ${removeID}`, function(err) {
                    if (err) throw err;
                    
                    console.log("");
                    console.log(`The employee was removed successfully! \n  ${answer.employee}`);
                    console.log("");

                    allEmployeesLastName(); // Show all Employees to verify new department was added
                })
            }
        
        });

    });




};

//===================================================================//
//                        Update Functions                           //
//===================================================================//

//==========================================//
//      Update the Role for an employee    //
//==========================================//
function updateEmployeeRole() {
    connection.query("SELECT * FROM employee ORDER BY last_name;", function(err, result){
        if (err) throw err;
                
        let empID = [];
        let empNameLF = [];
        for (let i = 0; i < result.length; i++){
            empID.push(result[i].id);
            empNameLF.push(result[i].last_name + ", " + result[i].first_name );
        };
        
        let roleId = [];
        let roleTitles = [];
        connection.query("SELECT * FROM role;", function(err, result){
            if (err) throw error;
            for (let i = 0; i < result.length; i++){
                roleId.push(result[i].id);
                roleTitles.push(result[i].title);
            };
        });

        // Propmt user for the employee to update
        inquirer
        .prompt([
            {
                name: "employee",
                type: "rawlist",
                message: "  Which employee's role would you like to update?",
                choices: empNameLF
            },
            {
            name: "role",
            type: "rawlist",
            message: "  Which role would you like to assign to this employee?",
            choices: roleTitles
            },
        ])
        .then(function(answer) {
            let employeeID = "";
            for (let i = 0; i < empID.length; i++){
                if (answer.employee === empNameLF[i]){
                    employeeID = empID[i];
                }
            };
            let roleID = "";
            for (let i = 0; i < roleTitles.length; i++){
                if (answer.role === roleTitles[i]){
                    roleID = roleId[i];
                };
            }
            console.log("")
            // Update the employee
            connection.query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID};`,
            function(err) {
                if (err) throw err;
                
                console.log("");
                console.log(`  The role for ${answer.employee} was updated successfully! \n  The new role is ${answer.role}`);
                console.log("")
    
                allEmployeesLastName(); // Show all Employees to verify new department was added
            }
           );
        });
    });


};
    

//==========================================//
//    Update the Manager for an employee    //
//==========================================//
function updateEmployeeManager() {
    connection.query("SELECT * FROM employee ORDER BY last_name;", function(err, result){
        if (err) throw err;
                
        let empID = [];
        let empNameLF = [];
        for (let i = 0; i < result.length; i++){
            empID.push(result[i].id);
            empNameLF.push(result[i].last_name + ", " + result[i].first_name );
        };
        
        let mgrID = [];
        let mgrNameLF = [];
        let mgrQuery = "SELECT employee.id AS Employee_ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title "
                        + "FROM employee "
                        + "INNER JOIN role ON employee.role_id = role.id WHERE role.title LIKE '%manager%' OR role.title = 'CEO' OR role.title = 'Vice President';"
        connection.query(mgrQuery, function(err, result){
            if (err) throw error;
            for (let i = 0; i < result.length; i++){
                mgrID.push(result[i].Employee_ID);
                mgrNameLF.push(result[i].Last_Name + ', '+ result[i].First_Name);
            };
        });

        // Propmt user for the employee to updated
        inquirer
        .prompt([
            {
                name: "employee",
                type: "rawlist",
                message: "  Which employee's manager would you like to update?",
                choices: empNameLF
            },
            {
            name: "manager",
            type: "rawlist",
            message: "  Which manager do you want to set as manager for this employee?",
            choices: mgrNameLF
            },
        ])
        .then(function(answer) {
            let employeeID = "";
            for (let i = 0; i < empNameLF.length; i++){
                if (answer.employee === empNameLF[i]){
                    employeeID = empID[i];
                }
            };

            let newMgrID = "";
            for (let i = 0; i < mgrNameLF.length; i++){                
                if (answer.manager === mgrNameLF[i]){
                    newMgrID = mgrID[i];
                }
            }

            // Update the employee
            connection.query(`UPDATE employee SET manager_id = ${newMgrID} WHERE id = ${employeeID};`,
            function(err) {
                if (err) throw err;
                
                console.log("");
                console.log(`  The manager for ${answer.employee} was updated successfully! \n  The new manager is ${answer.manager}`);
                console.log("")

                allEmployeesLastName(); // Show all Employees to verify new department was added
            }
            );
        });

    });

};

//=============================//
//    Exit the application     //
//=============================//
function exitTracker(){
    console.log("")
    figlet('Have a nice day!', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
        console.log("")
    });
};