const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err };
        error.message = err.message;
        console.error(err);

        // Mongoose bad objectID : a common error when working with MongoDB
        if (err.name === "CastError") {
            const message = "Resource not found";
            error = new Error(message);
            error.statusCode = 404;
        }

        // Mongoose duplicate key
        if (err.code === 11000) {
            const message = "Duplicate key error";
            error = new Error(message);
            error.statusCode = 400;
        }

        // Mongoose validation error
        if (err.name === "ValidationError") {
            const message = Object.values(err.errors).map((val) => val.message);
            error = new Error(message.join(", "));
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Internal Server Error",
        });
    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;
