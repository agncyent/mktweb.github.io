const translations={

en:{
gen:"MKT4X 1st Generation Member",
birthday:"Birthday",
hometown:"Hometown",
blood:"Blood Type",
status_lbl:"Status:",
status_val:"Active"
},

id:{
gen:"Anggota Generasi ke-1 MKT4X",
birthday:"Tanggal Lahir",
hometown:"Asal",
blood:"Gol. Darah",
status_lbl:"Status:",
status_val:"Aktif"
}

};

document.addEventListener("change",(e)=>{

if(e.target.id==="langSelect"){

const lang=e.target.value;
const t=translations[lang];

if(!t) return;

document.getElementById("txt-gen").innerText=t.gen;
document.getElementById("lbl-birthday").innerText=t.birthday;
document.getElementById("lbl-hometown").innerText=t.hometown;
document.getElementById("lbl-blood").innerText=t.blood;
document.getElementById("lbl-status").innerText=t.status_lbl;
document.getElementById("txt-status").innerText=t.status_val;

}

});
