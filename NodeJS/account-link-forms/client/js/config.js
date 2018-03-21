
var env = 'LOCAL'

switch(env) {
    case 'LOCAL': 
        window.config = {
            apiUrl : 'http://localhost:5000'
        };
        break;
        
    case 'DEV':  
        window.config = {
            apiUrl : 'http://52.63.62.244:5000'
        };
        break;

    case 'PROD': 
        window.config = {
            apiUrl : 'http://52.63.62.244:5001'
        };
        break;
}

