//const http = require("http");
//const { url } = require("inspector");
//const PORT = 8089;
//const { uuid } = require('uuidv4');

//console.log(uuid(), uuid(), uuid());
//const server = http.createServer(requsetHandler);

//server.listen(PORT);


// //var employeeEmails={"swetakarn477@gmail.com","prinkacronj@gmail.com"]
// var employees = [{"name":"sweta", "age":"22","salary":"2000" ,"remarks":"good","email":"swetakarn477@gmail.com"}
// ,{"name":"priyanka", "age":"22","salary":"3000" ,"remarks":"good" , "email":"prinkacronj@gmail.com"}];

// /*admincred={
//     username="shubham@cronj.com",
//     password:"123"
// }*/

// var tokens = ["dsadsakdsanjk"];

// // login request (user and passwords)
// // make a random token/ticket (dsadsakdsanjk)  and send it as a response and tell them to pass this token in further request like add employee

// // user is now passing the token with the request 
// // 
// /*function getRouteFromUrl(url){
//     console.log(url)
//     return(url.split("/")[1].split("?")[0])
// }

// function getQuery(request){
//     var url_parts = url.parse(request.url, true);
//     request.query = url_parts.query;

// }*/

// /*"/add","/update"=level1
// "/add/employee"=level2*/

// function requsetHandler(req, res){

//     /*res.writeHead(200,{'content-Type':'server/json'})
//     getQuery(req);*/
//     // for get request
//    if(req.method == "GET"){
//        if(req.url === "/employee"){
//         res.end(JSON.stringify(employees))
//        }
//         else{
//             res.end("NO GET API FOUND")
//         }
//    }
   
// //    for post request
//    else if(req.method == "POST"){

//     if(req.url === "/employee"){
//         // TODO : add to employee array
//         let completeBuffer = "";
//         // read the data
//         req.on("data", (bufferData)=>{
//             // console.log("buffer", bufferData);
//             // console.log("daata", JSON.parse(bufferData.toString()));
//             completeBuffer+=bufferData;
//         })
//         req.on("end", ()=>{
//             console.log("data", JSON.parse(completeBuffer.toString()));
            
//             console.log("request has ended");
//             employees.push(JSON.parse(completeBuffer.toString()));
//             console.log("Added successfully");
//             // need to verify the token
//             const tokenFromClient = JSON.parse(completeBuffer.toString()).token;
//             let isTokenVerified = false;

//             tokens.map(token=>{
//                 if(token == tokenFromClient){
//                     isTokenVerified = true;
//                 }
//             })

//             if(isTokenVerified){
//                 // after reading the data add to array
//                 employees.push(JSON.parse(completeBuffer.toString()));
//                 res.end("Added Succesfully");
//                 // and send successfully added in the response
//             }else{
//                 res.end("Unauthorized, token invalid");
//             }
        
           
//         })        
//     }
//     else{
//             res.end("NO POST API FOUND")
//     }
//    }
//    //for Delete
// else if(req.method=="DELETE"){
//     if(req.url == "/employee/:email"){
//        employees.deleteOne({email:req.employees.email}).then()

//     }
// }else{

// }

   
// }
/////////////////////////////////////////////
const http = require('http');
const Employee = require('./employeeController');
const { getPostData } = require('./getData');
var tokens = ["dsadsakdsanjk"];
const server = http.createServer(async (req, res) => {
	if (req.url === '/api/employees' && req.method === 'GET') {
		const employees = await Employee.findAll();
		res.writeHead(200, { 'Content-Type': 'application/json', 'Authorization':'Bearer' + tokens });
		res.end(JSON.stringify(employees));
	}
	else if (req.url.match(/\/api\/employees\/([a-z A-Z 0-9]+)/) && req.method === 'GET') {
		try {
			const id = req.url.split('/')[3];
			const employee = await Employee.findById(id);
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify(employee));
		} catch (error) {
			res.writeHead(404, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ message: 'Employee not found!' }));
		}
	}
	else if (req.url.match(/\/api\/employees\/([a-z A-Z 0-9]+)/) && req.method === 'DELETE') {
		try {
			const id = req.url.split('/')[3];
			await Employee.deleteById(id);
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ message: 'Employee deleted successfully!!!' }));
		} catch (error) {
			console.log(error);
			res.writeHead(404, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ message: 'Employee not found!' }));
		}
	}
	else if (req.url.match(/\/api\/employees\/([a-z A-Z 0-9]+)/) && req.method === 'PATCH') {
		try {
			const body = await getPostData(req);
			const id = req.url.split('/')[3];
			const updatedEmployee = await Employee.updateById(id, JSON.parse(body));
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify(updatedEmployee));
		} catch (error) {
			console.log(error);
			res.writeHead(404, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ message: 'Employee not found!' }));
		}
	}
	else if (req.url === '/api/employees' && req.method === 'POST') {
		const body = await getPostData(req);
		// const { title, description } = JSON.parse(body);
		// const newEmployee = await Employee.create({ title, description });
        const { name, salary, age, remarks, email } = JSON.parse(body);

        const newEmployee = await Employee.create({ name, salary, age, remarks, email });

		res.writeHead(201, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(newEmployee));
	}
	else {
		res.writeHead(404, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ message: 'Route not found!' }));
	}
});

const PORT = process.env.PORT || 8089;

server.listen(PORT, () => console.log(`Server listening on port ${PORT}!!!`));



