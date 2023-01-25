const express=require('express')
const fs = require('fs')
const cors = require("cors");
const userManagementRout = require('./rout/userManagementRout')
const app = express()
app.use(cors())
app.use(express.json()) 
app.use('/user', userManagementRout)
app.listen(3000, () => {
    console.log('Server runs on port 3000')
})