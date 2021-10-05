const isLoggedin = (req,res,next)=>{
    console.log(req.isAuthenticated())
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect('/')
    }
};

const isNotLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        next();
    }else{
        res.redirect('http://localhost:5000/main/lobby');
    }
}

exports.isLoggedin = isLoggedin;
exports.isNotLoggedin = isNotLoggedin;