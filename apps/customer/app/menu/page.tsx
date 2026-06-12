"use client";
import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Egg, Moon, Layers, Utensils } from 'lucide-react';
import { menuItems as staticMenuItems, categories as staticCategories, MenuCategory, MenuItem, popularMenuSlugs } from '@/data/menu';
import MenuCard from '@/components/MenuCard';
import { getCategories, getMenuItems } from '@/lib/db/menuService';

type SortOption = 'default' | 'rekomendasi' | 'price-asc' | 'price-desc' | 'terlaris';

const getCategoryIcon = (id: string) => {
  switch (id) {
    case 'semua':
      return <Layers className="w-4 h-4" />;
    case 'martabak-telur-ayam':
      return <Egg className="w-4 h-4 text-amber-600" />;
    case 'martabak-telur-bebek':
      return <Egg className="w-4 h-4 text-emerald-600" />;
    case 'terang-bulan':
      return <Moon className="w-4 h-4 text-yellow-500" />;
    default:
      return <Layers className="w-4 h-4" />;
  }
};

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'semua'>('semua');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('default');
  const [menuItemsState, setMenuItemsState] = useState<MenuItem[]>(staticMenuItems);
  const [categoriesState, setCategoriesState] = useState<{ id: MenuCategory; label: string; icon: string }[]>(staticCategories);

  // Load filter state from sessionStorage on mount & fetch database data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCategory = sessionStorage.getItem('last_menu_category');
      if (savedCategory) {
        setActiveCategory(savedCategory as MenuCategory | 'semua');
      }
      const savedSearch = sessionStorage.getItem('last_menu_search');
      if (savedSearch) {
        setSearch(savedSearch);
      }
      const savedSort = sessionStorage.getItem('last_menu_sort');
      if (savedSort) {
        setSort(savedSort as SortOption);
      }
    }

    async function loadData() {
      try {
        const [fetchedCategories, fetchedItems] = await Promise.all([
          getCategories(),
          getMenuItems()
        ]);
        setCategoriesState(fetchedCategories);
        setMenuItemsState(fetchedItems);
      } catch (err) {
        console.error('Gagal memuat data menu dari database:', err);
      }
    }
    loadData();
  }, []);

  const handleCategoryChange = (cat: MenuCategory | 'semua') => {
    setActiveCategory(cat);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('last_menu_category', cat);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('last_menu_search', val);
    }

    // Auto redirect to terang-bulan if searching for a topping keyword
    const toppingKeywords = [
      'kacang', 'meses', 'keju', 'pisang', 'melon', 'strawberry', 'coklat', 'nanas', 
      'vanilla', 'blueberry', 'tiramisu', 'greentea', 'green tea', 'kismis', 'oreo', 
      'milo', 'nutella', 'silverqueen', 'topping'
    ];
    const lowercaseVal = val.toLowerCase().trim();
    if (lowercaseVal) {
      const isToppingSearch = toppingKeywords.some(keyword => lowercaseVal.includes(keyword));
      if (isToppingSearch) {
        handleCategoryChange('terang-bulan');
      }
    }
  };

  const handleSortChange = (val: SortOption) => {
    setSort(val);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('last_menu_sort', val);
    }
  };

  const filteredMenus = useMemo(() => {
    let items = [...menuItemsState];
    if (activeCategory !== 'semua') {
      items = items.filter((item) => item.category === activeCategory);
    }
    
    const toppingKeywords = [
      'kacang', 'meses', 'keju', 'pisang', 'melon', 'strawberry', 'coklat', 'nanas', 
      'vanilla', 'blueberry', 'tiramisu', 'greentea', 'green tea', 'kismis', 'oreo', 
      'milo', 'nutella', 'silverqueen', 'topping'
    ];
    const lowercaseSearch = search.toLowerCase().trim();
    const isToppingSearch = toppingKeywords.some(keyword => lowercaseSearch.includes(keyword));

    if (search.trim() && !isToppingSearch) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    switch (sort) {
      case 'rekomendasi':
        items.sort((a, b) => {
          const aPopular = popularMenuSlugs.includes(a.slug) || a.badge === 'terlaris';
          const bPopular = popularMenuSlugs.includes(b.slug) || b.badge === 'terlaris';
          if (aPopular && !bPopular) return -1;
          if (!aPopular && bPopular) return 1;
          return 0;
        });
        break;
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'terlaris':
        items.sort((a, _b) => (a.badge === 'terlaris' ? -1 : 1));
        break;
      default:
        items.sort((a, b) => a.price - b.price);
        break;
    }
    return items;
  }, [menuItemsState, activeCategory, search, sort]);

  const allCategories = [{ id: 'semua' as const, label: 'Semua', icon: '🍽️' }, ...categoriesState];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">
            Menu Kami
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto">
            Pilihan martabak & terang bulan terbaik. Semua dibuat fresh setiap hari!
          </p>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-16 z-30 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {allCategories.map((cat) => {
              const count = cat.id === 'semua'
                ? menuItemsState.length
                : menuItemsState.filter((item) => item.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-[#8E0E0E] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-xs ${activeCategory === cat.id ? 'text-white/70' : 'text-gray-400'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari menu..."
              className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8E0E0E] text-sm text-gray-900 bg-white placeholder-gray-400"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8E0E0E] text-sm bg-white appearance-none cursor-pointer"
            >
              <option value="default">Urutkan</option>
              <option value="rekomendasi">Rekomendasi</option>
              <option value="terlaris">Terlaris</option>
              <option value="price-asc">Harga ↑</option>
              <option value="price-desc">Harga ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {filteredMenus.length === 0 ? (
          <div className="text-center py-20">
            <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Menu tidak ditemukan</h3>
            <p className="text-gray-500">Coba kata kunci lain atau pilih kategori berbeda</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Menampilkan <span className="font-semibold text-gray-700">{filteredMenus.length}</span> menu
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredMenus.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
