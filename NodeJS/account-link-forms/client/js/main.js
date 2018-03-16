'use strict'; 

function ExceptionHelper() {
    this.try = (callback) => {
        try {
            return callback();
        }
        catch (e) {
            showError(e);
            return null;
        }
    }
}

var exception = new ExceptionHelper();

function showForm(id) {
    $(id).css('display', 'initial');
    //closeDropdown();
}

function hideForm(id) {
    $(id).css('display', 'none');
}

function hideAllForms() {
    exception.try(() => {
        hideForm('#errorOverlay');
    });
}

function showError(error) {
    console.log(error);
    hideProgress();
    showForm("#errorOverlay");
}

function showHideProgress(show) {
    if (show)
        $("#progressOverlay").show();
    else
        $("#progressOverlay").hide();
}

function showProgress() {
    showHideProgress(true);
}

function hideProgress() {
    showHideProgress(false);
}


$(document).ready(function () {
    exception.try(() => {
        hideProgress();
        hideAllForms();
        //showRequestLogs();

        $("#closeErrorOverlay").click(function () {
            hideForm('#errorOverlay');
        });

        //enter key functionality
        document.onkeydown = function () {
            if (window.event.keyCode == '13') {
                /*
                switch (_showingForm) {
                    case 'login':
                        login();
                        break;
                }
                */
            }
        }
    });
});