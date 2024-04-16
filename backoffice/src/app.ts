import express,{Router, Application } from 'express';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

import { login,loginPost } from './login.controller';
import { home } from './home.controller';
import mysql from 'mysql';
import dotenv from 'dotenv';
import sessions from 'express-session';
import cookieParser from 'cookie-parser';
import Handlebars from 'handlebars';
import {
	stateList,
	addState,
	addStatePost,
	editState,
	editStatePost,
	deleteState,
	editDistrictPost,
	editDistrict,
	addDistrictPost,
	addDistrict,
	districtList,
	deleteDistrict,
	editCityPost,
	deleteCity,
	addCityPost, editCity, addCity, cityList, districtAjList, cityAjList
} from "./place.controller";
import {
	addCategory,
	addCategoryPost, addSubCategory, addSubCategoryPost,
	categoryList,
	deleteCategory, deleteSubCategory,
	editCategory,
	editCategoryPost, editSubCategory, editSubCategoryPost, subCategoryAjList, subCategoryList
} from "./category.controller";
import {addMedia, addMediaPost, editMedia, editMediaPost, mediaList} from "./media.controller";
import fs from "fs";
import {addProduct, addProductPost, editProduct, editProductPost, productList} from "./product.controller";
dotenv.config();



const app: Application = express();
const router: Router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const environment = process.env.NODE_ENV;
const port = process.env.PORT || 8080;
const nonce = crypto.randomBytes(16).toString('base64');

if(!app.get('db')) {
	const db = mysql.createConnection({
		host: process.env.DATABASE_HOST,
		user: process.env.DATABASE_USER,
		port: process.env.DATABASE_PORT,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE,
		ssl: false
	})
	app.set('db', db);
}
//session max 1 hour
const oneHour = 1000 * 60 * 60 ;
app.use(sessions({
	secret: "mysecretbackendkey45678fghjrty",
	saveUninitialized:true,
	cookie: { maxAge: oneHour },
	resave: false
}));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set the view engine to handlebars using html extension
app.engine('html', engine(
	{ extname: '.html', defaultLayout: undefined }
));
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, 'views'));

// Static assets
app.use(express.static(path.resolve(__dirname, 'public')))
// Security
app.use(
	helmet.contentSecurityPolicy({
		useDefaults: true,
		directives: {
			'connect-src': environment === 'production' ? ["'self'"] : ["'self'", "ws://localhost:3000"],
			//'script-src': ["'self'",  "'unsafe-inline'", '*'],
			'imgSrc': ["'self'", "'unsafe-inline'", '*'],
			scriptSrc: ["'self'","'unsafe-inline'", '*'],
			'script-src-elem':["'self'","'unsafe-inline'", '*'],
		},
	})
);

/**
 * Primary app routes
 */
//app.set('base', '/backend');
//app.use('/backend', router);
app.get('/', (req, res) => res.redirect("/backend"));
app.get('/districtAjList', (req, res) => {districtAjList(req, res, nonce);})
app.get('/cityAjList', (req, res) => {
	req["frontend"] = true;
	cityAjList(req, res, nonce);
})
app.get('/mediaAjList', (req, res) => {
	req["frontend"] = true;
	mediaAjList(req, res, nonce);
})
app.get('/backend', (req, res) => login(req, res, nonce));

app.post('/backend/login', (req, res) => loginPost(req, res, nonce));



