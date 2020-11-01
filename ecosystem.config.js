module.exports = {
  apps : [{
      script: "./app.js",
      watch: ['controllers', 'models', 'routers', 'app.js'],
      // Delay between restart
      watch_delay: 500,
      ignore_watch : ["node_modules", "./public/images", "./public/css", 'views', 'ecosystem.config.js'],
      watch_options: {
        "followSymlinks": false
      }
  }, {
    name: 'sass',
    script: './node_modules/sass/sass.js',
    args: '--watch src/scss/:dist/css'
  }
],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production && npm run build ',
      'pre-setup': ''
    }
  }
};
