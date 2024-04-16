import { Request, Response } from 'express';
import fs from "fs";
import path, {dirname} from "path";
import {fileURLToPath} from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Category controller
 * @route POST /
 */

const readJsonFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return [];
    }
};

const writeJsonFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log('JSON file updated successfully.');
    } catch (error) {
        console.error('Error writing to JSON file:', error);
    }
};

const categoriesFilePath = path.join(__dirname, '../'+'db', 'categories.json');
const subCategoriesFilePath = path.join(__dirname, '../'+'db', 'subcategories.json');

export const categoryList = (req, res, nonce) => {
    const categories = readJsonFile(categoriesFilePath);
    res.render('categoryList', {
        filter: {
            action: 'backend/addCategory',
            addNew: true,
            category: false,
            district: false,
            editUrl: 'backend/editCategory',
            deleteUrl: 'backend/deleteCategory'
        },
        component: 'category',
        mainComponent: 'business',
        categoryList: categories
    });
};

export const addCategory = (req, res, nonce) => {
    res.render('addCategory', {
        name: 'Add',
        filter: {
            action: 'backend/addCategory',
            addNew: true,
            category: false,
            district: false
        },
        component: 'category',
        mainComponent: 'business',
        nonce: nonce
    });
};

export const editCategory = (req, res, nonce) => {
    var id = req.query.id;
    const categories = readJsonFile(categoriesFilePath);
    const category = categories.find(cat => cat.id === id);
    if (!category) {
        console.error('Category not found.');
        res.redirect('/backend/categoryList');
        return;
    }
    res.render('addCategory', {
        filter: {
            action: 'backend/editCategory',
            addNew: false,
            category: false,
            district: false
        },
        category: category,
        component: 'category',
        mainComponent: 'business',
        name: 'Edit'
    });
};

export const addCategoryPost = (req, res, nonce) => {
    const { name, active } = req.body;
    const categories = readJsonFile(categoriesFilePath);
    const id = Date.now().toString(); // Generate unique ID
    categories.push({ id, name, active });
    writeJsonFile(categoriesFilePath, categories);
    res.redirect("/backend/categoryList");
};

export const editCategoryPost = (req, res, nonce) => {
    const { name, active, id } = req.body;
    const categories = readJsonFile(categoriesFilePath);
    const index = categories.findIndex(cat => cat.id === id);
    if (index !== -1) {
        categories[index] = { id, name, active };
        writeJsonFile(categoriesFilePath, categories);
    } else {
        console.error('Category not found.');
    }
    res.redirect("/backend/categoryList");
};

export const deleteCategory = (req, res, nonce) => {
    var id = req.query.id;
    const categories = readJsonFile(categoriesFilePath);
    const index = categories.findIndex(cat => cat.id === id);
    if (index !== -1) {
        categories.splice(index, 1);
        writeJsonFile(categoriesFilePath, categories);
    } else {
        console.error('Category not found.');
    }
    res.redirect("/backend/categoryList");
};

// Similarly, refactor other functions for subcategories



export const subCategoryList = (req, res, nonce) => {
    const categoryId = req.query.categoryId;
    const subCategories = readJsonFile(subCategoriesFilePath);
    const categoryList = readJsonFile(categoriesFilePath);
    let filteredSubCategories = [];
    if (categoryId) {
        console.log("categoryId == " + categoryId);
        filteredSubCategories = subCategories.filter(subCategory => subCategory.categoryId === categoryId && subCategory.status === 1);
    } else {
        // Show all subcategories when no categoryId is provided
        filteredSubCategories = subCategories.filter(subCategory => subCategory.status === 1);
    }
    res.render('subCategoryList', {
        filter: {
            action: 'backend/addSubCategory',
            addNew: true,
            category: true,
            subCategory: false,
            editUrl: 'backend/editSubCategory',
            deleteUrl: 'backend/deleteSubCategory'
        },
        subCategoryList: filteredSubCategories,
        categoryList: categoryList,
        nonce: nonce,
        component: 'subcategory',
        mainComponent: 'business',
        categoryId: categoryId
    });
};

export const subCategoryAjList = (req, res, nonce) => {
    const categoryId = req.query.categoryId;
    console.log("categoryId == "+categoryId);
    const subCategories = readJsonFile(subCategoriesFilePath);

    const filteredSubCategories = subCategories.filter(subCategory => subCategory.categoryId === categoryId && subCategory.status === 1);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(filteredSubCategories));
};

export const addSubCategory = (req, res, nonce) => {
    const categoryList = readJsonFile(categoriesFilePath);
    res.render('addSubCategory', {
        name: 'Add',
        filter: {
            action: 'backend/addSubCategory',
            addNew: true,
            category: false,
            subCategory: false
        },
        categoryList: categoryList,
        component: 'subcategory',
        mainComponent: 'business',
        nonce: nonce
    });
};

export const editSubCategory = (req, res, nonce) => {
    const id = req.query.id;
    const subCategories = readJsonFile(subCategoriesFilePath);
    const categoryList = readJsonFile(categoriesFilePath);

    const subCategory = subCategories.find(subCategory => subCategory.id === id);
    if (!subCategory) {
        console.error('Subcategory not found.');
        res.redirect('/backend/subCategoryList');
        return;
    }

    res.render('addSubCategory', {
        filter: {
            action: 'backend/editSubCategory',
            addNew: false,
            category: false,
            subCategory: false
        },
        subCategory: subCategory,
        categoryList: categoryList,
        component: 'subcategory',
        mainComponent: 'business',
        name: 'Edit'
    });
};

export const addSubCategoryPost = (req, res, nonce) => {
    const { name, active, categoryId } = req.body;
    const subCategories = readJsonFile(subCategoriesFilePath);
    const id = Date.now().toString(); // Generate unique ID
    subCategories.push({ id, categoryId, name, active, status: 1 });
    writeJsonFile(subCategoriesFilePath, subCategories);
    res.redirect("/backend/subCategoryList");
};

export const editSubCategoryPost = (req, res, nonce) => {
    const { name, active, id, categoryId } = req.body;
    const subCategories = readJsonFile(subCategoriesFilePath);
    const index = subCategories.findIndex(subCategory => subCategory.id === id);
    if (index !== -1) {
        subCategories[index] = { id, categoryId, name, active, status: 1 };
        writeJsonFile(subCategoriesFilePath, subCategories);
    } else {
        console.error('Subcategory not found.');
    }
    res.redirect("/backend/subCategoryList");
};

export const deleteSubCategory = (req, res, nonce) => {
    const id = req.query.id;
    const subCategories = readJsonFile(subCategoriesFilePath);
    const index = subCategories.findIndex(subCategory => subCategory.id === id);
    if (index !== -1) {
        subCategories[index].status = 0;
        writeJsonFile(subCategoriesFilePath, subCategories);
    } else {
        console.error('Subcategory not found.');
    }
    res.redirect("/backend/subCategoryList");
};
};