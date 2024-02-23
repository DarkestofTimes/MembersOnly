export const generateErrorObject = (errorsArray) => {
  const errorObject = {};

  errorsArray.forEach((error) => {
    if (error.location === "body") {
      if (!errorObject[error.path + "Error"]) {
        errorObject[error.path + "Error"] = [];
      }
      errorObject[error.path + "Error"].push(error.msg);
    }
  });

  return errorObject;
};
