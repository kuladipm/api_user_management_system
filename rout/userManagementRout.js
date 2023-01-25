
const express = require('express')
const userManagementRout = express.Router()
const { postData, getData, updateData, deleteData, getDataByUserId,deleteAllData } = require('../controller/userManagementController')
//router.use(express.json())
/* Create - POST method */
userManagementRout.post('', postData)
/* Read - GET method for specific username data */
userManagementRout.get('/:id', getDataByUserId)
/* Read - GET method  for all data*/
userManagementRout.get('', getData)
/* Update - Patch method */
userManagementRout.patch('/:id', updateData)
/* Delete  - Delete method */
userManagementRout.delete('/:id', deleteData)
/* Delete All data - Delete method */
userManagementRout.delete('/', deleteAllData)
module.exports = userManagementRout
