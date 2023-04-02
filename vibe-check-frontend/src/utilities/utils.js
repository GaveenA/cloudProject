import sanitizeHtml from "sanitize-html";

//export const API_URL = "http://localhost:4000"
// export const API_URL = "http://ec2-3-225-112-124.compute-1.amazonaws.com:3306"

// Added HTTPS proxy integration for backend API to work with AWS API Gateway, and hack the Mixed Content error (where the browser blocks HTTP requests from HTTPS pages) by using a proxy.
export const API_URL = "https://91ip4zg511.execute-api.us-east-1.amazonaws.com"

/*
Funciton: trimFieldsAndSanitize  
This function Sanitises user input.
The funciton takes all the feilds as input 
then if feild is of type String, and not null, the Feild is Trimmed and 
the sanitizeHtml function is run (on the trimmed feild) to remove all html tags and scripts that 
may have been entered as input. 
Empty fields (length 0) are converted to null.
*/
export const trimFieldsAndSanitize = (values) => {
  const trimmedFields = {};
  for (const [key, value] of Object.entries(values)) {
    let field = value;

    // If value is not null trim the field and sanitize any HTML
    if (typeof field === "string" && field !== null) {
      field = field.trim();
      field = sanitizeHtml(field, {
        allowedTags: [],
        allowedAttributes: {},
        disallowedTagsMode: "discard",
      });

      // If the trimmed field is empty convert to null.
      if (field.length === 0) field = null;
    }

    trimmedFields[key] = field;
  }
  return trimmedFields;
};
