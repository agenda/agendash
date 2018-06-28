
import Koa from 'koa';
import koaLogger from 'koa-logger';
import Agenda from 'agenda';
import Agendash from 'agendash';

const app = new Koa();
app.use(koaLogger());

const agenda = new Agenda({
  db: {
    address: 'mongodb://127.0.0.1/agendaDb'
  }
});

agenda.define('testJob', (job, done) => {
  try {
    console.log('this is a testJob', job.attrs.data, new Date());
    done();
  }catch (err) {
    done(new Error(err));
  }
});

agenda.on('ready', () => {
  console.log("agenda start succeed");
  agenda.start();
});

app.use(Agendash(agenda, {
  middleware: 'koa',
  prefix: '/dash'
}));


app.listen(process.env.PORT || '3000');
