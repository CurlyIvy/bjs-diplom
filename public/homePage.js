'use strict'

let logoutButton = new LogoutButton();
logoutButton.action = () => {
    ApiConnector.logout((response) => {
        console.log(`ApiConnector.logout response: ${response}`);
        if(response.success) {
            location.reload();
        }
    });
};

ApiConnector.current((response) => {
    console.log(`ApiConnector.current response: ${response}`);
    if(response.success) {
        ProfileWidget.showProfile(response.data);
    }
})


let ratesBoard = new RatesBoard();
/*function getExchangeRates() {
    ApiConnector.getStocks((response) => {
        console.log(`ApiConnector.getStocks response: ${response}`);
        if(response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
}
getExchangeRates(); 
setInterval(getExchangeRates, 60000); */
let pool = () => {
    return {
        id: null,
        start: function() {
            if(this.id === null) {
                this.callback(); 
                this.id = setInterval(this.callback, 60000);
            }
        },
        stop: function() {
            if(this.id !== null) {
                clearInterval(this.id);
            }
        },
        callback: (f) => f 
    };
};
let poolInst = pool();
poolInst.callback = () => {
    ApiConnector.getStocks((response) => {
        console.log(`ApiConnector.getStocks response: ${response}`);
        if(response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
};
poolInst.start();

let moneyManager = new MoneyManager();
let onUpdateHendler = (response) => {
    if(response.success) {
        ProfileWidget.showProfile(response.data);
    }
    let message = !response.success ? response.error : "Успех";
    moneyManager.setMessage(response.success, message);
};
moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, (response) => {
        console.log(`ApiConnector.addMoney response: ${response}`);
        onUpdateHendler(response);
    });
};
moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        console.log(`ApiConnector.convertMoney response: ${response}`);
        onUpdateHendler(response);
    });
}; 
moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        console.log(`ApiConnector.transferMoney response: ${response}`);
        onUpdateHendler(response);
    });
};

let favoritesWidget = new FavoritesWidget();
let onContentUpdateHendler = (response) => {
    if(response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
};
let onMessageUpdateHendler = (response) => {
    let message = !response.success ? response.error : "Успех";
    favoritesWidget.setMessage(response.success, message);
};
ApiConnector.getFavorites((response) => {
    console.log(`ApiConnector.getFavorites response: ${response}`);
    onContentUpdateHendler(response);
});
favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
        console.log(`ApiConnector.addUserToFavorites response: ${response}`);
        onContentUpdateHendler(response);
        onMessageUpdateHendler(response);
    });
};
favoritesWidget.removeUserCallback = (userId) => {
    ApiConnector.removeUserFromFavorites(userId, (response) => {
        console.log(`ApiConnector.removeUserFromFavorites response: ${response}`);
        onContentUpdateHendler(response);
        onMessageUpdateHendler(response);
    });
};