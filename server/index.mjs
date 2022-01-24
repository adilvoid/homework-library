import express, { response } from 'express';
import { resolve } from 'path';
import { __dirname } from './globals.mjs';
import { readData, writeData } from './fileUtils.mjs';

const app = express();

const hostname = 'localhost';
const port = 4321;

let bookcases = [];
//Middleware для разрешения CORS-запросов
app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Middleware для формирования ответа в формате JSON
app.use(express.json());

// Middleware для логирования запросов
app.use((request, response, next) => {
  console.log(
    (new Date()).toISOString(),
    request.ip,
    request.method,
    request.originalUrl
  );

  next();
});
//Middleware для правильного представления request-body
app.use(express.json());

// Middleware для раздачи статики
app.use('/', express.static(
  resolve(__dirname, '..', 'public')
));

//---------------------------------------------------
// Роуты приложения
app.options('/*', (request, response) => {
  response.statusCode = 200;
  response.send('OK');
});
// Получение всех шкафов
app.get('/bookcases', (request, response) => {
  response
    .setHeader('Content-Type', 'application/json')
    .status(200)
    .json(bookcases);
});

// Создание нового шкафа
app.post('/bookcases', async (request, response) => {
  console.log(request);
  const { bookcaseName } = request.body;
  bookcases.push({
    bookcaseName,
    books: []
  });
  await writeData(bookcases);

  response
    .setHeader('Content-Type', 'application/json')
    .status(200)
    .json({
      info: `Bookcase '${bookcaseName}' was successfully created`
    });
});

// Создание новой книги
app.post('/bookcases/:bookcaseId/books', async (request, response) => {
  const { bookName } = request.body;
  const bookcaseId = Number(request.params.bookcaseId);

  if (bookcaseId < 0 || bookcaseId >= bookcases.length) {
    response
      .setHeader('Content-Type', 'application/json')
      .status(404)
      .json({
        info: `There is no bookcase with id = ${bookcaseId}`
      });
    return;
  }

  bookcases[bookcaseId].books.push(bookName);
  await writeData(bookcases);
  response
    .setHeader('Content-Type', 'application/json')
    .status(200)
    .json({
      info: `Book '${bookName}' was successfully added in bookcase '${bookcases[bookcaseId].bookcaseName}'`
    });
});

// Изменение книги
app.put('/bookcases/:bookcaseId/books/:bookId', async (request, response) => {
  const { newBookName } = request.body;
  const bookcaseId = Number(request.params.bookcaseId);
  const bookId = Number(request.params.bookId);

  if (bookcaseId < 0 || bookcaseId >= bookcases.length
    || bookId < 0 || bookId >= bookcases[bookcaseId].books.length) {
    response
      .setHeader('Content-Type', 'application/json')
      .status(404)
      .json({
        info: `There is no bookcase with id = ${bookcaseId} or book with id = ${bookId}`
      });
    return;
  }

  bookcases[bookcaseId].books[bookId] = newBookName;
  await writeData(bookcases);
  response
    .setHeader('Content-Type', 'application/json')
    .status(200)
    .json({
      info: `Book №${bookId} was successfully edited in bookcase '${bookcases[bookcaseId].bookcaseName}'`
    });
});

// Удаление книги
app.delete('/bookcases/:bookcaseId/books/:bookId', async (request, response) => {
  const bookcaseId = Number(request.params.bookcaseId);
  const bookId = Number(request.params.bookId);

  if (bookcaseId < 0 || bookcaseId >= bookcases.length
    || bookId < 0 || bookId >= bookcases[bookcaseId].books.length) {
    response
      .setHeader('Content-Type', 'application/json')
      .status(404)
      .json({
        info: `There is no bookcase with id = ${bookcaseId} or book with id = ${bookId}`
      });
    return;
  }

  const deletedBookName = bookcases[bookcaseId].books[bookId];
  bookcases[bookcaseId].books.splice(bookId, 1);
  await writeData(bookcases);
  response
    .setHeader('Content-Type', 'application/json')
    .status(200)
    .json({
      info: `Book '${deletedBookName}' was successfully deleted from bookcase '${bookcases[bookcaseId].bookcaseName}'`
    });
});

// Перенос книги из одного шкафа в другой
app.patch('/bookcases/:bookcaseId', async (request, response) => {
  const fromBookcaseId = Number(request.params.bookcaseId);
  const { toBookcaseId, bookId } = request.body;

  if (fromBookcaseId < 0 || fromBookcaseId >= bookcases.length
    || bookId < 0 || bookId >= bookcases[fromBookcaseId].books.length
    || toBookcaseId < 0 || toBookcaseId >= bookcases.length) {
    response
      .setHeader('Content-Type', 'application/json')
      .status(404)
      .json({
        info: `There is no bookcase with id = ${fromBookcaseId} of ${toBookcaseId} or book with id = ${bookId}`
      });
    return;
  }

  const movedBookName = bookcases[fromBookcaseId].books[bookId];

  bookcases[fromBookcaseId].books.splice(bookId, 1);
  bookcases[toBookcaseId].books.push(movedBookName);

  await writeData(bookcases);
  response
    .setHeader('Content-Type', 'application/json')
    .status(200)
    .json({
      info: `Book '${movedBookName}' was successfully moved from bookcase '${bookcases[fromBookcaseId].bookcaseName}' to bookcase '${bookcases[toBookcaseId].bookcaseName
        }'`
    });
});

//---------------------------------------------------

// Запуск сервера
app.listen(port, hostname, async (err) => {
  if (err) {
    console.error('Error: ', err);
    return;
  }

  console.log(`Out server started at http://${hostname}:${port}`);

  const bookcasesFromFile = await readData();
  bookcasesFromFile.forEach(({ bookcaseName, books }) => {
    bookcases.push({
      bookcaseName,
      books: [...books]
    });
  });
});
