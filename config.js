const HOST = {
  production: "",
  development: "http://localhost:3000"
}

const MONGO_URI = {
  production: "",
  development: "mongodb://localhost:27017"
}

const ENV = "development";

module.exports = {
    secret: 'caw94yan4pmiohfiuy',
    facebook: {
        clientSecret: 'f236026d3025fdfaebe95de3ce51971b',
        clientID: '139328730000224',
        callbackURL: HOST[ENV] + "/auth/facebook/callback",
        profileFields: ['id', 'name', 'displayName', 'email']
    },
    mongoURI: MONGO_URI[ENV],
    API: HOST[ENV],
}
