import { Request, Response } from 'express';
import multer from 'multer';
import editMulter from 'multer';
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * Product controller
 * @route POST /
 */

const productDataFilePath = path.join(__dirname, '../'+'db', 'productData.json');
const stateDataFilePath = path.join(__dirname, '../'+'db', 'stateData.json');
const categoriesFilePath = path.join(__dirname, '../'+'db', 'categories.json');
const subCategoriesFilePath = path.join(__dirname, '../'+'db', 'subcategories.json');
const districtDataFilePath = path.join(__dirname, '../'+'db', 'districtData.json');
const cityDataFilePath = path.join(__dirname, '../'+'db', 'cityData.json');

function generateUniqueId() {
    return Date.now().toString(); // Generate unique ID
}

const productImagePath = 'matriods2/product/'
const imageSize = 3;
const categoryId = 1;

var counter = 0;

// Helper function to read JSON file
const readJsonFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    } catch (error) {
        console.log('Error reading JSON file:', error);
        return [];
    }
};

// Helper function to write to JSON file
const writeJsonFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log('Data written to JSON file successfully.');
    } catch (error) {
        console.log('Error writing to JSON file:', error);
    }
};

const storage = editMulter.diskStorage({
    destination: function (req, file, cb) {
        var imagePath = path.join(__dirname, '../'+productImagePath);
        console.log("__dirname ==="+imagePath)
        fs.mkdirSync(imagePath, { recursive: true })
        cb(null, imagePath)
    },
    filename: function (req, file, cb) {
        counter++;
        cb(null, 'product_'+req.body.cityId+'_'+req.body.name.replaceAll(" ","_")+'_image_'+counter+ file.originalname.match(/\..*$/))
    }
});

const editStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        var imagePath = path.join(__dirname, '../'+productImagePath);
        console.log("__dirname ==="+imagePath)
        fs.mkdirSync(imagePath, { recursive: true })
        cb(null, imagePath)
    },
    filename: function (req, file, cb) {
        console.log("===>>> "+JSON.stringify(req.body))
        var indexArray = req.body.imageIndex;
        indexArray = indexArray.filter( value => value!="");
        var index = indexArray[counter];
        console.log(JSON.stringify(req.body));
        cb(null, index)
        counter++;
    }
});

const upload = multer({
    storage:storage,
    limits: { fileSize: 1 * 1024 * 1024}, // 1MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    },
}).array('image',3)

const editUpload = multer({
    storage:editStorage,
    limits: { fileSize: 1 * 1024 * 1024}, // 1MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    },
}).array('image',3)

export const productList = (req: Request, res: Response, nonce: string) => {
    let productData = readJsonFile(productDataFilePath);
    const categoryList = readJsonFile(categoriesFilePath);
    const categoryId = req.query.categoryId;
    console.log("categoryId ==="+categoryId);
    if(categoryId){
        productData = productData.filter(product => product.categoryId == categoryId);
    }
    res.render('productList', {
        filter: {
            action: 'backend/addProduct',
            addNew: true,
            product: false,
            district: false,
            editUrl: 'backend/editProduct',
            deleteUrl: 'backend/deleteProduct'
        },
        component: 'product',
        mainComponent: 'vendors',
        productList: productData,
        categoryList: categoryList,
        categoryId:categoryId
    });
};

export const addProduct = (req: Request, res: Response, nonce: string) => {
    const stateListData = readJsonFile(stateDataFilePath);
    const subCategoryListData = readJsonFile(subCategoriesFilePath);

    const a: object[] = [];
    for (let i = 0; i < imageSize; i++) {
        a.push({});
    }

    res.render('addProduct', {
        name: 'Add',
        filter: {
            action: 'backend/addProduct',
            addNew: true,
            state: false,
            district: false,
            category: true
        },
        nonce: nonce,
        stateList: stateListData,
        subCategoryList: subCategoryListData,
        component: 'product',
        mainComponent: 'vendors',
        fileList: a
    });
};


