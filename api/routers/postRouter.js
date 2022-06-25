const router = require('express').Router()
const postCtrl = require('../controllers/postCtrl')
const auth = require('../middleware/auth')

router.route('/posts')
    .post(auth, postCtrl.createPost)
    .get(auth, postCtrl.getPost)

router.route('/post/:id')
    .patch(auth, postCtrl.updatePost)
    .get(auth, postCtrl.getOnePost)
    .delete(auth, postCtrl.deletePost)

router.patch('/post/:id/like', auth, postCtrl.likePost)
router.patch('/post/:id/unlike', auth, postCtrl.unLikePost)
router.get('/user_posts/:id', auth, postCtrl.getUserPosts)

router.get('/post_discover', auth, postCtrl.getPostDiscover)
router.patch('/savePost/:id', auth, postCtrl.savedPost)
router.patch('/unSavePost/:id', auth, postCtrl.unSavedPost)
router.get('/getSavePost', auth, postCtrl.getSavedPost)

module.exports = router