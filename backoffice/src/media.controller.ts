import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * Media controller
 * @route POST /
 */
const mediaImagePath = 'matriods2/media/'
const imageSize = 3;
const categoryId = 2;
export const mediaList = (req: Request, res: Response, nonce: string) => {
    const db = req.app.get('db');
    db.query('SELECT *FROM media where status=1', async (error, result) => {
        if(error){
            console.log(error)
        }
        res.render('mediaList',
            {
                filter: {
                    action:'backend/addMedia',addNew:true, media:false, district:false,
                    editUrl:'backend/editMedia', deleteUrl:'backend/deleteMedia'
                },
                component:'media',
                mainComponent:'vendors',
                mediaList:result
            }
        );
    })
};

export const addMedia = (req: Request, res: Response, nonce: string) => {
    const db = req.app.get('db');
    var stateList;
    db.query('SELECT *FROM states where status=1', async (error, result) => {
        if (error) {
            console.log(error)
        }
        stateList = result;
        var a :[object] = []
        for(var i=0; i<imageSize; i++){
            a.push({});
        }
        db.query('SELECT *FROM subcategory where categoryId = '+categoryId+' and status=1', async (error, result) => {
            if (error) {
                console.log(error)
            }
            res.render('addMedia', {
                name: 'Add',
                filter: {action:'backend/addMedia',addNew:true, state:false, district:false, category:true},
                nonce: nonce,
                stateList:stateList,
                subCategoryList:result,
                component:'media',
                mainComponent:'vendors',
                fileList:a
            });
        });
    })
};
var counter = 0;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var imagePath = path.join(__dirname, '../'+mediaImagePath);
        console.log("__dirname ==="+imagePath)
        fs.mkdirSync(imagePath, { recursive: true })
        cb(null, imagePath)
    },
    filename: function (req, file, cb) {
        counter++;
        cb(null, 'media_'+req.body.cityId+'_'+req.body.name.replaceAll(" ","_")+'_image_'+counter+ file.originalname.match(/\..*$/))
    }
});

const editStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        var imagePath = path.join(__dirname, '../'+mediaImagePath);
        console.log("__dirname ==="+imagePath)
        fs.mkdirSync(imagePath, { recursive: true })
        cb(null, imagePath)
    },
    filename: function (req, file, cb) {
        var indexArray = req.body.imageIndex;
        indexArray = indexArray.filter( value => value!="");
        var index = indexArray[counter].replaceAll(" ","_");;
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
}).array('image',4)

