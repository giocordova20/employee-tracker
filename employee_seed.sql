USE employee_trackerDB;
DELETE FROM employee_trackerDB.employee;
INSERT INTO employee_trackerDB.employee (id, first_name, last_name, role_id) VALUES ('1', 'Giovanni', 'Cordova', '1');
INSERT INTO employee_trackerDB.employee (id, first_name, last_name, role_id, manager_id) VALUES ('2', 'Sue', 'Smith', '2', '1');
INSERT INTO employee_trackerDB.employee (id, first_name, last_name, role_id, manager_id) VALUES ('3', 'John', 'Black', '3', '2');
INSERT INTO employee_trackerDB.employee (id, first_name, last_name, role_id, manager_id) VALUES ('4', 'Marry', 'Jane', '3', '2');
