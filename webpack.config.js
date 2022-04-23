const path = require('path');

module.exports = (env = {}) => {
  const { mode = process.env.NODE_ENV ?? 'development' } = env;

  return {
    mode,
    entry: './src/index.ts',
    target: ['web', 'es6'],
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /(node_modules)/,
          resolve: {
            extensions: ['.ts', '.js'],
          },
          use: [
            { loader: 'ts-loader' }
          ],
        },
      ],
    },
  };
};
