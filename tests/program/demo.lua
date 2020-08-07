

function entry()
    local msg = message(protocol.prot_demo)
    msg.seg1 = -10.99
    msg.seg2 = -1000299.235456
    msg.seg3 = -97
    msg.seg4 = -97
    msg.seg5 = -97
    msg.seg6 = -97
    msg.seg7 = -97
    local buf = pack(msg)
    print(string.buff2hex(buf))
    print(unpack(protocol.prot_demo, buf))
    exit()
end