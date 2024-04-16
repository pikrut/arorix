import { Request, Response } from 'express';
import CryptoES from 'crypto-es';
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import {dirname} from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Place controller
 * @route POST /
 */
const stateDataFilePath = path.join(__dirname, '../'+'db', 'stateData.json');
const districtDataFilePath = path.join(__dirname, '../'+'db', 'districtData.json');
const cityDataFilePath = path.join(__dirname, '../'+'db', 'cityData.json');

function generateUniqueId() {
    return Date.now().toString(); // Generate unique ID
}

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

export const stateList = (req: Request, res: Response, nonce: string) => {
    const stateListData = readJsonFile(stateDataFilePath);
    res.render('stateList', {
        filter: {
            action: 'backend/addState',
            addNew: true,
            state: false,
            district: false,
            editUrl: 'backend/editState',
            deleteUrl: 'backend/deleteState'
        },
        component: 'state',
        mainComponent: 'place',
        stateList: stateListData
    });
};

export const addState = (req: Request, res: Response, nonce: string) => {
    res.render('addState', {
        name: 'Add',
        filter: { action: 'backend/addState', addNew: true, state: false, district: false },
        nonce: nonce,
        component: 'state',
        mainComponent: 'place'
    });
};

export const editState = (req: Request, res: Response, nonce: string) => {
    const id = req.query.id;
    const stateListData = readJsonFile(stateDataFilePath);
    const state = stateListData.find((state) => state.id == id);
    if (!state) {
        res.status(404).send('State not found');
        return;
    }
    res.render('addState', {
        filter: { action: 'backend/editState', addNew: false, state: false, district: false },
        state: state,
        name: 'Edit',
        component: 'state',
        mainComponent: 'place'
    });
};

export const addStatePost = (req: Request, res: Response, nonce: string) => {
    const { name, active } = req.body;
    const newState = { id: generateUniqueId(), name, active };
    const stateListData = readJsonFile(stateDataFilePath);
    stateListData.push(newState);
    writeJsonFile(stateDataFilePath, stateListData);
    res.redirect("/backend/stateList");
};

export const editStatePost = (req: Request, res: Response, nonce: string) => {
    const { name, active, id } = req.body;
    const stateListData = readJsonFile(stateDataFilePath);
    const index = stateListData.findIndex((state) => state.id == id);
    if (index == -1) {
        res.status(404).send('State not found');
        return;
    }
    stateListData[index] = { id, name, active };
    writeJsonFile(stateDataFilePath, stateListData);
    res.redirect("/backend/stateList");
};

export const deleteState = (req: Request, res: Response, nonce: string) => {
    const id = req.query.id;
    const stateListData = readJsonFile(stateDataFilePath);
    const updatedStateList = stateListData.filter((state) => state.id !== id);
    writeJsonFile(stateDataFilePath, updatedStateList);
    res.redirect("/backend/stateList");
};

export const districtList = (req: Request, res: Response, nonce: string) => {
    const stateId = req.query.stateId;
    const districtListData = readJsonFile(districtDataFilePath);
    const stateListData = readJsonFile(stateDataFilePath);
    const filteredDistricts = stateId ? districtListData.filter((district) => district.stateId == stateId) : districtListData;

    res.render('districtList', {
        filter: {
            action: 'backend/addDistrict',
            addNew: true,
            state: true,
            district: false,
            editUrl: 'backend/editDistrict',
            deleteUrl: 'backend/deleteDistrict'
        },
        districtList: filteredDistricts,
        stateList: stateListData,
        nonce: nonce,
        component: 'district',
        mainComponent: 'place',
        stateId: stateId
    });
};

export const addDistrict = (req: Request, res: Response, nonce: string) => {
    const stateListData = readJsonFile(stateDataFilePath);
    res.render('addDistrict', {
        name: 'Add',
        filter: { action: 'backend/addDistrict', addNew: true, state: false, district: false },
        stateList: stateListData,
        component: 'district',
        mainComponent: 'place',
        nonce: nonce
    });
};

export const editDistrict = (req: Request, res: Response, nonce: string) => {
    const id = req.query.id;
    const districtListData = readJsonFile(districtDataFilePath);
    const stateListData = readJsonFile(stateDataFilePath);
    const district = districtListData.find((district) => district.id == id);
    if (!district) {
        res.status(404).send('District not found');
        return;
    }
    res.render('addDistrict', {
        filter: { action: 'backend/editDistrict', addNew: false, state: false, district: false },
        district: district,
        stateList: stateListData,
        component: 'district',
        mainComponent: 'place',
        name: 'Edit'
    });
};

export const addDistrictPost = (req: Request, res: Response, nonce: string) => {
    const { name, active, stateId } = req.body;
    const newDistrict = { id: generateUniqueId(), name, active, stateId };
    const districtListData = readJsonFile(districtDataFilePath);
    districtListData.push(newDistrict);
    writeJsonFile(districtDataFilePath, districtListData);
    res.redirect("/backend/districtList");
};

