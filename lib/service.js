import merge from 'deepmerge'

import { run, getSocket } from './app'

const DEFAULT_WINDOW_FEATURES = {
    menubar: 0,
    location: 1,
    resizable: 1,
    scrollbars: 0,
    status: 0,
    height: '700px',
    width: '400px'
}

export default class Visualizer {
    constructor () {
        this.windowName = 'WebdriverIO Visualizer'
        this.url = 'http://localhost:3000'
        this.options = DEFAULT_WINDOW_FEATURES
        this.emitEnabled = true
        this.config = {
            outlineElements: true,
            commandDelay: null
        }
    }

    before (...args) {
        this.config = merge(this.config, browser.options.visualizationOpts);

        [this.screen, this.innerWidth] = browser.execute(() => [window.screen, window.innerWidth]).value
        this.position = browser.windowHandlePosition().value

        this.options = merge(this.options, {
            left: this.position.x + this.innerWidth
        })

        /**
         * run visualizer app
         */
        browser.call(() => run())

        /**
         * load visulizer screen
         */
        const windowOptions = Object.keys(this.options).map((key) => `${key}=${this.options[key]}`)
        browser.execute((url, name, windowOptions) => {
            window.open(url, name, windowOptions)
        }, this.url, this.windowName, windowOptions.join(','))

        /**
         * connect to window
         */
        this.io = browser.call(() => getSocket())
    }

    beforeCommand (commandName, commandArgs) {
        if (this.emitEnabled) {
            this.io.emit('command', { commandName, commandArgs })
            this.emitEnabled = false
        }

        if (this.config.outlineElements && commandName === 'click') {
            const elem = browser.element(commandArgs[0])
            browser.execute((elem) => {
                if (!elem || !(elem instanceof Node)) {
                    return new Error('Element not a document node')
                }

                var oldOutline = document.querySelector('.wdio-outline')
                if (oldOutline) {
                    oldOutline.remove()
                }

                var rect = elem.getBoundingClientRect()
                var newOutline = document.createElement('div')
                newOutline.className = 'wdio-outline'
                newOutline.style.position = 'absolute'
                newOutline.style.border = '1px dashed red'
                newOutline.style.width = rect.width + 'px'
                newOutline.style.height = rect.height + 'px'
                newOutline.style.top = rect.top + 'px'
                newOutline.style.left = rect.left + 'px'
                document.querySelector('body').appendChild(newOutline)
                return true
            }, elem.value)
        }

        if (typeof this.config.commandDelay === 'number') {
            browser.pause(this.config.commandDelay)
        }

        browser.execute(() => {
            var oldOutline = document.querySelector('.wdio-outline')
            if (oldOutline) {
                oldOutline.remove()
            }
        })
    }

    afterCommand () {
        this.emitEnabled = true
    }
}
