const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db');
const routes = require('./routes');

const app = express();
app.use(bodyParser.json());
app.use('/api', routes);

sequelize.sync({ force: true }).then(() => {
  console.log('Database connected');
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
