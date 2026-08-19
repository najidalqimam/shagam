/** @type {import('pm2').StartOptions[]} */
const apps = [
  {
    name: "shager_website",

    exec_mode: "cluster",
    autorestart: true,
    watch: false,
    args: "start -p 3035",

    script: "node_modules/next/dist/bin/next",
    env: {
      NODE_ENV: "production",
      PORT: 3035,
    },
  },
];



module.exports = { apps };
