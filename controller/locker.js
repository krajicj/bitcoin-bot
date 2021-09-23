const bcrypt = require("bcryptjs");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const {createToken} = require('./auth');
const prompt = require("prompt");

/**
 * Check if app has a password set if not request it and set the password
 * 
 * @returns 
 */
exports.checkPassword = async () => {
  if (process.env.MAIN_PASSWORD) {
    return true;
  } else {
    //Password not set so set it
    const password = await getPassword();

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassowrd = await bcrypt.hash(password, salt);

    //Apend app password to the config file
    fs.appendFileSync("config/config.env", `\nMAIN_PASSWORD=${hashedPassowrd}`);

    //Set password to the environment
    process.env.MAIN_PASSWORD = hashedPassowrd;
  }
};

/**
 * API method for changing app password
 * 
 */
exports.changePassword = asyncHandler(async (req, res, next) => {
  const oldPassword = req.body.oldPassword
  const newPassword = req.body.newPassword

  //If no password return false
  if (!oldPassword || !newPassword){
    res.json({ status: "error" , msg: "No password send"});
    return;
  }

  //Check old password
  const validPassword = await bcrypt.compare(
    oldPassword,
    process.env.MAIN_PASSWORD
  );
  if (!validPassword){
    res.json({ status: "error" , msg: "Wrong actual password"});
    return;
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassowrd = await bcrypt.hash(newPassword, salt);

  //Read config file
  const envLines = require("fs")
    .readFileSync("config/config.env", "utf-8")
    .split("\n")
    .filter(Boolean);

  envLines.forEach((line, index) => {
    //Change password
    if (line.startsWith("MAIN_PASSWORD=")) {
      envLines[index] = `MAIN_PASSWORD=${hashedPassowrd}`;
      process.env.MAIN_PASSWORD = hashedPassowrd;
    }
  });

  //Write changes to the config file
  fs.writeFileSync("config/config.env", envLines.join("\n"));

  res.json({ status: "success" });
});

/**
 * Get password from the cmd line
 * this will be called if app first run
 *
 * @returns string with password
 */
const getPassword = () =>
  new Promise((resolve, reject) => {
    const schema = {
      properties: {
        password: {
          description: "Please choose your password: ",
          hidden: true,
        },
        passwordRepeat: {
          description: "Repeat your password: ",
          hidden: true,
        },
      },
    };

    //
    // Start the prompt
    //
    prompt.message = "";
    prompt.start();

    prompt.get(schema, function (err, result) {
      //Check if passwords are the same
      if (result.password === result.passwordRepeat) {
        console.log("Password was stored...");
        prompt.stop();
        resolve(result.password);
      } else {
        console.log("Passwords are not the same...");
        resolve(getPassword());
      }
    });
  });
