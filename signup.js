// signup.js import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js"; import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js"; import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = { apiKey: "AIzaSyDL0XCaXIB47WGlt8L9R1uGd3JBLs2oxOk", authDomain: "wanga-digital-academy.firebaseapp.com", projectId: "wanga-digital-academy" };

const app = initializeApp(firebaseConfig); const auth = getAuth(app); const db = getFirestore(app);

const questions = [ { name: "fullName", label: "What's your full name?", type: "text" }, { name: "username", label: "Choose a username", type: "text" }, { name: "phone", label: "Your phone number? (optional)", type: "text", optional: true }, { name: "country", label: "Which country are you from?", type: "text" }, { name: "county", label: "Which county or region?", type: "text" }, { name: "school", label: "Which school do you attend?", type: "text" }, { name: "level", label: "What's your level of education?", type: "select", options: ["Primary", "Junior High", "Senior High", "College", "University"] }, { name: "subject", label: "Favourite subject?", type: "select", options: ["Mathematics", "Science", "History", "Geography", "ICT", "Languages", "Art & Design"] }, { name: "career", label: "Preferred career?", type: "select", options: ["Doctor", "Nurse", "Engineer", "Teacher", "Artist", "Software Developer", "Musician", "Business", "Designer", "Pilot", "Writer"] }, { name: "referral", label: "Referral code (optional)", type: "text", optional: true } ];

const container = document.getElementById("questionCard"); const backBtn = document.getElementById("backBtn"); const skipBtn = document.getElementById("skipBtn"); const nextBtn = document.getElementById("nextBtn"); const finalForm = document.getElementById("finalSignup"); const summary = document.getElementById("summary"); const googleBtn = document.getElementById("googleSignup"); const signupForm = document.getElementById("emailSignupForm"); const msg = document.getElementById("msg");

let current = 0; let formData = {};

function renderQuestion() { const q = questions[current]; let inputHtml = ""; if (q.type === "select") { inputHtml = <select id="input">${q.options.map(o => <option value='${o}'>${o}</option>).join("")}</select>; } else { inputHtml = <input id="input" type="${q.type}" ${q.optional ? "" : "required"} />; } container.innerHTML = <div class="card"> <h3>${q.label}</h3> ${inputHtml} </div>; backBtn.style.display = current > 0 ? "inline-block" : "none"; }

nextBtn.onclick = () => { const input = document.getElementById("input"); if (!questions[current].optional && !input.value.trim()) return alert("Please fill in the field"); formData[questions[current].name] = input.value; current++; if (current < questions.length) renderQuestion(); else showFinalForm(); };

skipBtn.onclick = () => { current++; if (current < questions.length) renderQuestion(); else showFinalForm(); };

backBtn.onclick = () => { current--; if (current >= 0) renderQuestion(); };

function showFinalForm() { container.style.display = "none"; backBtn.style.display = skipBtn.style.display = nextBtn.style.display = "none"; finalForm.style.display = "block"; googleBtn.style.display = "block"; signupForm.style.display = "block"; Object.entries(formData).forEach(([k, v]) => { summary.innerHTML += <p><strong>${k}:</strong> ${v}</p>; }); }

// Email/password signup handler signupForm.onsubmit = async e => { e.preventDefault(); msg.textContent = ""; const email = signupForm.email.value; const password = signupForm.password.value; try { const cred = await createUserWithEmailAndPassword(auth, email, password); const uid = cred.user.uid; const refCode = wanga_${uid.slice(0, 6)}; await setDoc(doc(db, "users", uid), { ...formData, email, referralCode: refCode, createdAt: new Date().toISOString() }); msg.textContent = "✅ Signup complete! Redirecting..."; setTimeout(() => location.href = "dashboard/student.html", 1000); } catch (err) { msg.textContent = "❌ " + err.message; } };

// Google Signup handler googleBtn.onclick = async () => { const provider = new GoogleAuthProvider(); try { const cred = await signInWithPopup(auth, provider); const u = cred.user; const uid = u.uid; await setDoc(doc(db, "users", uid), { fullName: u.displayName || "", email: u.email, ...formData, referralCode: wanga_${uid.slice(0, 6)}, createdAt: new Date().toISOString() }, { merge: true }); location.href = "dashboard/student.html"; } catch (err) { alert("❌ " + err.message); } };

renderQuestion();

