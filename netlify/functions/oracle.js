exports.handler = async function(event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({ reply: "SYSTEM ONLINE. The connection is stable." })
    };
};
