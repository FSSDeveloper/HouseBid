//-- Farzaneh Sabzi

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
{
      name      : 'HouseBid',
      script    : 'app.js',
      watch: true,	      
      env: {
        COMMON_VARIABLE: 'true',
	NODE_ENV: 'development'
      },
      env_production : {
        NODE_ENV: 'production',
        PORT: 17020,
	APP_CONX: '/fa17g20',
        SQL_HOST: 'localhost',
        SQL_USR: 'fa17g20',
        SQL_PWS: 'fa17g20',
        SQL_DB: 'fa17g20'
      
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'node',
      host : 'localhost',
      ref  : 'origin/master',
      repo : 'https://github.com/CSC-648-SFSU/csc648-fall17-team20-FarzanehSabzi.git',
      path : '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    dev : {
      user : 'node',
      host : 'localhost',
      ref  : 'origin/stagging',
      repo : 'https://github.com/CSC-648-SFSU/csc648-fall17-team20-FarzanehSabzi.git',
      path : '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
};
