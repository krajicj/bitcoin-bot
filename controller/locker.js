const bcrypt = require('bcryptjs');
const fs = require('fs');


const prompt = require('prompt');


exports.checkPassword = async() => {
    if(process.env.MAIN_PASSWORD){
        return true;
    }else{
        //Password not set so set it
       const password =  await getPassword();

       //Hash password
       const salt = await bcrypt.genSalt(10);
       const hashedPassowrd = await bcrypt.hash(password, salt);

       //Apend app password to the config file
       fs.appendFileSync('config/config.env', `\nMAIN_PASSWORD=${hashedPassowrd}`);

       //Set password to the environment
       process.env.MAIN_PASSWORD = hashedPassowrd;
       
                     
    }
}



const getPassword =  () => new Promise((resolve, reject) => {
    const schema = {
        properties: {         
          password: {
            description: 'Please choose your password: ',
            hidden: true
          },
          passwordRepeat: {
            description: 'Repeat your password: ',
            hidden: true
          }
        }
      };

      //
      // Start the prompt
      //
      prompt.message = "";
      prompt.start();
    
     
      prompt.get(schema, function (err, result) {
        //Check if passwords are the same   
        if(result.password === result.passwordRepeat){         
           console.log('Password was stored...');
           prompt.stop();
           resolve(result.password);
        }else{
            console.log('Passwords are not the same...');
            resolve(getPassword());
        }
      });

});
