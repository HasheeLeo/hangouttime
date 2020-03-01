module.exports = (api) => {
  api.cache(true);

  return {
    plugins: [
      ['babel-plugin-root-import', {
        'paths': [{
          'rootPathSuffix': 'src/js'
        }, {
          'rootPathPrefix': '%',
          'rootPathSuffix': 'src/assets'
        }]
      }]
    ],
    presets: ['module:metro-react-native-babel-preset']
  }
};