app.get('/backend/home', (req, res) => {

	if((req.session.userId )) {
		home(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/stateList', (req, res) => {

	if((req.session.userId )) {
		stateList(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/addState', (req, res) => {

	if((req.session.userId )) {
		addState(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/editState', (req, res) => {

	if((req.session.userId )) {
		editState(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.post('/backend/addState', (req, res) => {

	if((req.session.userId )) {
		addStatePost(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.post('/backend/editState', (req, res) => {

	if((req.session.userId )) {
		editStatePost(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/deleteState', (req, res) => {

	if((req.session.userId )) {
		deleteState(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/districtList', (req, res) => {

	if((req.session.userId )) {
		districtList(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/districtAjList', (req, res) => {

	if((req.session.userId )) {
		districtAjList(req, res, nonce);
	}
})

app.get('/backend/cityAjList', (req, res) => {

	if((req.session.userId )) {
		cityAjList(req, res, nonce);
	}
})

app.get('/backend/addDistrict', (req, res) => {

	if((req.session.userId )) {
		addDistrict(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/editDistrict', (req, res) => {

	if((req.session.userId )) {
		editDistrict(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.post('/backend/addDistrict', (req, res) => {

	if((req.session.userId )) {
		addDistrictPost(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.post('/backend/editDistrict', (req, res) => {

	if((req.session.userId )) {
		editDistrictPost(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/deleteDistrict', (req, res) => {

	if((req.session.userId )) {
		deleteDistrict(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/cityList', (req, res) => {

	if((req.session.userId )) {
		cityList(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/addCity', (req, res) => {

	if((req.session.userId )) {
		addCity(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/editCity', (req, res) => {

	if((req.session.userId )) {
		editCity(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.post('/backend/addCity', (req, res) => {

	if((req.session.userId )) {
		addCityPost(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.post('/backend/editCity', (req, res) => {

	if((req.session.userId )) {
		editCityPost(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/deleteCity', (req, res) => {

	if((req.session.userId )) {
		deleteCity(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/categoryList', (req, res) => {

	if((req.session.userId )) {
		categoryList(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/addCategory', (req, res) => {

	if((req.session.userId )) {
		addCategory(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/editCategory', (req, res) => {

	if((req.session.userId )) {
		editCategory(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.post('/backend/addCategory', (req, res) => {

	if((req.session.userId )) {
		addCategoryPost(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.post('/backend/editCategory', (req, res) => {

	if((req.session.userId )) {
		editCategoryPost(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/deleteCategory', (req, res) => {

	if((req.session.userId )) {
		deleteCategory(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})



app.get('/backend/subCategoryList', (req, res) => {

	if((req.session.userId )) {
		subCategoryList(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/subCategoryAjList', (req, res) => {

	if((req.session.userId )) {
		subCategoryAjList(req, res, nonce);
	}
})

app.get('/backend/addSubCategory', (req, res) => {

	if((req.session.userId )) {
		addSubCategory(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/editSubCategory', (req, res) => {

	if((req.session.userId )) {
		editSubCategory(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.post('/backend/addSubCategory', (req, res) => {

	if((req.session.userId )) {
		addSubCategoryPost(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.post('/backend/editSubCategory', (req, res) => {

	if((req.session.userId )) {
		editSubCategoryPost(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/deleteSubCategory', (req, res) => {

	if((req.session.userId )) {
		deleteSubCategory(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})


app.get('/backend/productList', (req, res) => {

	if((req.session.userId )) {
		productList(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/addProduct', (req, res) => {

	if((req.session.userId )) {
		addProduct(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.post('/backend/addProduct', (req, res) => {

	if((req.session.userId )) {
		addProductPost(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/editProduct', (req, res) => {

	if((req.session.userId )) {
		editProduct(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.post('/backend/editProduct', (req, res) => {

	if((req.session.userId )) {
		editProductPost(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})



app.get('/backend/mediaList', (req, res) => {

	if((req.session.userId )) {
		mediaList(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/addMedia', (req, res) => {

	if((req.session.userId )) {
		addMedia(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.post('/backend/addMedia', (req, res) => {

	if((req.session.userId )) {
		addMediaPost(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.get('/backend/editMedia', (req, res) => {

	if((req.session.userId )) {
		editMedia(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})

app.post('/backend/editMedia', (req, res) => {

	if((req.session.userId )) {
		editMediaPost(req, res, nonce);
	}else {
		res.redirect("/backend");
	}
})


const __filename = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
app.get('/matriods2/*', (req, res) => {

	//if((req.session.userId )) {

	var fullpath = __filename+req.url

	fs.readFile(fullpath, function(err, data) {
		res.writeHead(200, {'Content-Type': 'image/jpeg'})
		res.end(data)
	})
	//}
})

//Handlebar helper for checking equality value
Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
	return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

//Handlebar helper for checking equality value
Handlebars.registerHelper('divideRow', function(arg1, arg2, options) {
	return (arg1%arg2==0) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('getRecordsForTourismId', function (tourismId, fileMap) {
	if (fileMap.has(tourismId)) {
		return fileMap.get(tourismId);
	}
	return [];
});

app.listen(port, () => {
	console.info(`Server listening on http://localhost:${port}`);
});

