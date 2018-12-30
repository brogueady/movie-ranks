module.exports = {
    'parser': 'babel-eslint',
    'env': {
        'browser': true,
        'es6': true,
        'jsx-control-statements/jsx-control-statements': true
    },
    'extends': ['eslint:recommended', 'plugin:jsx-control-statements/recommended', 'plugin:react/recommended'],
    'parserOptions': {
        'ecmaFeatures': {
            'experimentalObjectRestSpread': true,
            'jsx': true
        },
        'sourceType': 'module'
    },
    'plugins': [
        'react',
        'flowtype',
        'jsx-control-statements'
    ],
    'rules': {
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ],
        "react/prop-types": 1,
        'no-useless-escape': 0,
        'no-unused-vars': [
            'error',
            {'varsIgnorePattern': 'React|Router|Provider|action|state'}
        ],
        'no-restricted-globals': [
            'error',
            'fetch'
        ],
        'flowtype/define-flow-type': 1,
        'flowtype/space-after-type-colon': [
            1,
            'always'
        ],
        'flowtype/space-before-type-colon': [
            1,
            'never'
        ],
        'flowtype/use-flow-type': 1,
        'flowtype/valid-syntax': 1,
        'flowtype/require-parameter-type': ['off'],
        'jsx-control-statements/jsx-use-if-tag': 0,
        'jsx-control-statements/jsx-jcs-no-undef': 1,
        'react/jsx-no-undef': 0,
        'no-undef': 0
    },
    'settings': {
        'flowtype': {
            'onlyFilesWithFlowAnnotation': true
        },
        'react': {
            'pragma': 'React',  // Pragma to use, default to 'React'
            'version': '15.6.1' // React version, default to the latest React stable release
        }
    },
    'globals': {
        'process': true,
        'module': true,
        'require': true,
        'getState': true,
        'ReactPerf': true,
        'Choose': true,
        'When': true,
        'If': true,
        'Otherwise': true,
        'utag_data': true,
        'googletag': true,
        'navigator': true,
        'FB': true
    }
};
