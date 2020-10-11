-- update employee role
update employee
set role_id = 17 -- {input role_id}
where id = 27 -- {input employee_id}
;

-- update manager
update employee
set manager_id= 3 -- {input manager_id}
where id= 8 -- {input employee_id}
;

-- add employee
insert into employee
(first_name, last_name, role_id, manager_id)
values
(  -- {fn input},{ln input},{role input},{manager input}
);

-- remove employee
delete from employee
where id= -- {input employee id}
;