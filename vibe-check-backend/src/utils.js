/**
 * Function to return a well formatted JSON for Error JSON Responses
 * @param {*} res 
 * @param {Int} status - Error Status Code eg: 404, etc   
 * @param {String} msg - Any error message - defaults to 'Error'
 * @param {String} err - Sequelize error obj
 */
const errorHandler = (res, status, msg = "Error", err = null) => {
    res.status(status).json({msg: msg, err: err, data: null});
} 


/**
 * Function to return a well formatted JSON for Normal JSON Responses
 * @param {*} res 
 * @param {Int} status - Status Code eg: 200, etc   
 * @param {*} data - Sequelize Return Object
 * @param {*} msg - Any Success message - defaults to 'Success'
 */
const responseHandler = (res, status, data, msg = "Success") => {
    res.status(status).json({msg: msg, err: null, data: data});
}

module.exports = {errorHandler, responseHandler}