export const editDistrictPost = (req: Request, res: Response, nonce: string) => {
    const { name, active, id, stateId } = req.body;
    const districtListData = readJsonFile(districtDataFilePath);
    const index = districtListData.findIndex((district) => district.id == id);
    if (index == -1) {
        res.status(404).send('District not found');
        return;
    }
    districtListData[index] = { id, name, active, stateId };
    writeJsonFile(districtDataFilePath, districtListData);
    res.redirect("/backend/districtList");
};

export const deleteDistrict = (req: Request, res: Response, nonce: string) => {
    const id = req.query.id;
    const districtListData = readJsonFile(districtDataFilePath);
    const updatedDistrictList = districtListData.filter((district) => district.id !== id);
    writeJsonFile(districtDataFilePath, updatedDistrictList);
    res.redirect("/backend/districtList");
};

//========================District Starting=========================

export const districtAjList = (req: Request, res: Response, nonce: string) => {
    const stateId = req.query.stateId;
    const districtListData = readJsonFile(districtDataFilePath);
    const filteredDistricts = stateId ? districtListData.filter((district) => district.stateId == stateId) : districtListData;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(filteredDistricts));
};

export const cityAjList = (req: Request, res: Response, nonce: string) => {
    const districtId = req.query.districtId;
    const cityListData = readJsonFile(cityDataFilePath);

    const filteredCities = districtId ? cityListData.filter((city) => city.districtId == districtId) : cityListData;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(filteredCities));
};

export const cityList = (req: Request, res: Response, nonce: string) => {
    const stateId = req.query.stateId;
    const districtId = req.query.districtId;
    const stateListData = readJsonFile(stateDataFilePath);
    const districtListData = readJsonFile(districtDataFilePath);
    const cityListData = readJsonFile(cityDataFilePath);

    const filteredCities = cityListData.filter((city) => {
        if (districtId) {
            return city.districtId == districtId;
        } else if (stateId) {
            return city.stateId == stateId;
        } else {
            return true;
        }
    });

    res.render('cityList', {
        filter: {
            action: 'backend/addCity',
            addNew: true,
            state: true,
            district: true,
            editUrl: 'backend/editCity',
            deleteUrl: 'backend/deleteCity'
        },
        cityList: filteredCities,
        stateList: stateListData,
        districtList: districtListData,
        nonce: nonce,
        component: 'city',
        mainComponent: 'place',
        stateId: stateId,
        districtId: districtId
    });
};

export const addCity = (req: Request, res: Response, nonce: string) => {
    const stateListData = readJsonFile(stateDataFilePath);

    res.render('addCity', {
        name: 'Add',
        filter: {
            action: 'backend/addCity',
            addNew: true,
            state: false,
            city: false
        },
        stateList: stateListData,
        component: 'city',
        mainComponent: 'place',
        nonce: nonce
    });
};

export const editCity = (req: Request, res: Response, nonce: string) => {
    const id = req.query.id;
    const cityData = readJsonFile(cityDataFilePath).find(city => city.id == id);
    const stateListData = readJsonFile(stateDataFilePath);
    const districtListData = readJsonFile(districtDataFilePath);

    res.render('addCity', {
        filter: {
            action: 'backend/editCity',
            addNew: false,
            state: false,
            city: false
        },
        city: cityData,
        stateList: stateListData,
        districtList: districtListData,
        component: 'city',
        mainComponent: 'place',
        name: 'Edit'
    });
};

export const addCityPost = (req: Request, res: Response, nonce: string) => {
    const { name, active, districtId } = req.body;
    const newCity = {
        id: generateUniqueId(),
        name,
        active,
        districtId
    };
    const cityListData = readJsonFile(cityDataFilePath);
    cityListData.push(newCity);
    writeJsonFile(cityDataFilePath, cityListData);
    res.redirect("/backend/cityList");
};

export const editCityPost = (req: Request, res: Response, nonce: string) => {
    const { id, name, active, districtId } = req.body;
    const cityListData = readJsonFile(cityDataFilePath);
    const cityIndex = cityListData.findIndex(city => city.id == id);
    if (cityIndex !== -1) {
        cityListData[cityIndex] = {
            id,
            name,
            active,
            districtId
        };
        writeJsonFile(cityDataFilePath, cityListData);
    }
    res.redirect("/backend/cityList");
};

export const deleteCity = (req: Request, res: Response, nonce: string) => {
    const id = req.query.id;
    let cityListData = readJsonFile(cityDataFilePath);
    cityListData = cityListData.filter(city => city.id !== id);
    writeJsonFile(cityDataFilePath, cityListData);
    res.redirect("/backend/cityList");
};

