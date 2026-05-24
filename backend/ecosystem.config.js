module.exports = {
  apps: [
    {
      name: "Blog",
      script: "server.js",
      cwd: "/home/usezolv/apps_nodejs",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
        // PORT: "5000" // uncomment if you want PM2 to set the PORT
      }
    }
  ]
};
