'use strict'

let userForm = new UserForm();
userForm.loginFormCallback = (data) => {
    ApiConnector.login(data, (response) => {
        console.log(`ApiConnector.login response: ${response}`);
        if(response.success) {
            location.reload();
        }
        else {
            userForm.setLoginErrorMessage(response.error);
        }
    });
};
userForm.registerFormCallback = (data) => {
    ApiConnector.register(data, (response) => {
        console.log(`ApiConnector.register response: ${response}`);
        if(response.success) {
            location.reload();
        }
        else {
            userForm.setRegisterErrorMessage(response.error);
        }
    });
};