document.addEventListener("DOMContentLoaded", () => {

fetch("components/navbar.html")
.then(res => res.text())
.then(data => {
document.getElementById("navbar").innerHTML = data;
});

fetch("components/sidebar.html")
.then(res => res.text())
.then(data => {
document.getElementById("sidebar").innerHTML = data;
startProfile();
});

function startProfile(){

const langSelect = document.getElementById("langSelect");

const dict = {

id:{
birthday:"Tanggal Lahir",
origin:"Asal",
blood:"Gol. Darah",
generation:"Anggota Generasi 1",
quote:"Seperti cahaya yang bersinar di malam hari.",
status:"Status",
active:"AKTIF"
},

en:{
birthday:"Birthday",
origin:"Origin",
blood:"Blood Type",
generation:"1st Generation Member",
quote:"Like a light shining in the night.",
status:"Status",
active:"ACTIVE"
},

jp:{
birthday:"誕生日",
origin:"出身",
blood:"血液型",
generation:"第1期生",
quote:"夜に輝く光のように。",
status:"ステータス",
active:"活動中"
},

my:{
birthday:"Hari Lahir",
origin:"Asal",
blood:"Jenis Darah",
generation:"Ahli Generasi 1",
quote:"Seperti cahaya yang bersinar di malam hari.",
status:"Status",
active:"AKTIF"
}

};

if(!langSelect) return;

langSelect.onchange = function(){

const l = this.value;

document.getElementById("birthdayLabel").innerText = dict[l].birthday;
document.getElementById("originLabel").innerText = dict[l].origin;
document.getElementById("bloodLabel").innerText = dict[l].blood;
document.getElementById("generationText").innerText = dict[l].generation;
document.getElementById("quoteText").innerText = dict[l].quote;
document.getElementById("statusLabel").innerText = dict[l].status;
document.getElementById("statusActive").innerText = dict[l].active;

};

}

});
