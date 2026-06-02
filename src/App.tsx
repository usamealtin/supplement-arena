import { useState, useEffect, useMemo } from 'react';
import { Database, User, Product, Comment, PendingProduct, EnrichedProduct } from './types';
import { loadDatabase, saveDatabase, loadUser, saveUser } from './utils/storage';
import { rankProducts } from './utils/helpers';
import { Header } from './components/Header';
import { ProductForm } from './components/ProductForm';
import { ProductCard } from './components/ProductCard';
import { AdminPanel } from './components/AdminPanel';
import { CategoryInfo } from './components/CategoryInfo';
import { SortControls } from './components/SortControls';
import { Calculator } from './components/Calculator';
import { AuthModal } from './components/AuthModal';
import { UserDashboard } from './components/UserDashboard';

export default function App() {
  const [db, setDb] = useState<Database>(loadDatabase());
  const [user, setUser] = useState<User | null>(loadUser());
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortField, setSortField] = useState('cost_per_gram');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  // Verileri localStorage'a kaydet
  useEffect(() => {
    saveDatabase(db);
  }, [db]);

  // Kullanıcıyı localStorage'a kaydet
  useEffect(() => {
    saveUser(user);
  }, [user]);

  // Kategorileri ve markaları al
  const categories = db.categories || [];
  const brands = db.brands || [];

  // Zenginleştirilmiş ürünleri hazırla
  const enrichedProducts = useMemo(() => {
    let filtered = db.products.filter((p) => p.approved);

    if (selectedCategory) {
      filtered = filtered.filter(
        (p) =>
          p.category.toLocaleUpperCase('tr-TR') ===
          selectedCategory.toLocaleUpperCase('tr-TR')
      );
    }

    return filtered.map((product) => {
      const productComments = db.comments.filter((c) => c.productId === product.id);
      let totalTaste = product.taste || 0;
      let tasteCount = product.taste ? 1 : 0;

      productComments.forEach((c) => {
        if (c.taste > 0) {
          totalTaste += c.taste;
          tasteCount++;
        }
      });

      return {
        product,
        comments: productComments,
        tasteAvg: tasteCount > 0 ? totalTaste / tasteCount : 0,
        metrics: {
          costPerServing: product.price / product.servings,
          costPerGram: product.price / (product.servings * product.grams),
          costPerContentGram:
            product.contentGrams && product.contentGrams > 0
              ? product.price / (product.servings * product.contentGrams)
              : 0,
        },
        rank: 0,
      } as EnrichedProduct;
    });
  }, [db, selectedCategory]);

  // Sıralanmış ürünleri al
  const rankedList = useMemo(
    () => rankProducts(enrichedProducts, sortField, sortDir),
    [enrichedProducts, sortField, sortDir]
  );

  // Handlers
  const handleAddProduct = (product: Product) => {
    setDb((prev) => ({
      ...prev,
      products: [{ ...product, approved: true }, ...prev.products],
    }));
  };

  const handleUpdateProduct = (product: Product) => {
    setDb((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === product.id ? { ...product, approved: true } : p
      ),
    }));
  };

  const handleDeleteProduct = (productId: string) => {
    setDb((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
      // Ürüne ait yorumları da temizle
      comments: prev.comments.filter((c) => c.productId !== productId),
    }));
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setDb((prev) => ({
        ...prev,
        categories: [...prev.categories, category],
      }));
    }
  };

  const handleDeleteCategory = (category: string) => {
    setDb((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
  };

  const handleAddBrand = (brand: string) => {
    if (!brands.includes(brand)) {
      setDb((prev) => ({
        ...prev,
        brands: [...prev.brands, brand],
      }));
    }
  };

  const handleDeleteBrand = (brand: string) => {
    setDb((prev) => ({
      ...prev,
      brands: prev.brands.filter((b) => b !== brand),
    }));
  };

  const handleSuggestProduct = (product: Omit<PendingProduct, 'id' | 'suggestedBy' | 'status'>) => {
    const pending: PendingProduct = {
      ...product,
      id: Date.now().toString(),
      suggestedBy: user?.name || 'Anonim',
      status: 'pending',
    };
    setDb((prev) => ({
      ...prev,
      pendingProducts: [...prev.pendingProducts, pending],
    }));
  };

  const handleAddComment = (productId: string, text: string, taste: number) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      productId,
      text,
      taste,
      author: user?.name || 'Anonim',
      date: new Date().toISOString(),
    };
    setDb((prev) => ({
      ...prev,
      comments: [...prev.comments, newComment],
    }));
  };

  const handleApprovePending = (pendingId: string) => {
    const pending = db.pendingProducts.find((p) => p.id === pendingId);
    if (!pending) return;

    const newProduct: Product = {
      id: pending.id,
      category: pending.category,
      brand: pending.brand,
      name: pending.name,
      url: pending.url,
      price: pending.price,
      servings: pending.servings,
      grams: pending.grams,
      contentName: pending.contentName,
      contentGrams: pending.contentGrams,
      code: pending.code,
      taste: pending.taste,
      date: pending.date,
      approved: true,
    };

    setDb((prev) => ({
      ...prev,
      products: [newProduct, ...prev.products],
      pendingProducts: prev.pendingProducts.filter((p) => p.id !== pendingId),
    }));
  };

  const handleRejectPending = (pendingId: string) => {
    setDb((prev) => ({
      ...prev,
      pendingProducts: prev.pendingProducts.filter((p) => p.id !== pendingId),
    }));
  };

  const handleRegister = (userData: { name: string; email: string; password: string }) => {
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    setDb((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
    }));

    setUser(newUser);
    setShowDashboard(true);
  };

  const handleLogin = (loggedInUser: User) => {
    const foundUser = db.users.find((u) => u.id === loggedInUser.id || u.email === loggedInUser.email);
    if (foundUser) {
      setUser(foundUser);
      setShowDashboard(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setShowDashboard(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setDb((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    }));
    setUser(updatedUser);
  };

  const handleDeleteAccount = (userId: string) => {
    setDb((prev) => ({
      ...prev,
      users: prev.users.filter((u) => u.id !== userId),
      // Kullanıcının yorumlarını da silelim
      comments: prev.comments.filter((c) => {
        const authorUser = prev.users.find((u) => u.id === userId);
        return authorUser ? c.author !== authorUser.name : true;
      }),
    }));
    handleLogout();
  };

  const handlePromoteToAdmin = (userId: string) => {
    setDb((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === userId ? { ...u, role: 'admin' as const } : u
      ),
    }));
  };

  const pendingCount = db.pendingProducts.filter((p) => p.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onLogin={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        pendingCount={pendingCount}
        onShowDashboard={() => setShowDashboard(true)}
      />
 
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Profil Sayfası - showDashboard açıkken göster */}
        {showDashboard && user ? (
          <div>
            <button
              onClick={() => setShowDashboard(false)}
              className="text-sm text-gray-500 hover:text-gray-700 mb-3 flex items-center gap-1"
            >
              ← Ana Sayfaya Dön
            </button>
            <UserDashboard
              user={user}
              allUsers={db.users}
              onUpdateUser={handleUpdateUser}
              onDeleteAccount={handleDeleteAccount}
              onPromoteToAdmin={handlePromoteToAdmin}
              onLogout={handleLogout}
              onClose={() => setShowDashboard(false)}
            />
          </div>
        ) : (
          <>
            {/* Admin Panel */}
            {user?.role === 'admin' && (
              <AdminPanel
                pendingProducts={db.pendingProducts.filter((p) => p.status === 'pending')}
                categories={categories}
                brands={brands}
                onApprovePending={handleApprovePending}
                onRejectPending={handleRejectPending}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                onAddBrand={handleAddBrand}
                onDeleteBrand={handleDeleteBrand}
              />
            )}

            {/* Category Info */}
            {selectedCategory && <CategoryInfo category={selectedCategory} />}

            {/* Karşılaştırma Hesaplayıcısı - Her zaman açık */}
            <Calculator />

            {/* Ürün Önerme Formu - Collapse'lı */}
            <ProductForm
              categoryList={categories}
              brandList={brands}
              onAddProduct={handleAddProduct}
              onSuggestProduct={handleSuggestProduct}
              isLoggedIn={!!user}
              isAdmin={user?.role === 'admin'}
            />

            {/* Sort Controls */}
            <SortControls
              sortField={sortField}
              sortDir={sortDir}
              onSortFieldChange={setSortField}
              onSortDirChange={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
            />

            {/* Products List */}
            <div>
              {rankedList.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-300 bg-white text-gray-400 font-bold uppercase rounded">
                  {selectedCategory
                    ? `${selectedCategory} kategorisinde henüz ürün yok.`
                    : 'Henüz ürün yok. Yukarıdan ekleyin!'}
                </div>
              ) : (
                rankedList.map((item) => (
                  <ProductCard
                    key={item.product.id}
                    ranked={item}
                    user={user}
                    categoryList={categories}
                    brandList={brands}
                    onAddComment={handleAddComment}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                  />
                ))
              )}
            </div>
          </>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        existingUsers={db.users}
      />

      {/* User Dashboard */}
      {showDashboard && user && (
        <UserDashboard
          user={user}
          allUsers={db.users}
          onUpdateUser={handleUpdateUser}
          onDeleteAccount={handleDeleteAccount}
          onPromoteToAdmin={handlePromoteToAdmin}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
