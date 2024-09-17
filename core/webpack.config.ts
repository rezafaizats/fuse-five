import path from 'path'
import webpack from 'webpack'
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ZipWebpackPlugin = require('zip-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ImageminWebpackPlugin = require('imagemin-webpack-plugin').default
const ImageminPngquant = require('imagemin-pngquant')
const JavaScriptObfuscator = require('webpack-obfuscator')

__dirname = path.resolve(__dirname, '../');

const config: webpack.Configuration = {
    entry: {
        main: path.resolve(__dirname, 'src/boot.ts'),
    },
    resolve: {
        alias: {
            Core: path.resolve(__dirname, 'core'),
            Src: path.resolve(__dirname, 'src'),
            Assets: path.resolve(__dirname, 'assets'),
            Data: path.resolve(__dirname, 'data'),
        },
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|jpeg|gif|ogg|mp3|aac)$/,
                include: [
                    path.resolve(__dirname, 'core/static'),
                    path.resolve(__dirname, 'assets'),
                ],
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                        }
                    }
                ],
            },
            {
                test: /\.json$/,
                include: [
                    path.resolve(__dirname, 'core/static'),
                    path.resolve(__dirname, 'assets'),
                ],
                exclude: /(atlas)\.json$/,
                type: 'javascript/auto',
                use: [
                    {
                        loader: 'file-loader',
                    }
                ],
            },
            {
                test: /atlas\.json/,
                include: [
                    path.resolve(__dirname, 'core/static'),
                    path.resolve(__dirname, 'assets'),
                ],
                type: 'javascript/auto',
                use: [
                    {
                        loader: 'free-tex-packer-webpack-loader'
                    }
                ],
            },
            {
                test: /\.css$/,
                include: [
                    path.resolve(__dirname, 'core/static'),
                    path.resolve(__dirname, 'assets'),
                ],
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ],
            },
            {
                test: /\.ttf$/,
                include: [
                    path.resolve(__dirname, 'core/static'),
                    path.resolve(__dirname, 'assets'),
                ],
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { url: false } },
                    'fontface-loader',
                ],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'core/static/index.html'),
        }),
    ],
}

module.exports = (env: any, args: any) => {
    const packageJson = require(path.resolve(__dirname, "package.json"))

    let gameName: string = packageJson.name;
    let version: string = `-${packageJson.version}`;

    let postfix: string = ''

    config.output = {
        path: path.resolve(__dirname, `dist/${gameName}`),
    }

    if ((args.mode === 'production') && (env ? !env.dev : true)) {
        postfix = '-prod'
    }

    if ((args.mode === 'development') || (env ? env.dev : false)) {
        postfix = '-dev'
    }

    if (config.module) {
        config.module.rules.unshift(
            {
                test: /\.ts$/,
                include: [
                    path.resolve(__dirname, 'core'),
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'assets/_'),
                    path.resolve(__dirname, 'data'),
                ],
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    },
                    {
                        loader: 'ifdef-loader',
                        options: {
                            __DEV__: (args.mode === 'development') || (env ? env.dev : false),
                            __MOCK__: env ? env.mock : false,
                        }
                    }
                ]
            }
        )
    }

    if (env) {

        if (env.mock) {
            postfix += '-mock'
        }
        else {
            postfix += '-live'
        }

        if (env.build) {

            const cleanList = [`dist/${gameName}${postfix}/*`]

            if (!env.selfContained) {
                if (config.output) {
                    // config.output.publicPath = privateConfig.publicPath
                }
            }

            if (env.zip) {
                if (config.plugins) {
                    config.plugins.push(new ZipWebpackPlugin({
                        path: '..',
                        filename: `${gameName}${version}${postfix}.zip`,
                    }))

                    cleanList.push(`dist/${gameName}${version}${postfix}.zip`)
                }
            }

            if (!env.noObfuscation) {
                if (config.plugins) {
                    config.plugins.push(new JavaScriptObfuscator({
                        compact: true,
                        controlFlowFlattening: false,
                        deadCodeInjection: false,
                        debugProtection: false,
                        debugProtectionInterval: false,
                        disableConsoleOutput: true,
                        identifierNamesGenerator: 'hexadecimal',
                        log: false,
                        renameGlobals: false,
                        rotateStringArray: true,
                        selfDefending: true,
                        stringArray: true,
                        stringArrayEncoding: false,
                        stringArrayThreshold: 0.75,
                        unicodeEscapeSequence: false
                    }))
                }
            }

            config.optimization = {
                usedExports: true,
                minimizer: [
                    new TerserWebpackPlugin({
                        cache: true,
                        parallel: true,
                        terserOptions: {
                            output: {
                                comments: false
                            },
                        }
                    })
                ]
            }

            if (!env.noClean) {
                if (config.plugins) {
                    config.plugins.unshift(new CleanWebpackPlugin({
                        cleanOnceBeforeBuildPatterns: cleanList
                    }))
                }
            }

        }

        if (env.devServer) {
            config.devServer = {
                contentBase: path.resolve(__dirname, `dist/${gameName}${postfix}`),
                host: '0.0.0.0',
                port: env.port ?? 3333,
                open: false,
                useLocalIp: true,
            }

            config.devtool = 'inline-source-map'
        }

    }

    if (config.output) {
        if (config.output.path) {
            config.output.path += postfix
        }
    }

    return config
}