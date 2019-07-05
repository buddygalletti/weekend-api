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
app.get('/api/users', async (req, res, next) => {
  try {
    res.send(await User.findAll());
  } catch (ex) {
    next(ex);
  }
});

app.post('/api/users', async (req, res, next) => {
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

app.get('/api/users/:id', async (req, res, next) => {
  try {
    res.send(await User.findByPk(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

app.put('/api/users/:id', async (req, res, next) => {
  try {
    const newCrew = await User.findByPk(req.params.id);
    await newCrew.update({
      name: req.body.name,
      departmentId: req.body.departmentId
    });
    res.send(newCrew);
  } catch (ex) {
    next(ex);
  }
});

app.delete('/api/users/:id', async (req, res, next) => {
  try {
    await User.destroy({
      where: {
        id: req.params.id
      }
    });
  } catch (ex) {
    next(ex);
  }
});

// All of the Department routes
app.get('/api/departments', async (req, res, next) => {
  try {
    res.send(await Department.findAll());
  } catch (ex) {
    next(ex);
  }
});

app.post('/api/departments', async (req, res, next) => {
  try {
    const [newDept, wasCreated] = await findOrCreate({
      where: {
        name: req.body.name
      }
    });
    if (wasCreated) {
      res.send(newDept);
    }
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/departments/:id', async (req, res, next) => {
  try {
    res.send(await Department.findByPk(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

app.put('/api/departments/:id', async (req, res, next) => {
  try {
    const newDept = await Department.findByPk(req.params.id);
    await newDept.update({
      name: req.body.name
    });
    res.send(newDept);
  } catch (ex) {
    next(ex);
  }
});

app.delete('/api/departments/:id', async (req, res, next) => {
  try {
    await Department.destroy({
      where: {
        id: req.params.id
      }
    });
  } catch (ex) {
    next(ex);
  }
});

app.listen(port, () => console.log(`listening on port ${port}`));
