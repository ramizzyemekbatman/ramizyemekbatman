// ============================================================
// FIREBASE BAĞLANTI DOSYASI
// Ramiz Köfte Batman
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadString,
  deleteObject,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDv5jWpxAdeZ-MLWnOgJ-TkFbDQP4hn9Qs",
  authDomain: "ramiz-yemek-batman.firebaseapp.com",
  projectId: "ramiz-yemek-batman",
  storageBucket: "ramiz-yemek-batman.firebasestorage.app",
  messagingSenderId: "215907061397",
  appId: "1:215907061397:web:6d68fea3fecf55712ad59c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const COLLECTIONS = {
  MENU: 'menu_items',
  ORDERS: 'orders',
  USERS: 'users',
  DISCOUNTS: 'discounts',
  SETTINGS: 'settings'
};

const DEFAULT_ADMIN_PASSWORD = 'ramiz2026';

// ============================================================
// STORAGE — FOTOĞRAF YÜKLEME
// ============================================================

async function uploadImage(dataUrl, path = 'menu') {
  try {
    const filename = `${path}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;
    const storageRef = ref(storage, filename);
    // dataUrl: "data:image/jpeg;base64,...."
    const base64 = dataUrl.split(',')[1];
    await uploadString(storageRef, base64, 'base64', { contentType: 'image/jpeg' });
    const url = await getDownloadURL(storageRef);
    return { url, path: filename };
  } catch (e) {
    console.error('Fotoğraf yüklenemedi:', e);
    return null;
  }
}

async function deleteImage(path) {
  if (!path) return false;
  try {
    await deleteObject(ref(storage, path));
    return true;
  } catch (e) {
    console.error('Fotoğraf silinemedi:', e);
    return false;
  }
}

// ============================================================
// MENÜ
// ============================================================

async function getMenuItems() {
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.MENU));
    const items = [];
    snapshot.forEach(d => items.push({ id: d.id, ...d.data() }));
    return items;
  } catch (e) {
    console.error('Menü alınamadı:', e);
    return [];
  }
}

async function addMenuItem(item) {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.MENU), {
      ...item,
      createdAt: Date.now()
    });
    return docRef.id;
  } catch (e) {
    console.error('Ürün eklenemedi:', e);
    return null;
  }
}

async function updateMenuItem(id, updates) {
  try {
    await updateDoc(doc(db, COLLECTIONS.MENU, id), {
      ...updates,
      updatedAt: Date.now()
    });
    return true;
  } catch (e) {
    console.error('Ürün güncellenemedi:', e);
    return false;
  }
}

async function deleteMenuItem(id) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.MENU, id));
    return true;
  } catch (e) {
    console.error('Ürün silinemedi:', e);
    return false;
  }
}

// ============================================================
// SİPARİŞLER
// ============================================================

async function getOrders() {
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.ORDERS));
    const orders = [];
    snapshot.forEach(d => orders.push({ id: d.id, ...d.data() }));
    return orders;
  } catch (e) {
    console.error('Siparişler alınamadı:', e);
    return [];
  }
}

async function addOrder(order) {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), {
      ...order,
      createdAt: Date.now()
    });
    return docRef.id;
  } catch (e) {
    console.error('Sipariş eklenemedi:', e);
    return null;
  }
}

async function updateOrder(id, updates) {
  try {
    await updateDoc(doc(db, COLLECTIONS.ORDERS, id), {
      ...updates,
      updatedAt: Date.now()
    });
    return true;
  } catch (e) {
    console.error('Sipariş güncellenemedi:', e);
    return false;
  }
}

async function deleteOrder(id) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.ORDERS, id));
    return true;
  } catch (e) {
    console.error('Sipariş silinemedi:', e);
    return false;
  }
}

// ============================================================
// KULLANICILAR — phone = document ID
// ============================================================

async function getUsers() {
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.USERS));
    const users = [];
    snapshot.forEach(d => users.push({ id: d.id, ...d.data() }));
    return users;
  } catch (e) {
    console.error('Kullanıcılar alınamadı:', e);
    return [];
  }
}

async function getUserByPhone(phone) {
  try {
    const docSnap = await getDoc(doc(db, COLLECTIONS.USERS, phone));
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
    return null;
  } catch (e) {
    console.error('Kullanıcı alınamadı:', e);
    return null;
  }
}

async function addUser(user) {
  try {
    await setDoc(doc(db, COLLECTIONS.USERS, user.phone), {
      ...user,
      createdAt: Date.now()
    });
    return true;
  } catch (e) {
    console.error('Kullanıcı eklenemedi:', e);
    return false;
  }
}

async function deleteUser(phone) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.USERS, phone));
    return true;
  } catch (e) {
    console.error('Kullanıcı silinemedi:', e);
    return false;
  }
}

// ============================================================
// İNDİRİMLER — phone = document ID
// ============================================================

async function getDiscounts() {
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.DISCOUNTS));
    const discounts = {};
    snapshot.forEach(d => { discounts[d.id] = d.data(); });
    return discounts;
  } catch (e) {
    console.error('İndirimler alınamadı:', e);
    return {};
  }
}

async function setDiscount(phone, minAmount, percent) {
  try {
    const p = Math.max(0, Math.min(100, Math.floor(Number(percent) || 0)));
    const m = Math.max(0, Math.floor(Number(minAmount) || 0));
    if (p === 0) {
      await deleteDoc(doc(db, COLLECTIONS.DISCOUNTS, phone));
    } else {
      await setDoc(doc(db, COLLECTIONS.DISCOUNTS, phone), {
        minAmount: m,
        percent: p,
        updatedAt: Date.now()
      });
    }
    return true;
  } catch (e) {
    console.error('İndirim kaydedilemedi:', e);
    return false;
  }
}

// ============================================================
// ADMIN ŞİFRESİ
// ============================================================

async function getAdminPassword() {
  try {
    const docSnap = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'admin'));
    if (docSnap.exists() && docSnap.data().password) return docSnap.data().password;
    await setDoc(doc(db, COLLECTIONS.SETTINGS, 'admin'), {
      password: DEFAULT_ADMIN_PASSWORD,
      updatedAt: Date.now()
    });
    return DEFAULT_ADMIN_PASSWORD;
  } catch (e) {
    console.error('Şifre alınamadı:', e);
    return DEFAULT_ADMIN_PASSWORD;
  }
}

async function setAdminPassword(newPassword) {
  try {
    await setDoc(doc(db, COLLECTIONS.SETTINGS, 'admin'), {
      password: newPassword,
      updatedAt: Date.now()
    });
    return true;
  } catch (e) {
    console.error('Şifre güncellenemedi:', e);
    return false;
  }
}

// ============================================================
// EXPORT
// ============================================================
export {
  db, storage, COLLECTIONS, DEFAULT_ADMIN_PASSWORD,
  uploadImage, deleteImage,
  getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem,
  getOrders, addOrder, updateOrder, deleteOrder,
  getUsers, getUserByPhone, addUser, deleteUser,
  getDiscounts, setDiscount,
  getAdminPassword, setAdminPassword
};