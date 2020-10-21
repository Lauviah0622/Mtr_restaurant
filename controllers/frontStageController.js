module.exports = {
    index: async (req, res) => {
        res.render('frontStage/index', {})
    },
    lottery: (req, res) => {
        res.render('frontStage/lottery', {})
    }
}