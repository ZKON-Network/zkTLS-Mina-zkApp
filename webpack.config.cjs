const path = require('path');

module.exports = {
  entry: './build/src/ZkonRequest.js', // Path to your main file
  output: {
    filename: 'bundle.js', // Output file
    path: path.resolve(__dirname, 'dist'), // Output directory
    library: {
      type: 'commonjs2', // Ensure it uses CommonJS2 export format
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Use Babel for ES6+ support
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
};
