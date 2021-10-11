function durationDate(start, duration) {
        return new Date(start.setDate(start.getDate() + ( 7 * duration))) // start date + (7 days multiplied by duration in weeks)
}

module.exports = durationDate