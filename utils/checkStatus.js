function checkStatus(source) {
    const status = source.indexOf('class="radio" name="remember_me"');

    return status === -1 ? true : false;
}

module.exports = checkStatus;