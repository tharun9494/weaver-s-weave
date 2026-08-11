import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { products as defaultProducts, type Product } from "@/data/catalog";

// Helper function to seed initial products in Firestore if collection is empty
export async function initializeFirestoreProducts() {
  try {
    const productsCol = collection(db, "products");
    const snapshot = await getDocs(productsCol);

    if (snapshot.empty) {
      console.log("Firestore products collection is empty. Seeding default products...");
      for (const product of defaultProducts) {
        // Use product.id as the document ID
        await setDoc(doc(db, "products", product.id), {
          ...product,
          createdAt: new Date().toISOString(),
        });
      }
      console.log("Seeding complete!");
    }
  } catch (error) {
    console.error("Error seeding initial products to Firestore: ", error);
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // First, run the seeding check
    initializeFirestoreProducts().finally(() => {
      // Then set up real-time listener for the products
      const productsCol = collection(db, "products");

      const unsubscribe = onSnapshot(
        productsCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Product[] = [];
            snapshot.forEach((doc) => {
              list.push({ id: doc.id, ...doc.data() } as Product);
            });
            setProducts(list);
          } else {
            // Fallback to static catalog if snapshot is empty
            setProducts(defaultProducts);
          }
          setLoading(false);
        },
        (err) => {
          console.error(
            "Error fetching products from Firestore, falling back to static data: ",
            err,
          );
          setError(err);
          setProducts(defaultProducts);
          setLoading(false);
        },
      );

      return () => unsubscribe();
    });
  }, []);

  return { products, loading, error };
}
