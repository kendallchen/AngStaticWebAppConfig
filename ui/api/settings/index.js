module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    //process.env reads from local.settings.json
    const apiCustomer = process.env.apiCustomer;
 
    context.res = {
        status: 200, 
        body: { apiCustomer }
    };
}