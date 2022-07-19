const handleError = (res, error) => res.status(500).json({ error: error.message || error });

const handleBadRequest = (res, msg) => res.status(400).json({ msg });

const handleSuccess = (res, data) => res.status(200).json(data);

module.exports = {
  handleError,
  handleBadRequest,
  handleSuccess,
};