const editUpload = multer({
    storage: editStorage,
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

export const addMediaPost = (req: Request, res: Response, nonce: string) => {
    counter = 0;
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log("Error happened is "+err);
        } else if (err) {
            // An unknown error occurred when uploading.
            console.log("Error happened is2 "+err);
        }
        const {
            name, stateId, districtId, cityId, subCategoryId, description, servingCities,
            minPrice, maxPrice, emailId, phoneNumber1, phoneNumber2, active
        } = req.body

        const db = req.app.get('db');

        console.log("thumbnail ==="+req.files);

        db.query('INSERT INTO media (stateId, districtId, cityId,categoryId,name,description,minPrice,maxPrice,emailId,phoneNumber1,phoneNumber2,active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?) ',
            [stateId, districtId, cityId, categoryId, name, description, minPrice, maxPrice, emailId, phoneNumber1, phoneNumber2, active], async (error, result) => {
                if (error) {
                    console.log(error)
                    return;
                }
                var subCategoryIdArray = [];
                if (subCategoryId.length > 1) {
                    subCategoryId.forEach((s, i) => {
                        let value: string[] = [];
                        value[0] = s;
                        value[1] = result.insertId;
                        subCategoryIdArray.push(value);
                    })
                } else {
                    let value: string[] = [];
                    value[0] = subCategoryId;
                    value[1] = result.insertId;
                    subCategoryIdArray.push(value);
                }
                console.log("values in page" + subCategoryIdArray);
                db.query('INSERT INTO mediaSubCategory (subCategoryId, mediaId) VALUES ?', [subCategoryIdArray], async (error, subCategoryResult) => {
                    if (error) {
                        console.log(error)
                        return;
                    }

                    var mediaFileList = [];
                    for(var i=0; i<req.files.length; i++){
                        let mediafile: string[] = [];
                        mediafile[0] =   result.insertId;
                        mediafile[1] =   mediaImagePath;
                        mediafile[2] =   req.files[i].filename.replaceAll(" ","_");
                        mediafile[3] =   req.body.imageTitle[i];
                        mediafile[4] =   req.body.imageDesc[i];
                        mediaFileList.push(mediafile);
                    }
                    if(mediaFileList.length>0) {
                        db.query('INSERT INTO mediaFile (mediaId, path, filename, title, description) VALUES ?', [mediaFileList], async (error, mediaResult) => {
                            if (error) {
                                console.log(error)
                                return;
                            }
                        })
                        var cityIdArray = [];

                        if (servingCities && Array.isArray(servingCities)) {
                            servingCities.forEach((s, i) => {
                                let value: string[] = [];
                                value[0] = s;
                                value[1] = result.insertId;
                                cityIdArray.push(value);
                            })
                        } else if(servingCities){
                            let value: string[] = [];
                            value[0] = servingCities;
                            value[1] = result.insertId;
                            cityIdArray.push(value);
                        }

                        if(cityIdArray.length>0){
                            db.query('INSERT INTO mediaCity (cityId, mediaId) VALUES ?', [cityIdArray], async (error, cityResult) => {
                                if (error) {
                                    console.log(error)
                                    return;
                                }
                            })
                        }
                    }
                    res.redirect("/backend/mediaList");

                })

                // Everything went fine.
            })
    })
};

export const editMedia = (req: Request, res: Response, nonce: string) => {
    var id = req.query.id
    const db = req.app.get('db');

    db.query('SELECT *FROM media where id=?',[id], async (error, result) => {
        if(error){
            console.log(error)
        }

        db.query('SELECT *FROM subCategory where categoryId = '+categoryId+' and status=1', async (error, subCategoryList) => {
            if (error) {
                console.log(error)
            }

            db.query('SELECT *FROM states where status=1', async (error, stateList) => {
                if (error) {
                    console.log(error)
                }
                db.query('SELECT *FROM district where status=1  order by name', async (error, districtList) => {
                    if (error) {
                        console.log(error)
                    }
                    var districtId = result[0].districtId;
                    db.query('SELECT *FROM city where districtId = '+districtId+' AND status=1  order by name', async (error, cityList) => {
                        if (error) {
                            console.log(error)
                        }
                        var mediaId = result[0].id;
                        db.query('SELECT subCategoryId FROM mediaSubCategory where mediaId = '+mediaId, async (error, mediaSubCategoryList) => {
                            if (error) {
                                console.log(error)
                            }
                            var mediaId = result[0].id;
                            db.query('SELECT *FROM mediaFile where mediaId = '+mediaId+' AND status=1', async (error, mediaFileList) => {
                                if (error) {
                                    console.log(error)
                                }

                                var a :[object] = []
                                for(var i=mediaFileList.length; i<imageSize; i++){
                                    mediaFileList.push({});
                                }


                                var subList:[string] = mediaSubCategoryList.map(v => v.subCategoryId);
                                subCategoryList.forEach(sub => {
                                    sub = subList.includes(sub.id)?sub.selected=true:sub.selected=false;
                                })

                                db.query('SELECT *FROM mediaCity where mediaId = '+mediaId+' AND status=1', async (error, mediaCityList) => {
                                    if (error) {
                                        console.log(error)
                                    }
                                    var subCityList:[string] = mediaCityList.map(v => v.cityId);
                                    cityList.forEach(sub => {
                                        subCityList.includes(sub.id)?sub.servingCity=true:sub.servingCity=false;
                                    })
                                    res.render('editMedia',
                                        {
                                            filter: {
                                                action:'backend/editMedia',addNew:false, category:false, subCategory:false
                                            },
                                            media:result[0],
                                            subCategoryList:subCategoryList,
                                            stateList:stateList,
                                            districtList:districtList,
                                            cityList:cityList,
                                            fileList:mediaFileList,
                                            name:'Edit',
                                            component:'media',
                                            mainComponent:'vendors'
                                        }
                                    );
                                })
                            })
                        })
                    })
                })
            })
        })
    })
};

