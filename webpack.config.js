module.exports = {
    entry: "./src/static/js/index.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
          {
   test: /\.js$/,
   exclude: /(node_modules|bower_components)/,
   loader: 'babel', // 'babel-loader' is also a valid name to reference
   query: {
     presets: ['es2015']
   }
 }
        ]
    }
};
