import { auth, db } from "./firebase.js";

import {
GoogleAuthProvider,
signInWithPopup,
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

import {
doc,
setDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";


/* LOGIN GOOGLE */

window.loginGoogle = async function(){

const provider = new GoogleAuthProvider();

const result = await signInWithPopup(auth, provider);

const user = result.user;

await setDoc(doc(db,"users",user.uid),{

name: user.displayName,
email: user.email,
photo: user.photoURL,
premium: false

},{merge:true});

};


/* LOGOUT */

window.logout = function(){

signOut(auth);

};


/* LOAD USER */

onAuthStateChanged(auth, async(user)=>{

if(!user) return;

const photo = document.getElementById("user-photo");
const username = document.getElementById("username");
const status = document.getElementById("user-status");

if(photo) photo.src = user.photoURL;

if(username) username.innerText = user.displayName;

const ref = doc(db,"users",user.uid);

const snap = await getDoc(ref);

if(!snap.exists()) return;

const data = snap.data();

if(status){

if(data.premium){

status.innerHTML = "✔ Verified";

}else{

status.innerHTML = "Basic";

}

}

});
