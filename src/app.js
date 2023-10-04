// const { sequelize } = require('./models');
// sequelize.sync();

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoute = require('./routes/authRoute');
const staffRoute = require('./routes/staffRoute');
const patientRoute = require('./routes/patientRoute');
const caseRoute = require('./routes/caseRoute');
const treatmentRoute = require('./routes/treatmentRoute');
const appointmentRoute = require('./routes/appointmentRoute');
const notFound = require('./middlewares/notFound');
const error = require('./middlewares/error');
const authenticate = require('./middlewares/authenticate');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // option สำหรับ dev อีก optionคือ 'combined'
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRoute);
app.use('/staffs', authenticate.authorizeStaff, staffRoute);
app.use('/patients', authenticate.authorizeStaff, patientRoute);
app.use('/cases', authenticate.authorizeStaff, caseRoute);
app.use('/treatments', authenticate.authorizePatient, treatmentRoute);
app.use('/appointments', appointmentRoute);

app.use(notFound);
app.use(error);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server running on port: ${port}`));
