const dataMissing = (...data) => {
	return data.some((item) => item === undefined || item === null);
};

module.exports = { dataMissing };
