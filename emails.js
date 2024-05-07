fetch('http://192.168.1.102:3000/sendEmail')
.then((res)=>{
    console.log(res)
})
.catch((err)=>{
    console.log(err)
})