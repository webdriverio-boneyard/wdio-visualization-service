import merge from 'deepmerge'

import { run, getSocket } from './app'

const DEFAULT_WINDOW_FEATURES = {
    menubar: 0,
    location: 1,
    resizable: 1,
    scrollbars: 0,
    status: 0,
    height: '500px',
    width: '350px'
}

export default class Visualizer {
    constructor () {
        this.windowName = 'WebdriverIO Visualizer'
        this.url = 'http://localhost:3000'
        this.options = DEFAULT_WINDOW_FEATURES
    }

    before () {
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

        /**
         * wait until visualizer is ready
         */
        browser.pause(3000)
    }

    beforeCommand (commandName, commandArgs) {
        console.log('send', { commandName, commandArgs });
        this.io.emit('command', { commandName, commandArgs })
    }
}
