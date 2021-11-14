let employees = require('./data');
//to get all yhe data
const findAll = () => {
	return new Promise((resolve, reject) => {
		resolve(employees);
	});
};
//find employee by id
const findById = (id) => {
	return new Promise((resolve, reject) => {
		const employee = employees.find((employee) => employee.id === id);
		if (employee) {
			resolve(employee);
		}
		else {
			reject(`Employee with id ${id} not found !`);
		}
	});
};
//to delete employee by id 
const deleteById = (id) => {
	return new Promise((resolve, reject) => {
		const newEmployees = employees.filter((employee) => employee.id !== id);
		employees = [
			...newEmployees
		];
		resolve({ message: 'Employee deleted successfully!!' });
	});
};
//to create new employeee
const create = (employee) => {
	return new Promise((resolve, reject) => {
		const newEmployee = {
			id : Date.now().toString(),
			...employee
		};
		employees = [
			newEmployee,
			...employees
		];
		resolve(newEmployee);
	});
};
//to update a employee
const updateById = async (id, body) => {
	try {
		const { name, salary, age, remarks, email } = body;
		const employee = await findById(id);
		if (!employee) {
			res.writeHead(404, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ message: 'Employee not found!' }));
		}
		return new Promise((resolve, reject) => {
			const updatedEmployee = {
				id,
				name       :
					name ? name :
					employee.name,
				salary :
					salary ? salary :
					employee.salary,
                    age :
					age ? age :
					employee.age,
                    remarks :
					remarks ? remarks :
					employee.remarks,
                    email :
					email ? email :
					employee.email,
			};
			const index = employees.findIndex((employee) => employee.id === id);
			employees[index] = updatedEmployee;
			resolve(updatedEmployee);
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	findAll,
	findById,
	deleteById,
	create,
	updateById
};