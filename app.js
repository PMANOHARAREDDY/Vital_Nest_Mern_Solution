import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', './views');

mongoose.connect('mongodb://127.0.0.1:27017/vital_nest_mern_solution');
 
console.log("Connected to MongoDB successfully");

import {
  AclList,
  HspIdentity,
  IndIdentity,
  InventoryData,
  TreatmentRecord,
  LogTable,
  MedicineData,
  PatientCrowdFundingDemand,
  PatientData,
  PatientRecordsAccessedLogData,
  PayersCrowdFundingData,
  RegistrationApprovalData
} from './models/models.js';

console.log("Models imported Successfully");

app.get('/',async (req, res) => {
    console.log("Entered Default Root");;
    const user = await AclList.findOne({ name: "Shreenivas" });
    res.render('index', {user : user});
});

app.listen(8080, () => {
    console.log("App is listening to port 8080");
});

app.post('/login', async (req, res) => {
    const { aadhar, passwd } = req.body;
    const user = await AclList.findOne({ aadhar });
    if (!user) {
        console.log('User not Found');
        return res.render('index');
    }
    if (user.passwd === passwd) {
        await LogTable.create({ aadhar });
        switch (user.user_type) {
            case "hospital":
                return res.render("hospital_dashboard");
            case "distributor":
                return res.render('supplier_dashboard');
            case "industry":
                return res.render("Industry_dashboard");
            case "Rep":
                return res.render("representative_dashboard");
            case "admin":
                return res.render("admin_dashboard")
            default:
                return res.send("Unknown user type");
        }
    } else {
        console.log('Passwd Not Matching try again....');
        return res.render('index');
    }
});
