class ErrorExtender extends Error {
  // error-> object -> message,stack, 
  constructor(message, statusCode) {
    //  this= {}
    //  child constructor parent constructor should be calledfirst    
    // object => error
    super(message);
    // error=> statucode ,status
    this.statusCode = statusCode;
    statusCode = "" + statusCode;
    this.status = `${statusCode.startsWith('4') ? "client error" : "server error"}`;
    //  error operational
    // {}
    this.isknown = true;
  }
}
module.exports = ErrorExtender;
// API, UI
// Production,Dev
//  types of operational error