module.exports = (on, config) => {
    require('./mongodb')(on);
    return config;
  };