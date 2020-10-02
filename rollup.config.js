// rollup.config.js
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import {
  getBabelOutputPlugin
} from '@rollup/plugin-babel'
import babel from '@rollup/plugin-babel'
import {
  terser
} from 'rollup-plugin-terser'

const browserBuild = {
  input: 'src/index.js',
  output: {
    file: 'lib/gridintensity.browser.js',
    format: 'iife',
    name: 'GridIntensity'
  },
  plugins: [
    resolve({
      browser: true
    })
  ]
}

const browserBuildMin = {
  input: 'src/browser.bundle.js',
  output: {
    file: 'lib/gridintensity.browser.min.js'
  },
  plugins: [
    resolve({
      browser: true
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    terser()
  ]
}

const nodeBuild = {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
    exports: 'default'
  },
  plugins: [
    resolve({
      preferBuiltins: true
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled'
    }),
    getBabelOutputPlugin({
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current'
            }
          }
        ]
      ]
    })
  ]
}

export default [browserBuild, browserBuildMin, nodeBuild]