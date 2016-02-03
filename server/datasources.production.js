console.log('---------- config ----------');
console.log('host: ', process.env.OPENSHIFT_MONGODB_DB_HOST);
console.log('port: ', process.env.OPENSHIFT_MONGODB_DB_PORT);
console.log('user: ', process.env.OPENSHIFT_MONGODB_DB_USERNAME);
console.log('pass: ', process.env.OPENSHIFT_MONGODB_DB_PASSWORD);
console.log('---------- config ----------');

module.exports = {
  mongoDb: {
    connector: 'mongodb',
    hostname: process.env.OPENSHIFT_MONGODB_DB_HOST,
    port: process.env.OPENSHIFT_MONGODB_DB_PORT,
    user: process.env.OPENSHIFT_MONGODB_DB_USERNAME,
    password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD,
    database: process.env.OPENSHIFT_APP_NAME
  }
};
