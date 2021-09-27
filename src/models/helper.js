exports.validateMessage = async (status, icon, text) =>{
    return {
        status: status,
        text: text,
        icon: icon
    }
}