function checkStatus(source) {
    const status = source.indexOf('301 MOVED PERMANENTLY');

    return status === -1 ? true : false;
}

module.exports = checkStatus;