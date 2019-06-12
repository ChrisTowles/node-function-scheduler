




import express from 'express';
import bodyParser from 'body-parser';

// import Arena from 'bull-arena';

const Arena = require('bull-arena');
import url from 'url';
import { db } from './db';
import { queues } from './queues';
import { PORT, REDIS_URL} from './config';


const app = express();

app.use(bodyParser.json());


app.get('/', (req, res) => res.send(`
<h1>Starfish - Node Function Scheduler</h1>


<br /> 
<h2>
    Go to <a href="/arena">arena-page</a>
</h2>
<br/>
<br/>
<h4> This is a Spike on how we might replace talend for function scheduling. 

`));

app.post('/example', (req, res) => {
  console.log(`Hit example with ${JSON.stringify(req.body)}`);
  return res.sendStatus(200);
});

function getRedisConfig(redisUrl:string) {
  const redisConfig = url.parse(redisUrl);
  return {
    host: redisConfig.hostname || 'localhost',
    port: Number(redisConfig.port || 6379),
    database: (redisConfig.pathname || '/0').substr(1) || '0',
    password: redisConfig.auth ? redisConfig.auth.split(':')[1] : undefined
  };
}

// add all the queues we added to arena
const arenaConfigQueues: any = [];
queues.forEach( queue => {
    arenaConfigQueues.push({
        name: queue.name,
        hostId: 'Worker',
        redis: getRedisConfig(REDIS_URL)
    });
})

const arenaConfig = Arena(
    {
      queues: arenaConfigQueues
    },
    {
      basePath: '/arena',
      disableListen: true
    }
  );

app.use('/', arenaConfig);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
});
