
// ================= CEK LOGIN =================

if(localStorage.getItem("login") !== "true"){

    window.location.href = "login.html";

}

// ================= TAMPILKAN ARTIKEL =================

async function tampilkanArtikel(){

    try{

        const response = await fetch(
            'api/tampil.php'
        );

        const data = await response.json();

        let list =
        document.getElementById("listArtikel");

        // jika kosong
        if(data.length === 0){

            list.innerHTML = `
            
            <p class="empty">
                Belum ada artikel 😥
            </p>

            `;

            return;

        }

        list.innerHTML = "";

        // looping data
        data.forEach((item)=>{

            list.innerHTML += `

            <div class="artikel-item">

                <h3>${item.judul}</h3>

                <p>${item.isi}</p>

            </div>

            `;

        });

    }

    catch(error){

        console.log(
            "Error tampil artikel:",
            error
        );

    }

}

// ================= SIMPAN ARTIKEL =================

async function tambahArtikel(){

    let judul =
    document.getElementById("judul").value;

    let isi =
    document.getElementById("isi").value;

    // validasi
    if(judul === "" || isi === ""){

        alert("Isi semua form!");

        return;

    }

    try{

        const response = await fetch(
            'api/simpan.php',
            {

                method:'POST',

                headers:{
                    'Content-Type':'application/json'
                },

                body: JSON.stringify({

                    judul:judul,
                    isi:isi

                })

            }
        );

        const hasil =
        await response.text();

        alert(hasil);

        // kosongkan form
        document.getElementById("judul").value = "";
        document.getElementById("isi").value = "";

        // refresh artikel
        tampilkanArtikel();

    }

    catch(error){

        console.log(
            "Error simpan artikel:",
            error
        );

    }

}

// ================= LOGOUT =================

function logout(){

    localStorage.removeItem("login");

    window.location.href = "login.html";

}

// ================= JALANKAN =================

tampilkanArtikel();
