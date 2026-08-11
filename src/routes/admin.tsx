import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useProducts } from "@/hooks/use-products";
import { formatINR, type Product } from "@/data/catalog";
import { Reveal } from "@/components/site/Reveal";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore";
import {
  ShieldAlert,
  Loader2,
  Plus,
  Trash2,
  Edit,
  ClipboardList,
  Mail,
  TrendingUp,
  Package,
  Heart,
  ExternalLink,
  Save,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Artisan Registry Admin Portal — Sahaana" },
      {
        name: "description",
        content:
          "Restricted administrative access dashboard to manage direct weaver catalog registries and track order dispatch coordinates.",
      },
    ],
  }),
  component: AdminPage,
});

interface AdminOrder {
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  phone: string;
  address: string;
  items: Array<{
    productId: string;
    name: string;
    weave: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  gst: number;
  shipping: number;
  discount: number;
  grandTotal: number;
  status: string;
  createdAt: string;
}

interface AdminContact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

function AdminPage() {
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const { products, loading: productsLoading } = useProducts();

  const [activeTab, setActiveTab] = useState<"catalog" | "orders" | "messages" | "analytics">(
    "catalog",
  );
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [messages, setMessages] = useState<AdminContact[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);

  // CRUD Product Forms State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [sareeId, setSareeId] = useState("");
  const [name, setName] = useState("");
  const [weave, setWeave] = useState("");
  const [price, setPrice] = useState("");
  const [compareAt, setCompareAt] = useState("");
  const [image, setImage] = useState("");
  const [origin, setOrigin] = useState("");
  const [weaver, setWeaver] = useState("");
  const [occasion, setOccasion] = useState("Bridal");
  const [badge, setBadge] = useState("");
  const [instagramLink, setInstagramLink] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const isAdmin = user && user.email === "ontimittatharun2002@gmail.com";

  // Fetch orders and messages in real time (restricted to admin view)
  useEffect(() => {
    if (!isAdmin) return;

    // Listen to orders
    const ordersCol = collection(db, "orders");
    const unsubscribeOrders = onSnapshot(
      ordersCol,
      (snapshot) => {
        const list: AdminOrder[] = [];
        snapshot.forEach((doc) => {
          list.push({ ...doc.data() } as AdminOrder);
        });
        // Sort by date desc
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(list);
        setLoadingOrders(false);
      },
      (err) => {
        console.error("Error listening to orders: ", err);
        setLoadingOrders(false);
      },
    );

    // Listen to contact messages
    const contactsCol = collection(db, "contacts");
    const unsubscribeContacts = onSnapshot(
      contactsCol,
      (snapshot) => {
        const list: AdminContact[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as AdminContact);
        });
        // Sort by date desc
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setMessages(list);
        setLoadingMessages(false);
      },
      (err) => {
        console.error("Error listening to contacts: ", err);
        setLoadingMessages(false);
      },
    );

    return () => {
      unsubscribeOrders();
      unsubscribeContacts();
    };
  }, [isAdmin]);

  // Handle CRUD Save Saree (Add/Edit)
  const handleSaveSaree = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !weave || !price || !origin || !weaver) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const docId = editingProduct
        ? editingProduct.id
        : sareeId.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const productRef = doc(db, "products", docId);

      const payload: Omit<Product, "id"> & { id: string; wishlistCount?: number } = {
        id: docId,
        name,
        weave,
        price: Number(price),
        image: image || "/src/assets/product-bridal.jpg",
        origin,
        weaver,
        occasion,
      };

      if (compareAt) {
        payload.compareAt = Number(compareAt);
      }
      if (badge) {
        payload.badge = badge;
      }
      if (instagramLink) {
        payload.instagramLink = instagramLink;
      }

      if (!editingProduct) {
        payload.wishlistCount = 0; // Initialize counter for new products
      }

      await setDoc(productRef, payload, { merge: true });
      toast.success(editingProduct ? "Saree updated in registry" : "New saree added to registry!");

      // Reset form
      setShowAddModal(false);
      setEditingProduct(null);
      resetForm();
    } catch (err) {
      console.error("Error saving saree doc:", err);
      toast.error("Failed to save saree. Check database rules.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setSareeId(product.id);
    setName(product.name);
    setWeave(product.weave);
    setPrice(product.price.toString());
    setCompareAt(product.compareAt ? product.compareAt.toString() : "");
    setImage(product.image);
    setOrigin(product.origin);
    setWeaver(product.weaver);
    setOccasion(product.occasion);
    setBadge(product.badge || "");
    setInstagramLink(product.instagramLink || "");
    setShowAddModal(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to remove this saree from the active registry?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "products", productId));
      toast.success("Saree removed from registry.");
    } catch (err) {
      console.error("Error deleting product: ", err);
      toast.error("Failed to delete saree.");
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status });
      toast.success(`Order ${orderId} status updated to ${status}`);
    } catch (err) {
      console.error("Error updating order status: ", err);
      toast.error("Failed to update status.");
    }
  };

  const resetForm = () => {
    setSareeId("");
    setName("");
    setWeave("");
    setPrice("");
    setCompareAt("");
    setImage("");
    setOrigin("");
    setWeaver("");
    setOccasion("Bridal");
    setBadge("");
    setInstagramLink("");
  };

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);

  // Sort products by wishlistCount (likes) to get recommendations
  const recommendedProducts = [...products]
    .map((p: Product) => ({
      ...p,
      wishlistCount: p.wishlistCount || 0,
    }))
    .sort((a, b) => b.wishlistCount - a.wishlistCount);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-accent" />
      </div>
    );
  }

  // ACCESS DENIED VIEW
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl px-5 pb-28 pt-36 text-center sm:pt-44">
        <Reveal>
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="size-6" strokeWidth={1.2} />
          </div>
          <h1 className="mt-8 font-display text-4xl text-foreground sm:text-5xl">
            Admin Portal Restricted
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            This panel is restricted to the authorized administrator account. Please sign in under
            the admin email to access this registry.
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={openAuthModal}
              className="rounded-full bg-primary px-10 py-4 text-[11px] uppercase tracking-widest text-primary-foreground shadow-soft transition-all duration-300 hover:bg-primary/95 cursor-pointer font-sans"
            >
              Change Account
            </button>
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
      <Reveal>
        <p className="eyebrow">Registry Management</p>
        <h1 className="mt-4 text-4xl leading-[1.05] text-gold-gradient sm:text-6xl">
          Atelier <em className="not-italic text-foreground">Control Center</em>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          System Dashboard for Administrator: <strong>{user?.email}</strong>.
        </p>
      </Reveal>

      {/* DASHBOARD TABS */}
      <div className="mt-12 flex overflow-x-auto no-scrollbar border-b border-border/60 pb-3 gap-6">
        {(
          [
            { id: "catalog", label: "Manage Catalog", icon: Package },
            { id: "orders", label: `Orders (${orders.length})`, icon: ClipboardList },
            { id: "messages", label: `Enquiries (${messages.length})`, icon: Mail },
            { id: "analytics", label: "Patron Analytics", icon: TrendingUp },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-2 text-[10px] uppercase tracking-widest transition-all cursor-pointer ${
              activeTab === tab.id
                ? "border-b-2 border-accent font-semibold text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="size-3.5" /> {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: CATALOG CRUD */}
      {activeTab === "catalog" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl text-foreground">
              Active Registry ({products.length} Sarees)
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                resetForm();
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[10px] uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/95 cursor-pointer shadow-soft"
            >
              <Plus className="size-3.5" /> Add New Saree
            </button>
          </div>

          {/* Catalog grid */}
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="p-4 pl-6">Saree</th>
                  <th className="p-4">Weave & Occasion</th>
                  <th className="p-4">Weaver Cluster</th>
                  <th className="p-4">Loom Price</th>
                  <th className="p-4">Likes</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {productsLoading ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-muted-foreground">
                      <Loader2 className="mx-auto size-6 animate-spin" />
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-muted-foreground">
                      No sarees in the active registry.
                    </td>
                  </tr>
                ) : (
                  products.map((product: Product) => (
                    <tr key={product.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="size-10 overflow-hidden rounded-lg bg-secondary">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="size-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">{product.name}</span>
                            <span className="text-[10px] text-muted-foreground block">
                              ID: {product.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">{product.weave}</span>
                        <span className="text-[10px] text-accent block uppercase tracking-wider">
                          {product.occasion}
                        </span>
                      </td>
                      <td className="p-4">
                        <span>{product.weaver}</span>
                        <span className="text-[10px] text-muted-foreground block">
                          {product.origin}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-foreground">
                        {formatINR(product.price)}
                      </td>
                      <td className="p-4 text-accent font-semibold">
                        {product.wishlistCount || 0}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditClick(product)}
                            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                            aria-label="Edit product"
                          >
                            <Edit className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="rounded-full p-2 text-destructive/80 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                            aria-label="Delete product"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT: ORDERS LIST */}
      {activeTab === "orders" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10"
        >
          <h3 className="font-display text-2xl text-foreground">Direct Dispatch Archive</h3>

          <div className="mt-8 space-y-6">
            {loadingOrders ? (
              <div className="p-10 text-center text-muted-foreground">
                <Loader2 className="mx-auto size-6 animate-spin text-accent" />
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
                No purchases recorded in the database.
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.orderId}
                  className="rounded-3xl border border-accent/25 bg-card p-6 shadow-soft"
                >
                  <div className="flex flex-col justify-between border-b border-border/60 pb-4 sm:flex-row sm:items-center">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Order Registry ID: {order.orderId}
                      </span>
                      <h4 className="font-display text-xl text-foreground mt-1">
                        Patron: {order.userName} ({order.userEmail})
                      </h4>
                    </div>

                    <div className="mt-3 flex items-center gap-3 sm:mt-0">
                      <span className="text-xs text-muted-foreground">Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.orderId, e.target.value)}
                        className="rounded-full border border-border bg-background px-4 py-1.5 text-xs focus:border-accent focus:outline-none"
                      >
                        <option value="Pending">Pending / Looming</option>
                        <option value="Weaving">Active Weaving</option>
                        <option value="Shipped">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-6 sm:grid-cols-2">
                    {/* Items detail */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                        Weaving Items
                      </span>
                      {order.items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex justify-between items-center text-xs"
                        >
                          <span>
                            {item.name} ({item.weave}) x{" "}
                            <strong className="text-foreground">{item.quantity}</strong>
                          </span>
                          <span className="font-medium text-foreground">
                            {formatINR(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Coordinates */}
                    <div className="text-xs">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                        Shipping Coordinates
                      </span>
                      <p>
                        Phone: <strong className="text-foreground">{order.phone}</strong>
                      </p>
                      <p className="mt-1 whitespace-pre-line leading-relaxed">
                        Address: <strong className="text-foreground">{order.address}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-border/60 pt-4 flex justify-between items-baseline text-xs">
                    <span className="text-muted-foreground">
                      Ordered on: {new Date(order.createdAt).toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      Grand Total:{" "}
                      <strong className="text-base text-gold-gradient font-sans font-semibold">
                        {formatINR(order.grandTotal)}
                      </strong>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT: CONTACT MESSAGES */}
      {activeTab === "messages" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10"
        >
          <h3 className="font-display text-2xl text-foreground">Patron Enquiries</h3>

          <div className="mt-8 space-y-6">
            {loadingMessages ? (
              <div className="p-10 text-center text-muted-foreground">
                <Loader2 className="mx-auto size-6 animate-spin text-accent" />
              </div>
            ) : messages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
                No custom enquiries in the database.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-soft"
                >
                  <div className="flex justify-between items-center border-b border-border/60 pb-3 text-xs">
                    <div>
                      <strong className="text-foreground">{msg.name}</strong> ({msg.email})
                    </div>
                    <span className="text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-foreground whitespace-pre-line">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT: ANALYTICS */}
      {activeTab === "analytics" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 space-y-10"
        >
          {/* Metrics summary cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Loom Revenue",
                value: formatINR(totalRevenue),
                icon: TrendingUp,
                detail: "Total processed orders",
              },
              {
                label: "Catalog Count",
                value: products.length,
                icon: Package,
                detail: "Active sarees in database",
              },
              {
                label: "Support Enquiries",
                value: messages.length,
                icon: Mail,
                detail: "Artisan contact forms",
              },
              {
                label: "Wishlist Toggles",
                value: products.reduce(
                  (sum: number, p: Product) => sum + (p.wishlistCount || 0),
                  0,
                ),
                icon: Heart,
                detail: "Loom design likes recorded",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-accent/20 bg-card p-5 shadow-soft"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </span>
                  <span className="inline-flex rounded-full bg-accent/12 p-2 text-accent">
                    <stat.icon className="size-4" />
                  </span>
                </div>
                <h4 className="mt-4 font-display text-3xl text-foreground font-semibold">
                  {stat.value}
                </h4>
                <p className="mt-1 text-[10px] text-muted-foreground">{stat.detail}</p>
              </div>
            ))}
          </div>

          {/* Recommendations chart based on Wishlist Liked count */}
          <div className="rounded-3xl border border-accent/25 bg-card p-6 shadow-soft sm:p-10">
            <h3 className="font-display text-2xl text-foreground mb-6">
              Patron Wishlist Favorites (Likes Summary)
            </h3>
            <p className="text-xs text-muted-foreground mb-6 -mt-4">
              Overview of catalog items sorted by direct wishlist saves. Useful to identify weaver
              support demands.
            </p>

            <div className="space-y-4">
              {recommendedProducts.map((p, idx) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 text-xs border-b border-border/60 pb-3 last:border-0"
                >
                  <span className="w-6 font-semibold text-muted-foreground">#{idx + 1}</span>
                  <div className="size-10 overflow-hidden rounded bg-secondary shrink-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="size-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <strong className="text-foreground truncate block">{p.name}</strong>
                    <span className="text-[10px] text-muted-foreground truncate block">
                      {p.weave}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-accent">{p.wishlistCount}</span>
                    <Heart className="size-3.5 fill-accent text-accent" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* CRUD ADD/EDIT PRODUCT MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setShowAddModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl border border-accent/25 bg-card p-6 shadow-luxe max-h-[85vh] overflow-y-auto no-scrollbar sm:p-8"
            >
              <h3 className="font-display text-2xl text-foreground mb-6">
                {editingProduct ? "Modify Saree Registry" : "Register New Handloom Saree"}
              </h3>

              <form onSubmit={handleSaveSaree} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="sareeId"
                      className="block text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      Saree ID (Unique slug) *
                    </label>
                    <input
                      id="sareeId"
                      type="text"
                      required
                      disabled={!!editingProduct}
                      placeholder="rani-kanchipuram"
                      value={sareeId}
                      onChange={(e) => setSareeId(e.target.value)}
                      className="mt-1 w-full rounded-full border border-border bg-transparent py-2.5 px-4 text-xs transition-all focus:border-accent focus:outline-none disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sareeName"
                      className="block text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      Saree Name *
                    </label>
                    <input
                      id="sareeName"
                      type="text"
                      required
                      placeholder="Gold Rani Kanchipuram"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-full border border-border bg-transparent py-2.5 px-4 text-xs transition-all focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="sareeWeave"
                      className="block text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      Weave / Yarn Type *
                    </label>
                    <input
                      id="sareeWeave"
                      type="text"
                      required
                      placeholder="Pure Kanchipuram Silk"
                      value={weave}
                      onChange={(e) => setWeave(e.target.value)}
                      className="mt-1 w-full rounded-full border border-border bg-transparent py-2.5 px-4 text-xs transition-all focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sareeOccasion"
                      className="block text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      Occasion Tag *
                    </label>
                    <select
                      id="sareeOccasion"
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="mt-1 w-full rounded-full border border-border bg-background py-2.5 px-4 text-xs transition-all focus:border-accent focus:outline-none"
                    >
                      <option value="Bridal">Bridal</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Festival">Festival</option>
                      <option value="Reception">Reception</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="sareePrice"
                      className="block text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      Loom Price (INR) *
                    </label>
                    <input
                      id="sareePrice"
                      type="number"
                      required
                      placeholder="42800"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="mt-1 w-full rounded-full border border-border bg-transparent py-2.5 px-4 text-xs transition-all focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sareeCompare"
                      className="block text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      Compare Price (INR, Optional)
                    </label>
                    <input
                      id="sareeCompare"
                      type="number"
                      placeholder="51500"
                      value={compareAt}
                      onChange={(e) => setCompareAt(e.target.value)}
                      className="mt-1 w-full rounded-full border border-border bg-transparent py-2.5 px-4 text-xs transition-all focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="sareeOrigin"
                      className="block text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      Origin Cluster *
                    </label>
                    <input
                      id="sareeOrigin"
                      type="text"
                      required
                      placeholder="Kanchipuram, Tamil Nadu"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="mt-1 w-full rounded-full border border-border bg-transparent py-2.5 px-4 text-xs transition-all focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sareeWeaver"
                      className="block text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      Master Weaver Name *
                    </label>
                    <input
                      id="sareeWeaver"
                      type="text"
                      required
                      placeholder="Woven by Murugan & family"
                      value={weaver}
                      onChange={(e) => setWeaver(e.target.value)}
                      className="mt-1 w-full rounded-full border border-border bg-transparent py-2.5 px-4 text-xs transition-all focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="sareeBadge"
                      className="block text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      Overlay Badge (Optional)
                    </label>
                    <input
                      id="sareeBadge"
                      type="text"
                      placeholder="New Arrival / Limited"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="mt-1 w-full rounded-full border border-border bg-transparent py-2.5 px-4 text-xs transition-all focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sareeVideo"
                      className="block text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      Instagram Link (Saree Video Explanation)
                    </label>
                    <input
                      id="sareeVideo"
                      type="url"
                      placeholder="https://instagram.com/p/..."
                      value={instagramLink}
                      onChange={(e) => setInstagramLink(e.target.value)}
                      className="mt-1 w-full rounded-full border border-border bg-transparent py-2.5 px-4 text-xs transition-all focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="sareeImage"
                    className="block text-[10px] uppercase tracking-wider text-muted-foreground"
                  >
                    Product Image Asset Path / URL
                  </label>
                  <input
                    id="sareeImage"
                    type="text"
                    placeholder="/src/assets/product-bridal.jpg"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="mt-1 w-full rounded-full border border-border bg-transparent py-2.5 px-4 text-xs transition-all focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="mt-8 flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-[10px] uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/95 disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="size-3.5" /> Save Saree
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-full border border-border px-6 py-3 text-[10px] uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
