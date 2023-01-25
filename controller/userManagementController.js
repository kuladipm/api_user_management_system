const fs = require("fs");
const validator = require("validator");
const { v4: uuidv4 } = require("uuid");
//bcrypt for encrypting password
const bcrypt = require("bcrypt");
const saltRounds = 10;
//post method controller
const postData = (req, res) => {
  //collected stored json user data and here stored in existUsers variable
  const existUsers = getUserData();
  //we get 0 1 2 as gender radio button value based on that we stored actual gender in user data json file
  let genderValue = req.body.gender;
  let gender;
  if (genderValue === 0) {
    gender = "Male";
  } else if (genderValue === 1) {
    gender = "Female";
  } else {
    gender = "other";
  }
  //we req body parameter stored in userData object
  const userData = {
    id: uuidv4(),
    userName: req.body.userName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, saltRounds),
    gender: gender,
    dateOfBirth: req.body.dateOfBirth,
    location: req.body.location,
    address: req.body.address,
  };
  //validation applied on fields here we used npm validator
  if (
    !validator.isAlpha(userData.userName, "en-US", { ignore: "-" }) &&
    !validator.isEmpty(userData.userName, [])
  ) {
    return res
      .status(400)
      .send({ error: true, msg: "full name must be string and not a empty" });
  } else if (!validator.isEmail(req.body.email)) {
    return res.status(400).send({ error: true, msg: "invalid email id" });
  } else if (!validator.isDate(req.body.dateOfBirth)) {
    return res.status(400).send({ error: true, msg: "invalid date" });
  }
  //  if (userData.userName === null || userData.dateOfBirth===null || userData.email === null|| userData.password ===null||userData.location===null ||userData.address===null) {
  //      return res.status(400).send({ error: true, msg: 'data in user field are missing'})
  //  }

  //here we check unique email if found shows status msg if not found we store entire data into json file
  const findExist = existUsers.find((user) => user.email === userData.email);
  if (findExist) {
    return res.status(400).send({ error: true, msg: "email already exist" });
  } else {
    existUsers.push(userData);
    saveUserData(existUsers);
    res
      .status(200)
      .send({ success: true, msg: "User data added successfully" });
  }
  return console.log("successfully encrypted");
};
//GET method for getting all data form json file
const getData = (req, res) => {
  //getUserData function read and parse json data
  const users = getUserData();
  res.send(users);
};

//GET method for specific username data
const getDataByUserId = (req, res) => {
  //get username from url
  const userId = req.params.id;
  //get the existing user data
  const existUsers = getUserData();
  //check if the username exist or not
  const findExist = existUsers.find((element) => element.id === userId);
  if (!findExist) {
    return res.status(409).send({ error: true, msg: "user id not exist" });
  }
  //send specific username data
  res.send(findExist);
};

//patch method
const updateData = (req, res) => {
  //get the username from urls
  const userId = req.params.id;
  //get the update data
  const id = uuidv4();
  const userData = {
    id: uuidv4(),
    userName: req.body.userName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, saltRounds),
    gender: req.body.gender,
    dateOfBirth: req.body.dateOfBirth,
    location: req.body.location,
    address: req.body.address,
  };
  const existUsers = getUserData();
  const findExist = existUsers.find((element) => element.id === userId);
  if (!findExist) {
    return res.status(409).send({ error: true, msg: "user id not exist", id });
  }
  const updateUser = existUsers.filter((element) => element.id !== userId);
  updateUser.push(userData);
  saveUserData(updateUser);
  res.send({ success: true, msg: "User data updated successfully !!", id });
};

//delete  one record form json file
const deleteData = (req, res) => {
  const userId = req.params.id;
  const existUsers = getUserData();
  const filterUser = existUsers.filter((element) => element.id !== userId);
  if (existUsers.length === filterUser.length) {
    return res.status(409).send({ error: true, msg: "user id does not exist" });
  }
  //save the filtered data
  saveUserData(filterUser);
  res.send({ success: true, msg: "User removed successfully" });
};
//delete  all record form json file
const deleteAllData = (req, res) => {
  const filterUser = [];
  //save the filtered data
  saveUserData(filterUser);
  res.send({ success: true, msg: "all User removed successfully" });
};
//read the user data from json file
const saveUserData = (data) => {
  console.log(data);
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync("userDatabase.json", stringifyData);
};

//get the user data from json file
const getUserData = () => {
  const jsonData = fs.readFileSync("userDatabase.json");
  return JSON.parse(jsonData);
};
/* util functions ends */
//here we exporting controllers
module.exports = {
  postData,
  getData,
  updateData,
  deleteData,
  getDataByUserId,
  deleteAllData,
};
