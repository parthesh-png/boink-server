const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    if (error.errors) {
      const formattedErrors = {};
      error.errors.forEach((err) => {
        const field = err.path.join('.') || 'general';
        formattedErrors[field] = err.message;
      });
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message || 'Invalid input data',
    });
  }
};

module.exports = validate;

