const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const linkRoutes = require('./routes/link.routes');
const redirectRoutes = require('./routes/redirect.routes');

const app = express();

//app.use(express.json({ extended: true }));

app.use(
  express.json({
    extended: true,
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/link', linkRoutes);
app.use('/t', redirectRoutes);

if (process.env.NODE_ENV.trim() === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

async function start() {
  try {
    await mongoose.connect(config.get('mongoURL'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(PORT, () => console.log(`SERVER RUNNING on PORT ${PORT}`));
  } catch (error) {
    console.log(`Server has error ${error.message}`);
  }
}

start();

const PORT = config.get('port') || 5000;
