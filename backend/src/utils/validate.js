import validator from "validator";

const validateSignUpData = (req) => {

    // EXTRACT the name, email, password from REQ BODY
    const {name, email, country, password} = req.body;

    if(!name) {
        throw new Error("Name is required");
    } else if(!validator.isEmail(email)) {
        throw new Error("Email id is not valid");
    } else if(!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password");
    } else if(!country) {
        throw new Error("Country is required")
    }
}

const validateNewTaskData = (req) => {

    // EXTRACT name, description, email, password from REQ BODY
    const {title, description} = req.body;

    if(!title) {
        throw new Error("Title is not valid");
    } else if(!description) {
        throw new Error("Description is required")
    }
}

export {validateSignUpData, validateNewTaskData};