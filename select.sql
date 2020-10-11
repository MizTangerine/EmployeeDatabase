-- select all employees
select e.id, e.first_name, e.last_name
, r.title, r.salary, d.name as department
, concat(m.first_name,' ',m.last_name) as manager, rm.title as manger_title
from employee e
left join role r on e.role_id=r.id
left join department d on d.id=r.department_id
left join employee m on e.manager_id=m.id
left join role rm on m.role_id=rm.id
;

-- select employees by department
select e.id, e.first_name, e.last_name
, r.title, r.salary, d.name as department
, concat(m.first_name,' ',m.last_name) as manager, rm.title as manger_title
from employee e
left join role r on e.role_id=r.id
left join department d on d.id=r.department_id
left join employee m on e.manager_id=m.id
left join role rm on m.role_id=rm.id
order by r.department_id
;

-- select employees by manager name
select e.id, e.first_name, e.last_name
, r.title, r.salary, d.name as department
, concat(m.first_name,' ',m.last_name) as manager, rm.title as manger_title
from employee e
left join role r on e.role_id=r.id
left join department d on d.id=r.department_id
left join employee m on e.manager_id=m.id
left join role rm on m.role_id=rm.id
order by concat(m.first_name,' ',m.last_name)
;
