const router = require('express').Router();
const { celebrate } = require('celebrate');
const validators = require('../../validators/users');
const UserModel = require('../../models/users');

const getUserMiddleware = (req, res, next) =>
  UserModel.findOne({ _id: req.params.userId }).then((user) => {
    if (!user) return res.boom.notFound();
    req.user = user;
    return next();
  });

router
  .route('/')
  .get(celebrate(validators.getlist), async (req, res) => {
    try {
      const result = await UserModel.find(req.query);
      return res.send(result);
    } catch (err) {
      res.boom.badRequest(err);
    }
  });
router
  .route('/:userId')
  .get(celebrate(validators.processOne), getUserMiddleware, async (req, res) => {
    try {
      res.send(req.user);
    } catch (err) {
      res.boom.badRequest(err);
    }
  })
  .patch(celebrate(validators.patchOne), getUserMiddleware, async (req, res) => {
    try {
      Object.assign(req.user, req.body);
      await req.user.save();
      res.send(req.user);
    } catch (err) {
      res.boom.badRequest(err);
    }
  })
  .delete(celebrate(validators.processOne), getUserMiddleware, async (req, res) => {
    try {
      const result = await UserModel.delete({ _id: req.params.userId });
      res.send(result);
    } catch (err) {
      res.boom.badRequest(err);
    }
  });

module.exports = router;
