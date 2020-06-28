

async function check_topology(proj_id, version, res, stopper) {
    if(!res || stopper(proj_id, version)) {
        return null;
    }

    return res;
}

export default check_topology
