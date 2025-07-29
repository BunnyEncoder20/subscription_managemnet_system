import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    console.log("[server] going through arcjet check");
    try {
        console.log("[server] arcjet making decision...");
        const decision = await aj.protect(req, { requested: 1 }); // requested tells how many tokens to take away for each req
        console.debug(
            "[server] arcjet decision conclusion: ",
            decision.conclusion,
        );

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                console.debug(
                    "[server] arcjet rejected the request | rate limit exceeded",
                );
                return res.status(429).json({
                    error: "rate limit exceeded",
                });
            }

            if (decision.reason.isBot()) {
                console.debug(
                    "[server] arcjet rejected the request | bot detected",
                );
                return res.status(403).json({
                    error: "bot detected",
                });
            }

            console.debug(
                "[server] arcjet rejected the request | access denied",
            );
            return res.status(403).json({ error: "access denied" });
        }

        next();
    } catch (error) {
        console.debug("[server] something went wrong in arcjet middleware");
        next(error);
    }
};

export default arcjetMiddleware;
