function errorWrapper(err) {
  let status;
  let errors = {};

  err.map((x) => {
    errors[x.param] = x.message;
    status = x.status;
  });

  return { status, errors };
}

function mapperStatus(err, status) {
  let result = err.map((err) => ({ ...err, status }));
  return result;
}

module.exports = {
  errorWrapper,
  mapperStatus
};
