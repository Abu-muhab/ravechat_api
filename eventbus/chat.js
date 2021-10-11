const { Subject } = require('rxjs')

const eventBus = new Subject()

module.exports = eventBus
