import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCartWishlist } from "@/hooks/use-cart-wishlist";
import { useProducts } from "@/hooks/use-products";
import { formatINR, type Product } from "@/data/catalog";
import { Reveal } from "@/components/site/Reveal";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Loader2,
  Tag,
  CheckCircle2,
  Ticket,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Bag — Sahaana Handloom" },
      {
        name: "description",
        content:
          "Review your selected handwoven silk sarees, calculate weaver pricing, GST, and place orders.",
      },
    ],
  }),
  component: CartPage,
});

interface CartProduct extends Product {
  quantity: number;
  totalItemPrice: number;
}

function CartPage() {
  const { cartItems, removeFromCart, updateCartQuantity, clearCart } = useCartWishlist();
  const { products, loading } = useProducts();
  const { user, profile, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0); // 0.1 for 10%
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  // Map cart items to full product objects
  const cartProducts = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return {
        ...product,
        quantity: item.quantity,
        totalItemPrice: product.price * item.quantity,
      };
    })
    .filter(Boolean) as Array<CartProduct>;

  // Calculations
  const subtotal = cartProducts.reduce((sum, item) => sum + item.totalItemPrice, 0);
  const discountAmount = subtotal * appliedDiscount;
  const gstAmount = Math.round((subtotal - discountAmount) * 0.05); // 5% GST for handlooms
  const shippingCost = subtotal > 15000 || subtotal === 0 ? 0 : 350; // Free shipping above ₹15,000
  const grandTotal = subtotal - discountAmount + gstAmount + shippingCost;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "SAHAANA10") {
      setAppliedDiscount(0.1);
      setIsPromoApplied(true);
      toast.success("Promo code 'SAHAANA10' applied! 10% discount subtracted.");
    } else {
      toast.error("Invalid coupon code. Try SAHAANA10");
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.info("Please sign in to place your weaver-authenticated order.");
      openAuthModal();
      return;
    }

    if (!profile?.phone || !profile?.address) {
      toast.info("Please complete your delivery coordinates in your profile first.");
      navigate({ to: "/profile" });
      return;
    }

    setPlacingOrder(true);
    try {
      const orderId = `SH-${Math.floor(1000 + Math.random() * 9000)}`;
      const orderRef = doc(db, "orders", orderId);

      await setDoc(orderRef, {
        orderId,
        userId: user.uid,
        userEmail: user.email || "",
        userName: profile.name || "Patron",
        phone: profile.phone || "",
        address: profile.address || "",
        items: cartProducts.map((p) => ({
          productId: p.id,
          name: p.name,
          weave: p.weave,
          price: p.price,
          quantity: p.quantity,
          image: p.image,
        })),
        subtotal,
        gst: gstAmount,
        shipping: shippingCost,
        discount: discountAmount,
        grandTotal,
        status: "Pending",
        createdAt: new Date().toISOString(),
      });

      setGeneratedOrderId(orderId);
      setShowCheckoutSuccess(true);
      toast.success("Order Placed Successfully!");
    } catch (err) {
      console.error("Error creating Firestore order: ", err);
      toast.error("Failed to place order. Check database permissions.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleFinishCheckout = async () => {
    await clearCart();
    setShowCheckoutSuccess(false);
    navigate({ to: "/profile" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
      <Reveal>
        <p className="eyebrow">My Bag</p>
        <h1 className="mt-4 text-4xl leading-[1.05] text-foreground sm:text-6xl">
          Shopping <em className="text-gold-gradient not-italic">bag</em>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Review your selected weaves, apply patron discounts, and dispatch orders direct to weaving
          hubs.
        </p>
      </Reveal>

      {cartProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-20 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 p-12 text-center"
        >
          <div className="flex size-16 items-center justify-center rounded-full bg-accent/8 text-accent">
            <ShoppingBag className="size-6" strokeWidth={1.2} />
          </div>
          <h3 className="mt-6 font-display text-2xl text-foreground">Your shopping bag is empty</h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Preserve handloom heritage by adding authentic sarees to your bag.
          </p>
          <div className="mt-8">
            <Link
              to="/collections"
              className="rounded-full bg-primary px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/95"
            >
              Discover Sarees
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          {/* ITEMS LIST */}
          <div className="space-y-6 lg:col-span-8">
            <AnimatePresence>
              {cartProducts.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0, padding: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6 rounded-3xl border border-accent/15 bg-card p-5 sm:flex-row sm:items-center justify-between"
                >
                  <div className="flex gap-4 items-center">
                    {/* Item Image */}
                    <div className="size-24 shrink-0 overflow-hidden rounded-2xl bg-secondary">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div className="flex size-full items-center justify-center bg-accent/10 font-display text-gold">
                        Saree
                      </div>
                    </div>

                    <div>
                      <p className="eyebrow text-[8px]">{item.weave}</p>
                      <h4 className="font-display text-xl text-foreground mt-1">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.weaver}</p>
                      <p className="text-xs text-accent mt-2">Loom-Certified</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-6 sm:justify-end">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 rounded-full border border-border bg-transparent px-3 py-1">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="text-muted-foreground transition-colors hover:text-foreground p-1"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="text-muted-foreground transition-colors hover:text-foreground p-1"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>

                    {/* Total Price & Delete button */}
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-foreground text-sm min-w-20 text-right">
                        {formatINR(item.totalItemPrice)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-full text-muted-foreground p-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="size-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* SUMMARY SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-accent/20 bg-card p-6 shadow-soft sm:p-8">
              <h3 className="font-display text-2xl text-foreground">Order Summary</h3>

              {/* Promo input */}
              <div className="mt-6">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground block">
                  Promo / Coupon Code
                </label>
                <div className="relative mt-2 flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3.5 top-3.5 size-4 text-muted-foreground/60" />
                    <input
                      type="text"
                      placeholder="SAHAANA10"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={isPromoApplied}
                      className="w-full rounded-full border border-border bg-transparent py-2.5 pl-10 pr-4 text-xs tracking-wider transition-all focus:border-accent focus:outline-none disabled:opacity-60"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={isPromoApplied}
                    className="rounded-full bg-secondary border border-border px-4 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-accent/12 disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
                {isPromoApplied && (
                  <p className="mt-2 text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                    <Tag className="size-3" /> 10% coupon applied successfully!
                  </p>
                )}
              </div>

              <div className="mt-8 space-y-4 text-xs border-t border-border/60 pt-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loom Value Subtotal</span>
                  <span className="font-medium text-foreground">{formatINR(subtotal)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>10% Patron Discount</span>
                    <span>-{formatINR(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Textile GST (5%)</span>
                  <span className="font-medium text-foreground">{formatINR(gstAmount)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Artisan Shipping</span>
                  <span className="font-medium text-foreground">
                    {shippingCost === 0 ? "FREE" : formatINR(shippingCost)}
                  </span>
                </div>

                <hr className="border-border/60" />

                <div className="flex justify-between text-sm font-semibold pt-2 text-foreground">
                  <span>Grand Total</span>
                  <span className="text-base text-gold-gradient">{formatINR(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={placingOrder}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 shadow-soft"
                >
                  {placingOrder ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      Secure Checkout <ArrowRight className="size-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT SUCCESS MODAL */}
      <AnimatePresence>
        {showCheckoutSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={handleFinishCheckout}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-3xl border border-accent/25 bg-card p-6 text-center shadow-luxe sm:p-10"
            >
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="size-8" strokeWidth={1.5} />
              </div>

              <h3 className="mt-6 font-display text-3xl text-foreground">Order Dispatched!</h3>
              <p className="mt-2 text-xs uppercase tracking-widest text-accent">
                Order ID: {generatedOrderId}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Your purchase was sent directly to our weaver hubs. The loom master has logged your
                order, and the authenticity certificates are being minted.
              </p>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={handleFinishCheckout}
                  className="w-full rounded-full bg-primary py-4 text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/95"
                >
                  Track in Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
