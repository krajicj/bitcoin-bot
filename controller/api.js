const fs = require('fs')
const asyncHandler = require("express-async-handler");


exports.checkAPIKeys = asyncHandler(async (req, res, next) => {
    if(!process.env.KEY || !process.env.SECRET || !process.env.PASS){
        res.json({ status: "error", msg: 'Missing API data' });
    }else{
        res.json({ status: "success" });
    }
})


exports.setAPIKeys = asyncHandler(async (req, res, next) => {
    const apiKeys = req.body;
   
    const envLines = require('fs').readFileSync('config/config.env', 'utf-8')
    .split('\n')
    .filter(Boolean);

    if(!apiKeys.PASS || !apiKeys.SECRET || !apiKeys.KEY){
        res.json({ status: "error", msg: 'Some API params are missing'});
        return;
    }
    

    envLines.forEach((line, index) => {
        if(line.startsWith('KEY=')){
            envLines[index] = `KEY=${apiKeys.KEY}`;
            process.env.KEY = apiKeys.KEY;
        }

        if(line.startsWith('SECRET=')){
            envLines[index] = `SECRET=${apiKeys.SECRET}`;
            process.env.SECRET = apiKeys.SECRET;
        }

        if(line.startsWith('PASS=')){
            envLines[index] = `PASS=${apiKeys.PASS}`;
            process.env.PASS = apiKeys.PASS;
        }

    });
    
    fs.writeFileSync('config/config.env', envLines.join('\n'));
    
    res.json({ status: "success" });

})