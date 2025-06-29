// signup.js import { auth, db, provider } from './firebase.js'; import { createUserWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js"; import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const form = document.getElementById('signup'); const msg = document.getElementById('msg'); const toggle = document.getElementById('togglePwd'); const pwd = document.getElementById('password');

// Password toggle if (toggle && pwd) { toggle.onclick = () => { pwd.type = pwd.type === 'password' ? 'text' : 'password'; toggle.textContent = pwd.type === 'password' ? 'show' : 'hide'; }; }

// Signup form handler if (form) { form.onsubmit = async e => { e.preventDefault(); msg.textContent = ''; const fd = new FormData(form); const data = Object.fromEntries(fd.entries());

if (data.password !== data.confirm) {
  msg.textContent = '❌ Passwords do not match';
  return;
}

try {
  const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
  const uid = cred.user.uid;
  const refCode = `wanga_${uid.slice(0, 6)}`;
  await setDoc(doc(db, 'users', uid), {
    ...data,
    referralCode: refCode,
    createdAt: new Date().toISOString()
  });
  msg.innerHTML = '✅ Signup successful! Redirecting...';
  setTimeout(() => location.href = "dashboard/student.html", 1000);
} catch (err) {
  msg.textContent = '❌ ' + err.message;
}

}; }

// Google sign up const googleBtn = document.getElementById('google'); if (googleBtn) { googleBtn.onclick = async () => { try { const cred = await signInWithPopup(auth, provider); const u = cred.user; const uid = u.uid; await setDoc(doc(db, 'users', uid), { fullName: u.displayName || '', email: u.email, username: '', phone: '', country: '', county: '', school: '', level: '', subject: '', career: '', referralCode: wanga_${uid.slice(0, 6)}, createdAt: new Date().toISOString() }, { merge: true }); location.href = "dashboard/student.html"; } catch (err) { alert('❌ ' + err.message); } }; }

