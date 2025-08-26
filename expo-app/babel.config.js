module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@assets': './src/assets',
            '@components': './src/components',
            '@routes': './src/routes',
            '@screens': './src/screens',
            '@storage': './src/storage',
            '@theme': './src/theme',
            '@utils': './src/utils',
            '@data': './src/data',
            '@contexts': './src/contexts',
            '@services': './src/services',
            '@config': './src/config',
            '@hooks': './src/hooks'
          }
        }
      ],
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env.local',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true
        }
      ],
      'react-native-reanimated/plugin'
    ]
  };
};