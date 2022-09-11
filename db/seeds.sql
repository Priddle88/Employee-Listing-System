INSERT INTO department (name)
VALUES ("Sales"),
       ("Marketing"),
       ("Finance"),
       ("Tech Support");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 120000, 1),
       ("Sales Rep", 80000, 1),
       ("Market Specialist", 70000, 2),
       ("Financial Analyst", 75000, 3),
       ("IT Support Analyst", 65000, 4);

INSERT INTO employee (first_name, last_name)
VALUES ("Parker", "Riddle"),
       ("Riddle", "Parker"),
       ("Peter", "Parker"),
       ("Spider", "Man");