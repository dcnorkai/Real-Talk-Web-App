const express = require("express")
const {protect} = require("../controllers/userControllers")
const {accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup} = require("../controllers/chatControllers")

const router = express.Router()

//API ENDPOINTS FOR CHAT
router.route('/').post(protect,accessChat)
router.route('/').get(protect, fetchChats)
router.route("/group").post(protect, createGroupChat)
router.route("/rename").put(protect, renameGroup)
router.route("/groupadd").put(protect,addToGroup)
router.route("/groupremove").put(protect, removeFromGroup)


module.exports = router