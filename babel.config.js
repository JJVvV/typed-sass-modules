module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        // leave imports as they are
        modules: "commonjs"
      }
    ]
  ]
};
