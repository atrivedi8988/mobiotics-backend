exports.strongPassword = (str)=>{
    // let message = "false"
     
    let checknum = false
    let checklower = false
    let checkupper = false
    let checkspecial = false
    
    const num = new Set(["1","2","3","4","5","6","7","8","9","0"])
    const lowercase = new Set(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"])
    const uppercase = new Set(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"])
    const special = new Set(["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "+", "-", ".", "`", "~", "|", "<", ">", "=", "-", "_"])
    
    
    for(let i=0; i<str.length; i++){
        if(num.has(str[i])){
            checknum = true;
            break;
        }
    }
     for(let i=0; i<str.length; i++){
        if(lowercase.has(str[i])){
            checklower = true;
            break;
        }
    }
    for(let i=0; i<str.length; i++){
        if(uppercase.has(str[i])){
            checkupper = true;
            break;
        }
    }
    for(let i=0; i<str.length; i++){
        if(special.has(str[i])){
            checkspecial = true;
            break;
        }
    }
    // console.log(str.length)
    // console.log(checknum,checklower,checkupper,checkspecial)
    if(str.length<8){
        return "Password length should be atleast eight"
    }
    if(checknum && checklower && checkupper && checkspecial){
        return true
    }else if(!checknum){
      return "Please put number in your password"
    }else if(!checklower){
        return "Please put lowercase character in your password"
    }else if(!checkupper){
        return "Please put uppercase character in your password"
    }else if(!checkspecial){
        return "Please put special character in your password"
    }
}
