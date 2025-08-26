module.exports = {
    HOST: process.env.DB_HOST || "mysql-svc", // le service MySQL dans K8s
    USER: process.env.DB_USER || "root",
    PASSWORD: process.env.DB_PASSWORD || "your_password_here",
    DB: process.env.DB_NAME || "todolist_db",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
