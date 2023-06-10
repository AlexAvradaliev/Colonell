exports.createOtp = () => {
  const generatefn = () => {
    const minm = 100000;
    const maxm = 999999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
  };
  const expiry_time = Date.now() + 20 * 60 * 1000;
  return {
    generate: generatefn(),
    expiry_time
  };
};

exports.mathTimeToken = (time) => {
  return time
    .split('*')
    .map(Number)
    .reduce(function (acc, val) {
      return acc + val * 2;
    }, 0);
};
