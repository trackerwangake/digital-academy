// student.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDL0XCaXIB47WGlt8L9R1uGd3JBLs2oxOk",
  authDomain: "wanga-digital-academy.firebaseapp.com",
  projectId: "wanga-digital-academy"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById('menuBtn').onclick = () => {
  document.getElementById('sidebar').classList.toggle('closed');
};

document.getElementById('logoutBtn').onclick = () => signOut(auth);

onAuthStateChanged(auth, async user => {
  if (!user) {
    location.href = "../login.html";
    return;
  }
  document.getElementById('welcome').textContent = `Welcome, ${user.displayName || user.email}`;
  try {
    const snap = await getDoc(doc(db, 'stats', user.uid));
    const s = snap.data() || {};
    document.getElementById('coursesCount').textContent = `${s.coursesActive || 0} active`;
    document.getElementById('assignDue').textContent = s.assignmentsDue || "None due";
    document.getElementById('progressTxt').textContent = s.progress || "—";
    document.getElementById('coinTracker').textContent = `🪙 ${s.coins || 0} Coins`;
  } catch (e) {
    console.warn("Error loading stats", e);
  }
});
