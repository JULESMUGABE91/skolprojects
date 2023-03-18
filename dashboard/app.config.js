
module.exports = {
    apps: [
        {
            name: "cleanKigali",
            script: "./node_modules/react-scripts/scripts/start.js",
            env: {
                "PORT": 3519,
                "NODE_ENV": "production"
            }
        }
    ]
}