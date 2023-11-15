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
const paymentRoute = require('./routes/paymentRoute');
const receiptRoute = require('./routes/receiptRoute');
const notFound = require('./middlewares/notFound');
const error = require('./middlewares/error');
const authenticate = require('./middlewares/authenticate');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // option สำหรับ dev อีก optionคือ 'combined'
}

app.use(cors()); // server รับ req ต่าง domain ได้
app.use(express.json()); // body parser
app.use(express.urlencoded({ extended: false })); // body parser

app.use('/auth', authRoute);
app.use('/staffs', authenticate.authorizeStaff, staffRoute);
app.use('/patients', authenticate.authorizeStaff, patientRoute);
app.use('/cases', authenticate.authorizeStaff, caseRoute);
app.use('/treatments', authenticate.authorizePatient, treatmentRoute);
app.use('/appointments', appointmentRoute);
app.use('/payments', authenticate.authorizeStaff, paymentRoute);
app.use('/receipts', receiptRoute);

app.use(notFound);
app.use(error);

const port = process.env.PORT || 8000; // จะ process.env ได้ ต้อง require('dotenv').config();
app.listen(port, () => console.log(`server running on port: ${port}`));
