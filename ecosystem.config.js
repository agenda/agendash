module.exports = [
  {
    name: 'Agenda.dashboard',
    script: 'node ./bin/agendash-standalone.js',
    watch: false,
    time: false,
    instances: 1,
    autorestart: true,
    exec_mode: 'fork',
    max_restarts: 3, // number of consecutive unstable restarts
    min_uptime: 300000, // 5min
    combine_logs: true,
    out_file: '~/.pm2/logs/Agenda/dashboard/out.log',
    error_file: '~/.pm2/logs/Agenda/dashboard/error.log',
  },
];
