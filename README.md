# Arenda React Dashboard

- A Dashboard for [@hokify/agenda](https://github.com/hokify/agenda).
- Got folk from [Agendash](https://github.com/agenda/agendash).

## Installation

```bash
# npm
npm install agenda-react

# yarn
yarn add agenda-react
```

## Usage with Express JS

```typescript
import express from 'express';
import { Agenda } from '@hokify/agenda';
import Agendash from 'agenda-react/agendash/app';

const app = express();

const agenda = new Agenda({
  db: {
    address: `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,
    collection: 'agenda',
  },
});

const agendashMiddlewarePromise = Agendash(agenda, {});

(async()=>{
   const agendash = await agendashMiddlewarePromise
   app.use(agendash);

   #... Your code
})()
```

## How to visit the dashboard
- Go to the dashboard: http://[your-host]/agenda-dashboard

## Authentication
- You need to write a new middleware for this

## Features
- Job status auto-refreshes: 60-second polling by default.
- Schedule a new job from the UI.
- Dive in to see more details about the job, like the json data.
- Requeue a job. Clone the data and run immediately.
- Delete jobs. Useful for cleaning up old completed jobs.
- Search jobs by name and metadata. Supports querying by Mongo Object Id.
- Filter jobs by name, property, value, state
- Schedule Job with options list (now, everyday, one day in every week, and one day in every month)
- Pagination
- Responsive UI

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)