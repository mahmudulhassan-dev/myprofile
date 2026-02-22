/**
 * catchAsync utility wrapper to handle asynchronous errors in express routes.
 * Eliminates the need for repetitive try/catch blocks.
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

export default catchAsync;