export const editMediaPost = (req: Request, res: Response, nonce: string) => {
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
            subCategoryId,
            servingCities,
            description,
            minPrice,
            maxPrice,
            emailId,
            phoneNumber1,
            phoneNumber2,
            active,id,inputImage
        } = req.body

        const db = req.app.get('db');

        db.query('UPDATE backend.Media SET name =?, description=?, stateId=?, districtId=?, cityId = ?,categoryId = ?,minPrice = ?,maxPrice = ?, emailId = ?,phoneNumber1 = ?,phoneNumber2 = ? ,active = ? WHERE id = ?', [name, description, stateId,districtId,cityId,categoryId,minPrice,maxPrice,emailId,phoneNumber1,phoneNumber2,active,id], async (error, result) => {
            if (error) {
                console.log(error)
            }
            db.query('DELETE FROM mediaSubCategory where mediaId = ?', id, async (error, subCategoryResult) => {
                if (error) {
                    console.log(error)
                    return;
                }

                var subCategoryIdArray = [];
                if (subCategoryId.length > 1) {
                    subCategoryId.forEach((s, i) => {
                        let value: string[] = [];
                        value[0] = s;
                        value[1] = id;
                        subCategoryIdArray.push(value);
                    })
                } else {
                    let value: string[] = [];
                    value[0] = subCategoryId;
                    value[1] = id;
                    subCategoryIdArray.push(value);
                }

                db.query('INSERT INTO mediaSubCategory (subCategoryId, mediaId) VALUES ?', [subCategoryIdArray], async (error, subCategoryResult) => {
                    if (error) {
                        console.log(error)
                        return;
                    }

                    var mediaFileList = [];
                    for(var i=0; i<inputImage.length; i++){
                        let mediafile: string[] = [];
                        mediafile[0] = id;
                        mediafile[1] = mediaImagePath;
                        mediafile[2] = inputImage[i].replaceAll(" ","_");
                        mediafile[3] = req.body.imageTitle[i];
                        mediafile[4] = req.body.imageDesc[i];
                        mediaFileList.push(mediafile);
                        //}
                    }
                    db.query('DELETE FROM mediaFile where mediaId = ?', id, async (error, mediaFileResult) => {
                        if (error) {
                            console.log(error)
                            return;
                        }
                        if(mediaFileList.length>0) {
                            db.query('INSERT INTO mediaFile (mediaId, path, filename, title, description) VALUES ?', [mediaFileList], async (error, result) => {
                                if (error) {
                                    console.log(error)
                                    return;
                                }
                            })
                        }
                        db.query('DELETE FROM mediaCity where mediaId = ?', id, async (error, cityResult) => {
                            if (error) {
                                console.log(error)
                                return;
                            }

                            var cityIdArray = [];

                            if (servingCities && Array.isArray(servingCities)) {
                                servingCities.forEach((s, i) => {
                                    let value: string[] = [];
                                    value[0] = s;
                                    value[1] = id;
                                    cityIdArray.push(value);
                                })
                            } else if(servingCities){
                                let value: string[] = [];
                                value[0] = servingCities;
                                value[1] = id;
                                cityIdArray.push(value);
                            }

                            if(cityIdArray.length>0){
                                db.query('INSERT INTO mediaCity (cityId, mediaId) VALUES ?', [cityIdArray], async (error, cityResult) => {
                                    if (error) {
                                        console.log(error)
                                        return;
                                    }
                                })
                            }
                        })
                    });
                    res.redirect("/backend/mediaList");
                })
            })
        })
    })
};