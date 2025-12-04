import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

document.getElementById('signupBtn').onclick = async () => {
  const name = document.getElementById('fullName').value;
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const phone = document.getElementById('phone').value;
  const role = document.getElementById('role').value;

  if (!email || !password) return alert('Email & password required');

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;
    await setDoc(doc(db, 'users', uid), { name, username, email, phone, role, createdAt: serverTimestamp() });
    window.location.href = 'dashboard.html';
  } catch (err) { alert(err.message); }
};

document.getElementById('loginBtn').onclick = async () => {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  try { await signInWithEmailAndPassword(auth, email, password); window.location.href = 'dashboard.html'; }
  catch(err){ alert(err.message); }
};

document.getElementById('forgotLink').onclick = async (e) => {
  e.preventDefault();
  const email = prompt('Enter your email:');
  if (!email) return;
  try { await sendPasswordResetEmail(auth, email); alert('Check email'); } catch(err){ alert(err.message); }
};
