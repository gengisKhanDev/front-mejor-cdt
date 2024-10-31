const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js', // La entrada de tu proyecto
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/', // Esto asegura que los archivos sean servidos desde la raíz
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Solo una vez
      filename: 'index.html', // Asegúrate de que solo haya un `index.html`
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '', globOptions: { ignore: ['**/index.html'] } }, // Ignora el `index.html` aquí para no sobrescribir
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // Sirve archivos desde 'public'
    },
    port: 3000,
    historyApiFallback: true, // Para manejar rutas en aplicaciones SPA
    open: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
