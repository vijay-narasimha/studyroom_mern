const express = require('express');

const { signup, login,verifytoken} = require('./controllers/authController');
const {getUser,updateUser,uploadUserPhoto,resizeUserPhoto}=require('./controllers/userController')
const {createRoom,deleteRoom,updateRoom, topicData, roomparticipants,getRooms,getRoom,participants}=require("./controllers/roomController")
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);


router.post('/room',verifytoken,createRoom)
router.put('/room/:id',verifytoken,updateRoom)
router.delete('/room/:id',verifytoken,deleteRoom)

router.get('/topics',topicData)
router.get('/rooms',getRooms)
router.get('/room/:slug',getRoom)
router.get('/participants/:id',verifytoken,participants)
router.post('/updateprofile',verifytoken,uploadUserPhoto,resizeUserPhoto,updateUser)
router.get('/roomparticipants/:id',roomparticipants)

router.get('/user/:name',getUser)

module.exports = router;
