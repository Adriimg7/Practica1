import express from 'express';
import path from 'path';
import url from 'url';

const STATIC_DIR = url.fileURLToPath(new URL('.', import.meta.url));
const PORT = 3000;

const app = express();
app.use('/', express.static(path.join(STATIC_DIR, 'public')));


// app.get('/libreria/api/*', (req, res) => {
//   res.status(501).send('Not implemented, yet!');
// });
// app.use('/libreria/components', express.static(path.join(__dirname, 'public/components')));

// app.use('/libreria/model', express.static(path.join(__dirname, 'public/model')));

// app.use('/libreria/test', express.static(path.join(__dirname, 'public/test')));

app.use('/libreria*', (req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'public/libreria/index.html'));
});

app.all('*', function (req, res, next) {
  console.error(`${req.originalUrl} not found!`);
  res.status(404).send('<html><head><title>Not Found</title></head><body><h1>Not found!</h1></body></html>')
})

app.listen(PORT, function () {
  console.log(`Static HTTP server listening on ${PORT}`)
})