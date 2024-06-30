const asyncHandlerExpress = reqHandler => async (req, res, next) => {
    try {
        await reqHandler(req, res, next);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: error.success,
            message: error.message,
        });
        console.log(error, '***');
    }
};

export { asyncHandlerExpress };