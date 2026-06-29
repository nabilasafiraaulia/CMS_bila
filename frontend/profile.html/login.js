function login(){

    let username =
    document.getElementById("username").value;

    let password =
    document.getElementById("password").value;

    /* USERNAME & PASSWORD */

    if(
        username === "admin" &&
        password === "123"
    ){

        localStorage.setItem(
            "login",
            "true"
        );

        alert("Login berhasil ✅");

        window.location.href =
        "cms.html";

    }

    else{

        alert("Login gagal");

    }

}