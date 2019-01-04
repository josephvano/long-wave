module.exports = {
  apps : [{
    name: 'jobs',
    script: 'ts-node',
    args: './src/jobs/index.ts',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: true,
    output: '/var/log/longwave/pm-jobs-out.log',
    error: '/var/log/longwave/pm-jobs-error.log',
    ignore_watch: ['logs', 'downloads', 'uploads'],
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      LONGWAVE_LOG_PATH: '/var/log/longwave'
    },
    env_production: {
      NODE_ENV: 'production',
      LONGWAVE_LOG_PATH: '/var/log/longwave'
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
