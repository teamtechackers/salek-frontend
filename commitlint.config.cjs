module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build','chore','ci','docs','feat','fix','perf','refactor','revert','style','test','ui','core'
      ]
    ],
    'scope-enum': [
      2,
      'always',
      [
        'auth','user','ui','core','routes','services','store','components','pages','layouts','utils','login'
      ]
    ],
    'header-max-length': [2, 'always', 72]
  }
};
