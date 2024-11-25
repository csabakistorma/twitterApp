module.exports = function (objRepo, view) {
    return (req, res, next) => {
        console.log("Rendering view:", view);
        return res.render(view, res.locals);
    }
}