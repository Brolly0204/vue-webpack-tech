module.exports = {
  extends: [
    // 默认已经包含了相关vue eslint规则:
    // 'eslint:recommended',
    'plugin:vue/recommended'
    // 'plugin:vue/essential'
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error',
    'no-unused-vars': 'error'
  }
}

// 针对于vue eslint规则 https://eslint.vuejs.org/rules/
