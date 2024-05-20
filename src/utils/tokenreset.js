function resetToken() {
  const token = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  return token.toString();
}

module.exports = {
  resetToken,
};
