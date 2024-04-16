/**
 * App configuration
 */
const config = {
    buildDir: 'dist',
    /**
     * Entry points as in src folder
     */
    entries: [
        { name: 'index', template: './views/index.html', module: './routes/index.ts', style: './routes/index.scss', path: '' },
        { name: 'login', template: './views/login.html', module: './routes/login.ts', style: './routes/login.css', path: '' },
        { name: 'home', template: './views/home.html', module: './routes/home.ts', style: './routes/home.css', path: '' },
        { name: 'stateList', template: './views/stateList.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'addState', template: './views/addState.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'editState', template: './views/editState.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'districtList', template: './views/districtList.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'addDistrict', template: './views/addDistrict.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'editDistrict', template: './views/editDistrict.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'cityList', template: './views/cityList.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'addCity', template: './views/addCity.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'editCity', template: './views/editCity.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'categoryList', template: './views/categoryList.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'addCategory', template: './views/addCategory.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'editCategory', template: './views/editCategory.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'subCategoryList', template: './views/subCategoryList.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'addSubCategory', template: './views/addSubCategory.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'editSubCategory', template: './views/editSubCategory.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'productList', template: './views/productList.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'addProduct', template: './views/addProduct.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'editProduct', template: './views/editProduct.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'mediaList', template: './views/mediaList.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'addMedia', template: './views/addMedia.html', module: './routes/place.ts', style: './routes/place.css', path: '' },
        { name: 'editMedia', template: './views/editMedia.html', module: './routes/place.ts', style: './routes/place.css', path: '' },


    ],
    /**
     * Files or directories to copy from src to the build directory
     */
    assets: [
        'assets',
        '../entry.cjs'
    ],
    /**
     * Production base href
     */
    baseHref: '/',
    /**
     * For sitemap URLs
     */
    hostname: 'https://example.com'

};

export default config;
