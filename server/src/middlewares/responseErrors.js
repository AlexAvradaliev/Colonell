exports.responseErrors = () => (error, req, res, next) => {
  if (error.status) {
    res.status(error.status).json(error);
  } else {
    const error = {
      status: 500,
      errors: [{ message: 'Someting wrongs' }]
    };
    res.status(error.status).json(error);
  }
};
