const vendors = [
  'react',
  'react-dom',
  'redux-thunk',
  'react-redux',
  'react-router',
  'react-router-redux',
  'redux',
]

module.exports = {
  entry: {
    index: "./src/index.tsx",
    vendor: vendors,
  },
  output: {
    filename: "index.js",
    path: __dirname + "/dist",
    publicPath: '/dist/',
    chunkFilename: '[name].[chunkhash:5].js'
  },
  performance: {
    hints: "warning",
    maxAssetSize: 30000000,
    maxEntrypointSize: 50000000,
    assetFilter: function (assetFilename) {
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js')
    }
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".less", ".css", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'react', 'stage-2']
        }
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      },
      {
        test: /src\/containers(\/.*).(tsx|ts)/,
        loader: "bundle-loader?lazy!ts-loader"
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader?modules"
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader',
      },
    ]
  },

  plugins: [
  ],
}
