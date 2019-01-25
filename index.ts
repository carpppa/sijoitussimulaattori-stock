import app from './src/app';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log('Express server listening on port ' + port);
});
