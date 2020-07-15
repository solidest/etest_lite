
function has_error(check_result) {
    for(let k in check_result) {
        if(check_result[k].$count) {
            return true;
        }
    }
    return false;
}

export default {
    has_error
}