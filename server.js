const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const db = require('./db');
const { User, Department } = db.models;
const { syncAndSeed } = require('./db');

const app = express();

app.use(require('cors')());

syncAndSeed();

// All of the User routes
app.get('/users', async (req, res, next) => {
  try {
    res.send(await User.findAll());
  } catch (ex) {
    next(ex);
  }
});

app.post('/users', async (req, res, next) => {
  try {
    const [newCrew, wasCreated] = await findOrCreate({
      where: {
        name: req.body.name
      }
    });
    if (wasCreated) {
      res.send(newCrew);
    }
  } catch (ex) {
    next(ex);
  }
});

app.put('/users/:id', async (req, res, next) => {});

app.listen(port, () => console.log(`listening on port ${port}`));
