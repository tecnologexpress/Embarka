module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
  ],
  rules: {
    // Regras customizadas para convenções em português
    '@typescript-eslint/naming-convention': [
      'error',
      // Constantes devem estar em UPPER_CASE
      {
        selector: 'variable',
        modifiers: ['const'],
        format: ['UPPER_CASE'],
        filter: {
          regex: '^(default|require|module|exports|__dirname|__filename|console|process|Buffer|global|APP)$',
          match: false
        }
      },
      // Variáveis var e let devem estar em snake_case
      {
        selector: 'variable',
        format: ['snake_case'],
        filter: {
          regex: '^(default|require|module|exports|__dirname|__filename|console|process|Buffer|global)$',
          match: false
        }
      },
      // Classes devem estar em PascalCase
      {
        selector: 'class',
        format: ['PascalCase']
      },
      // Parâmetros de função devem começar com prm_ e estar em snake_case
      {
        selector: 'parameter',
        format: ['snake_case'],
        prefix: ['prm_'],
        filter: {
          regex: '^(req|res|next|err|error)$',
          match: false
        }
      },
      // Métodos e funções em snake_case
      {
        selector: 'function',
        format: ['camelCase']
      },
      {
        selector: 'method',
        format: ['camelCase']
      },
      // Interfaces em PascalCase
      {
        selector: 'interface',
        format: ['PascalCase']
      },
      // Types em PascalCase
      {
        selector: 'typeAlias',
        format: ['PascalCase']
      }
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
  },
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  // Ignora algumas regras para arquivos específicos
  overrides: [
    {
      files: ['*.config.js', '*.config.ts', 'jest.config.js'],
      rules: {
        '@typescript-eslint/naming-convention': 'off'
      }
    }
  ]
};