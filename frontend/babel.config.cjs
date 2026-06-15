module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }]
  ],
  plugins: [
    ({ types: t }) => ({
      visitor: {
        MetaProperty(path) {
          if (path.node.meta.name === "import" && path.node.property.name === "meta") {
            path.replaceWith(
              t.objectExpression([
                t.objectProperty(
                  t.identifier("env"),
                  t.objectExpression([
                    t.objectProperty(
                      t.identifier("VITE_API_URL"),
                      t.stringLiteral("http://localhost:5000/api")
                    )
                  ])
                )
              ])
            );
          }
        }
      }
    })
  ]
};
