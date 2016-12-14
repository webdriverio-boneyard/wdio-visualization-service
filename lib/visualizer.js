import merge from 'deepmerge'

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
        this.url = 'http://google.com'
        this.options = DEFAULT_WINDOW_FEATURES
    }

    before () {
        [this.screen, this.innerWidth] = browser.execute(() => [window.screen, window.innerWidth]).value
        this.position = browser.windowHandlePosition().value

        this.options = merge(this.options, {
            left: this.position.x + this.innerWidth
        })

        /**
         * load visulizer screen
         */
        const windowOptions = Object.keys(this.options).map((key) => `${key}=${this.options[key]}`)
        browser.execute((url, name, windowOptions) => {
            window.open(url, name, windowOptions)
        }, this.url, this.windowName, windowOptions.join(','))

        /**
         * wait until visualizer is ready
         */
        browser.pause(3000)
    }

    afterCommand (...args) {

    }
}
