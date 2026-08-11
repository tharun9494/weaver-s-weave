import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./use-auth";
import { toast } from "sonner";

export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartWishlistContextType {
  cartItems: CartItem[];
  wishlistItems: string[];
  loading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

export function CartWishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load and sync Cart & Wishlist
  useEffect(() => {
    let unsubscribeCart: (() => void) | null = null;
    let unsubscribeWishlist: (() => void) | null = null;

    if (user) {
      // LOGGED IN: Sync with Firestore in real time
      const cartColRef = collection(db, "users", user.uid, "cart");
      const wishlistColRef = collection(db, "users", user.uid, "wishlist");

      // Set up real-time listener for Cart
      unsubscribeCart = onSnapshot(
        cartColRef,
        (snapshot) => {
          const items: CartItem[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            items.push({
              productId: doc.id,
              quantity: data["quantity"] || 1,
            });
          });
          setCartItems(items);
          setLoading(false);
        },
        (error) => {
          console.error("Error listening to cart:", error);
        },
      );

      // Set up real-time listener for Wishlist
      unsubscribeWishlist = onSnapshot(
        wishlistColRef,
        (snapshot) => {
          const items: string[] = [];
          snapshot.forEach((doc) => {
            items.push(doc.id);
          });
          setWishlistItems(items);
        },
        (error) => {
          console.error("Error listening to wishlist:", error);
        },
      );

      // Migration check: If there are items in local storage from a guest session,
      // offer or automatically sync them to their Firestore account.
      const localCart = localStorage.getItem("sahaana-cart");
      const localWishlist = localStorage.getItem("sahaana-wishlist");

      if (localCart || localWishlist) {
        const migrateGuestData = async () => {
          try {
            const batch = writeBatch(db);

            if (localCart) {
              const parsedCart = JSON.parse(localCart) as CartItem[];
              for (const item of parsedCart) {
                const docRef = doc(db, "users", user.uid, "cart", item.productId);
                batch.set(docRef, {
                  productId: item.productId,
                  quantity: item.quantity,
                  addedAt: new Date().toISOString(),
                });
              }
              localStorage.removeItem("sahaana-cart");
            }

            if (localWishlist) {
              const parsedWishlist = JSON.parse(localWishlist) as string[];
              for (const productId of parsedWishlist) {
                const docRef = doc(db, "users", user.uid, "wishlist", productId);
                batch.set(docRef, { productId, addedAt: new Date().toISOString() });
              }
              localStorage.removeItem("sahaana-wishlist");
            }

            await batch.commit();
            toast.success(
              "Sync complete! We've saved your guest bag and wishlist to your account.",
            );
          } catch (err) {
            console.error("Failed to migrate guest session data to Firebase: ", err);
          }
        };

        migrateGuestData();
      }
    } else {
      // GUEST MODE: Load from local storage
      const localCart = localStorage.getItem("sahaana-cart");
      const localWishlist = localStorage.getItem("sahaana-wishlist");

      setCartItems(localCart ? JSON.parse(localCart) : []);
      setWishlistItems(localWishlist ? JSON.parse(localWishlist) : []);
      setLoading(false);
    }

    return () => {
      if (unsubscribeCart) unsubscribeCart();
      if (unsubscribeWishlist) unsubscribeWishlist();
    };
  }, [user]);

  // Wishlist Actions
  const addToWishlist = async (productId: string) => {
    if (user) {
      // Firestore write
      try {
        const docRef = doc(db, "users", user.uid, "wishlist", productId);
        await setDoc(docRef, { productId, addedAt: new Date().toISOString() });

        // Update product's wishlistCount counter
        try {
          const productRef = doc(db, "products", productId);
          await updateDoc(productRef, { wishlistCount: increment(1) });
        } catch (counterErr) {
          console.error("Error updating wishlist count: ", counterErr);
        }

        toast.success("Added to your wishlist", { duration: 1500 });
      } catch (err) {
        console.error("Firestore wishlist error: ", err);
        toast.error("Could not sync wishlist");
      }
    } else {
      // Local storage write
      const newItems = [...wishlistItems, productId];
      setWishlistItems(newItems);
      localStorage.setItem("sahaana-wishlist", JSON.stringify(newItems));
      toast.success("Added to wishlist (Guest session)", { duration: 1500 });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (user) {
      // Firestore delete
      try {
        const docRef = doc(db, "users", user.uid, "wishlist", productId);
        await deleteDoc(docRef);

        // Update product's wishlistCount counter
        try {
          const productRef = doc(db, "products", productId);
          await updateDoc(productRef, { wishlistCount: increment(-1) });
        } catch (counterErr) {
          console.error("Error updating wishlist count: ", counterErr);
        }

        toast.success("Removed from wishlist", { duration: 1500 });
      } catch (err) {
        console.error("Firestore wishlist error: ", err);
        toast.error("Could not sync wishlist");
      }
    } else {
      // Local storage delete
      const newItems = wishlistItems.filter((id) => id !== productId);
      setWishlistItems(newItems);
      localStorage.setItem("sahaana-wishlist", JSON.stringify(newItems));
      toast.success("Removed from wishlist", { duration: 1500 });
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId);
  };

  // Cart Actions
  const addToCart = async (productId: string, quantity = 1) => {
    const existing = cartItems.find((item) => item.productId === productId);
    const newQty = existing ? existing.quantity + quantity : quantity;

    if (user) {
      // Firestore write
      try {
        const docRef = doc(db, "users", user.uid, "cart", productId);
        await setDoc(docRef, { productId, quantity: newQty, addedAt: new Date().toISOString() });
        toast.success("Added to your shopping bag", { duration: 1800 });
      } catch (err) {
        console.error("Firestore cart error: ", err);
        toast.error("Could not add to bag");
      }
    } else {
      // Local storage write
      let newItems: CartItem[] = [];
      if (existing) {
        newItems = cartItems.map((item) =>
          item.productId === productId ? { ...item, quantity: newQty } : item,
        );
      } else {
        newItems = [...cartItems, { productId, quantity }];
      }
      setCartItems(newItems);
      localStorage.setItem("sahaana-cart", JSON.stringify(newItems));
      toast.success("Added to guest bag", { duration: 1800 });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (user) {
      // Firestore delete
      try {
        const docRef = doc(db, "users", user.uid, "cart", productId);
        await deleteDoc(docRef);
        toast.success("Removed from your shopping bag", { duration: 1500 });
      } catch (err) {
        console.error("Firestore cart error: ", err);
        toast.error("Could not remove item");
      }
    } else {
      // Local storage delete
      const newItems = cartItems.filter((item) => item.productId !== productId);
      setCartItems(newItems);
      localStorage.setItem("sahaana-cart", JSON.stringify(newItems));
      toast.success("Removed from guest bag", { duration: 1500 });
    }
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (user) {
      // Firestore update
      try {
        const docRef = doc(db, "users", user.uid, "cart", productId);
        await setDoc(
          docRef,
          { productId, quantity, updatedAt: new Date().toISOString() },
          { merge: true },
        );
      } catch (err) {
        console.error("Firestore cart error: ", err);
        toast.error("Could not update quantity");
      }
    } else {
      // Local storage update
      const newItems = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      );
      setCartItems(newItems);
      localStorage.setItem("sahaana-cart", JSON.stringify(newItems));
    }
  };

  const clearCart = async () => {
    if (user) {
      // Firestore clear (batch delete)
      try {
        const cartColRef = collection(db, "users", user.uid, "cart");
        const snapshot = await getDocs(cartColRef);
        const batch = writeBatch(db);
        snapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      } catch (err) {
        console.error("Firestore cart error: ", err);
      }
    } else {
      // Local storage clear
      setCartItems([]);
      localStorage.removeItem("sahaana-cart");
    }
  };

  return (
    <CartWishlistContext.Provider
      value={{
        cartItems,
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
}

export function useCartWishlist() {
  const context = useContext(CartWishlistContext);
  if (context === undefined) {
    throw new Error("useCartWishlist must be used within a CartWishlistProvider");
  }
  return context;
}
