// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';


const browserBuild = {
  input: 'src/bundle.js',
  output: {
    file: 'public/main.js',
    format: 'iife',
    name: "GridItensity"
  },
  plugins: [
    resolve(),
    babel({ babelHelpers: 'bundled' }),
    terser()
    // getBabelOutputPlugin({
    //   allowAllFormats: true,
    //   plugins: [
    //     // "@babel/plugin-transform-runtime"
    //   ],
    //   presets: [['@babel/preset-env']]
    // })
  ]
}

const nodeBuild = {
  input: 'src/node.js',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
    exports: "default"
  },
  plugins: [
    resolve({
      preferBuiltins: true
    }),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
    getBabelOutputPlugin({
      presets: [['@babel/preset-env',
        {
          targets: {
            node: "current"
          }
        }]]
    })
  ]
}

export default [
  browserBuild,
  nodeBuild
];
