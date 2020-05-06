const { Router } = require('express');
const Link = require('./../models/Link');
const auth = require('./../middleware/auth.middleware');
const config = require('config');
const shortid = require('shortid');

const router = Router();

router.post('/generate', auth, async (req, res) => {
  try {
    const baseURL = config.get('baseURL');

    const { from } = req.body;

    const code = shortid.generate();

    const exists = await Link.findOne({ from });

    if (exists) {
      return res.json({ link: exists });
    }

    const to = baseURL + '/t/' + code;

    const link = new Link({ code, to, from, owner: req.user.userId });

    await link.save();

    res.status(201).json({ link });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/', auth, async (req, res) => {
  try {
    const links = await Link.find({ owner: req.user.userId });
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});
router.get('/:id', auth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    res.json(link);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
