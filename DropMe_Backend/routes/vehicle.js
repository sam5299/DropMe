const express = require("express");
const router = express.Router();
const _ = require('lodash');
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
const { uploadFileNew } = require('../middleware/upload_file');
const { Vehicle, validateVehicleDetails } = require('../models/vehicle');
const { checkVehicleAlreadyExits, addVehicle, getVehicleList, getVehicleDetails, deleteVehicle, isRidePresentWithVehicle } = require('../services/vehicle');
const {
    uploadFile,
    uploadFileWithParam,
} = require("../middleware/upload_file");
const { validateLicenseNumber, updateUserLicenseDetails, isLicenseDetailsPresent, isLicenseNumberExists } = require('../services/user');

const fileUpload = require("express-fileupload");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(fileUpload({ useTempFiles: true, tempFileDir: "../image_files" }));

router.get("/getVehicle", auth, (req, res) => {
    console.log("getVehile called");
    return res.status(200).send("getVehicle called");
});

// route to add new vehicle for logged in user
router.post("/addVehicle", auth, async(req, res) => {
    delete req.body.User;
    try {
        //add license number and license photo code below if present in req body
        let licencePresent = await isLicenseDetailsPresent(req.body.userId); //write code in user
        console.log(licencePresent);
        if (!licencePresent) {
            if (req.files && req.body.licenseNumber && req.files.licenseImage) {
                let { error } = await validateLicenseNumber({ licenseNumber: req.body.licenseNumber });
                if (error) return res.status(400).send(error.details[0].message);

                let isLicenseNumberPresent = await isLicenseNumberExists(req.body.licenseNumber);

                if (isLicenseNumberPresent) return res.status(400).send("Licence number already present");

                let licensePath = uploadFileNew(req, "User", req.body.userId, "licensePhoto");

                let updatedUser = await updateUserLicenseDetails(req.body.userId, req.body.licenseNumber, licensePath);

                if (!updatedUser) return res.status(400).send("Something went wrong cannot add license detail's.");
            } else {
                return res.status(400).send("License number and license image is require.");
            }
        }
        let newBody = _.pick(req.body, ['vehicleName', 'vehicleNumber', 'vehicleType', 'seatingCapacity', 'vehicleClass', 'vehicleImage', 'rcBook', 'fuelType', 'userId']);

        req.body = newBody; //exclude the license properties.

        if (!req.files.pucImage) return res.status(400).send("PUC image is required!");
        if (!req.files.vehicleImage) return res.status(400).send("Vehicle image is required");
        if (!req.files.rcBookImage) return res.status(400).send("Vehicle RCBook image  is required");

        req.body.rcBookImage = " ";
        req.body.vehicleImage = " ";
        req.body.pucImage = " ";

        let { error } = validateVehicleDetails(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        console.log("Validation done");

        let vehicle = await checkVehicleAlreadyExits(req.body.vehicleNumber);
        if (vehicle != null) {
            if (vehicle.isDeleted == false) return res.status(400).send("Vehicle already exists, cannot add!", vehicle);
            console.log("Check vehicle already exists done");
            if (vehicle.userId != parseInt(req.body.userId)){
            
                vehicle.userId = parseInt(req.body.userId)
                req.body.rcBookImage = uploadFileNew(req, `v_${req.body.vehicleNumber}`, req.body.userId, "rcbook");
                req.body.vehicleImage = uploadFileNew(req, `v_${req.body.vehicleNumber}`, req.body.userId, "vehicle");
                req.body.pucImage = uploadFileNew(req, `v_${req.body.vehicleNumber}`, req.body.userId, "puc");
                console.log("Setting images paths done");
            }
            vehicle.isDeleted = false;


            let result = await vehicle.save()
            return res.status(200).send(result);

            
        }

        req.body.rcBookImage = uploadFileNew(req, `v_${req.body.vehicleNumber}`, req.body.userId, "rcbook");
        req.body.vehicleImage = uploadFileNew(req, `v_${req.body.vehicleNumber}`, req.body.userId, "vehicle");
        req.body.pucImage = uploadFileNew(req, `v_${req.body.vehicleNumber}`, req.body.userId, "puc");
        console.log("Setting images paths done");

        vehicle = await addVehicle(req.body);
        if (!vehicle) return res.status(400).send("Something went wrong.Cannot add vehicle try again latter.");
        return res.status(200).send(vehicle);
    } catch (ex) {
        console.log(ex);
        return res.status(500).send("Something went wrong.");
    }
});

//endpoint to get vehicle list of perticular user
router.get('/getVehicleList', auth, async(req, res) => {
    let vehicleList = await getVehicleList(req.body.userId);
    if (vehicleList.length == 0) return res.status(404).send("No vehicles found");
    return res.status(200).send(vehicleList);
});

//endpoint to delete vehicle of user by vehicle number
router.delete("/deleteVehicle/:vehicleNumber", auth, async(req, res) => {
    let vehicleDetails = await getVehicleDetails(req.params.vehicleNumber);

    if (!vehicleDetails) return res.status(404).send("Vehicle with given vehicle number does not exists.");

    let isRidePresent = await isRidePresentWithVehicle(vehicleDetails.vehicleNumber);
    if (isRidePresent) return res.status(400).send("You cannot remove vehicle which have pending rides. Cancel rides or try after completing rides.");

    let deleteResult = await deleteVehicle(vehicleDetails);

    return res.status(200).send("delete vehicle called:" + deleteResult);
});

module.exports = router;