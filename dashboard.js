import { auth, db, storage } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

let currentUser = null;
onAuthStateChanged(auth, async (user) => {
  if (!user) { window.location.href='auth.html'; return; }
  currentUser = user;
  document.getElementById('userInfo').innerHTML = `Logged in as: ${user.email} <button id="logoutBtn">Logout</button>`;
  document.getElementById('logoutBtn').onclick = () => signOut(auth);
  await loadProducts();
});

document.getElementById('createProductBtn').onclick = () => {
  const f = document.getElementById('productForm');
  f.style.display = f.style.display==='none'?'block':'none';
};

document.getElementById('publishBtn').onclick = async () => {
  const title = document.getElementById('productTitle').value;
  const desc = document.getElementById('productDesc').value;
  const price = document.getElementById('productPrice').value;
  const file = document.getElementById('productImage').files[0];
  let imageUrl = '';
  if(file){
    const sRef = ref(storage, `product_images/${Date.now()}_${file.name}`);
    await uploadBytes(sRef, file);
    imageUrl = await getDownloadURL(sRef);
  }
  await addDoc(collection(db,'products'), { title, desc, price, imageUrl, sellerId: currentUser.uid, createdAt: serverTimestamp() });
  alert('Published'); document.getElementById('productForm').style.display='none';
  await loadProducts();
};

async function loadProducts(){
  const q = query(collection(db,'products'), orderBy('createdAt','desc'));
  const snap = await getDocs(q);
  const el = document.getElementById('productsList'); el.innerHTML='';
  snap.forEach(d=>{
    const p = d.data();
    const card = document.createElement('div');
    card.className='product-card';
    card.innerHTML = `<h3>${p.title}</h3><p>${p.desc||''}</p><p>₦${p.price}</p>${p.imageUrl?`<img src="${p.imageUrl}" width="200">`:''}<button data-id="${d.id}" class="buyBtn">Buy Now</button>`;
    el.appendChild(card);
  });
  document.querySelectorAll('.buyBtn').forEach(btn=>btn.onclick=buyHandler);
}

async function buyHandler(e){
  const id = e.target.dataset.id;
  const docSnap = await getDoc(doc(db,'products',id));
  const product = docSnap.data();
  const userSnap = await getDoc(doc(db,'users',product.sellerId));
  const seller = userSnap.data();
  if(!seller.phone){ alert('No WhatsApp number'); return; }
  const phone = seller.phone.replace(/\D/g,'');
  const msg = encodeURIComponent(`Hi ${seller.name||''}, I want to buy "${product.title}" on Chrisland Hub.`);
  window.open(`https://wa.me/${phone}?text=${msg}`,'_blank');
}