export const addProductPost = (req, res, nonce) => {

    // File upload logic using multer
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log("Multer error:", err);
            // Handle multer error
            return res.status(500).send("File upload error");
        } else if (err) {
            console.log("Unknown error:", err);
            // Handle unknown error
            return res.status(500).send("Unknown error occurred");
        }

        const {
            name, stateId, districtId, cityId, subCategoryId, description, maxAcco, ac, acSeats, parking, parkingCapacity,
            minPrice, maxPrice, emailId, phoneNumber1, phoneNumber2, active
        } = req.body
        const files = req.files; // Assuming req.files contains uploaded files

        // Construct product object
        const product = {
            id: generateUniqueId(),
            name,
            stateId,
            districtId,
            cityId,
            subCategoryId,
            description,
            maxAcco,
            ac,
            acSeats,
            parking,
            parkingCapacity,
            minPrice,
            maxPrice,
            emailId,
            phoneNumber1,
            phoneNumber2,
            active,
            files: files.map(file => ({ filename: file.filename, path: productImagePath }))
        };

        // Write product data to JSON file
        const productListData = readJsonFile(productDataFilePath);
        productListData.push(product);
        writeJsonFile(productDataFilePath, productListData);
        res.redirect("/backend/productList");

    });
};






export const editProduct = (req, res, nonce) => {
    const id = req.query.id;

    // Read product data from JSON file
    const productData = readJsonFile(productDataFilePath);
    const product = productData.find(p => p.id === id);
    if (!product) {
        console.error("Product not found with id:", id);
        // Handle error (Product not found)
        return res.status(404).send("Product not found");
    }

    // Read subcategory data from JSON file
    const subCategoryList = readJsonFile(subCategoriesFilePath);

    const subList = product.subCategoryId || [];
    // Iterate over the subCategoryList and update the selected property based on whether the subcategory is included in the product's subcategory list
    subCategoryList.forEach(sub => {
        sub.selected = subList.includes(sub.id);
    });

    // Read states data from JSON file
    const stateList = readJsonFile(stateDataFilePath);

    // Read districts data from JSON file
    const districtList = readJsonFile(districtDataFilePath);

    // Assuming each district has a list of associated cities
    const cityList = readJsonFile(cityDataFilePath);

    // Read product file data from JSON file
    const productFileList = readJsonFile(productDataFilePath);

    const fileList = product.files || [];
    var a :[object] = []
    for(var i=fileList.length; i<imageSize; i++){
        fileList.push({});
    }

    // Render the edit product form with fetched data
    res.render('editProduct', {
        filter: {
            action: 'backend/editProduct',
            addNew: false,
            category: false,
            subCategory: false
        },
        product: product,
        subCategoryList: subCategoryList,
        stateList: stateList,
        districtList: districtList,
        cityList: cityList,
        fileList: fileList,
        name: 'Edit',
        component: 'product',
        mainComponent: 'vendors'
    });
};

export const editProductPost = (req: Request, res: Response, nonce: string) => {
    counter = 0;
    editUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log("Error happened is " + err);
        } else if (err) {
            // An unknown error occurred when uploading.
            console.log("Error happened is2 " + err);
        }
        const {
            name,
            stateId,
            districtId,
            cityId,
            categoryId,
            subCategoryId,
            description,
            maxAcco,
            ac,
            acSeats,
            parking,
            parkingCapacity,
            minPrice,
            maxPrice,
            emailId,
            phoneNumber1,
            phoneNumber2,
            active,
            id,
            inputImage
        } = req.body;

        try {
            // Read products data from JSON file
            let products = readJsonFile(productDataFilePath);

            // Find the product index by id
            const productIndex = products.findIndex(product => product.id === id);

            if (productIndex === -1) {
                throw new Error('Product not found.');
            }

            // Update product details
            products[productIndex] = {
                id,
                name,
                description,
                stateId,
                districtId,
                cityId,
                categoryId,
                maxAcco,
                ac,
                acSeats,
                nonAcSeats: ac ? maxAcco - acSeats : maxAcco,
                parking,
                parkingCapacity,
                minPrice,
                maxPrice,
                emailId,
                phoneNumber1,
                phoneNumber2,
                active
            };

            let productfileList = [];
            for (var i = 0; i < inputImage.length; i++) {
                let productfile = {
                    path: productImagePath,
                    filename: inputImage[i].replaceAll(" ", "_"),
                    title: req.body.imageTitle[i],
                    description: req.body.imageDesc[i]
                };
                productfileList.push(productfile);
            }
            products[productIndex].files = productfileList;

            // Update subcategories for the product
            const updatedSubCategories = Array.isArray(subCategoryId) ? subCategoryId : [subCategoryId];

            products[productIndex].subCategoryId = updatedSubCategories;

            // Write updated products data back to JSON file
            writeJsonFile(productDataFilePath, products);

            // Redirect to product list page
            res.redirect("/backend/productList");
        } catch (error) {
            console.log('Error editing product:', error);
            res.status(500).send('Error editing product.');
        }
    })
};