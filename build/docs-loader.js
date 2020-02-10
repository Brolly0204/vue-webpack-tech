// 自定义loader: https://webpack.docschina.org/concepts/loaders/
// vue自定义块: https://vue-loader.vuejs.org/zh/guide/custom-blocks.html#example
module.exports = function(source, map) {
  this.callback(
    null,
    `
    export default function(Component) {
      Component.options.__docs=${JSON.stringify(source)}
    }
  `,
    map
  )
}

// 常用loader: https://webpack.docschina.org/loaders
// 如何编写loader: https://webpack.docschina.org/contribute/writing-a-loader
