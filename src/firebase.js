import { set } from "date-fns";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDpP9Eqz9CIVCleL6YYyr3o7CYGjEuK_Bo",
  authDomain: "sistemrekomendasipariwisatadt.firebaseapp.com",
  projectId: "sistemrekomendasipariwisatadt",
  storageBucket: "sistemrekomendasipariwisatadt.appspot.com",
  messagingSenderId: "287021798913",
  appId: "1:287021798913:web:1d2ecbc32365efc4535200",
  measurementId: "G-8HDK2T3QZJ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);

document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submit");
  if (submitButton) {
    submitButton.addEventListener('click', async function(e){
      e.preventDefault();
      try {
        const docRef = doc(db, 'user', document.getElementById("name").value);
        await setDoc(docRef, {
          name: document.getElementById("name").value,
          address: document.getElementById("address").value,
          facilities: document.getElementById("facilities").value,
          price: document.getElementById("price").value,
          contactInfo: document.getElementById("contactInfo").value
        });
        alert("Success");
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    });
  } else {
    console.error('Submit button not found');
  }
});
