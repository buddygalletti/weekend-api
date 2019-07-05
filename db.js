const Sequelize = require('sequelize');

const db = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/acme_db',
  { logging: false }
);

const User = db.define('user', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  }
});

const Department = db.define('department', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  }
});

User.belongsTo(Department);
Department.hasMany(User);

const syncAndSeed = async () => {
  await db.sync({ force: true });
  const crewMembers = [
    'Jean-Luc Picard',
    'William Riker',
    'Data',
    'Geordi La Forge',
    'Beverly Crusher',
    'Deanna Troi',
    'Worf'
  ];
  const [picard, riker, data, geordi, crusher, troi, worf] = await Promise.all(
    crewMembers.map(name => User.create({ name }))
  );
  const departments = [
    'Command',
    'Science',
    'Engineering',
    'Medical & Counseling',
    'Security'
  ];
  const [command, science, engineering, medical, security] = await Promise.all(
    departments.map(name => Department.create({ name }))
  );

  picard.departmentId = command.id;
  riker.departmentId = command.id;
  data.departmentId = command.id;
  geordi.departmentId = engineering.id;
  crusher.departmentId = medical.id;
  troi.departmentId = medical.id;
  worf.departmentId = security.id;

  picard.save();
  riker.save();
  data.save();
  geordi.save();
  crusher.save();
  troi.save();
  worf.save();
};

module.exports = {
  syncAndSeed,
  models: {
    User,
    Department
  }
};
