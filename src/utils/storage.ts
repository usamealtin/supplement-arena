import { Database } from '../types';
import { demoData } from '../data/demoData';
import { getContentNameByCategory, getDefaultContentGrams } from './helpers';
import { pushToCloud } from './cloudStore';

const DB_KEY = 'supplement_arena_db';
const USER_KEY = 'supplement_arena_user';
let syncTimer: ReturnType<typeof setTimeout> | null = null;

export function loadDatabase(): Database {
  try {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.products && parsed.products.length > 0) {
        return normalizeDatabase(parsed);
      }
    }
  } catch (error) {
    console.error('Error loading database:', error);
  }
  return normalizeDatabase(JSON.parse(JSON.stringify(demoData))); // Deep copy
}

function normalizeDatabase(db: Partial<Database>): Database {
  const normalized = {
    ...demoData,
    ...db,
    categories:
      db.categories && db.categories.length > 0 ? db.categories : demoData.categories,
    brands: db.brands && db.brands.length > 0 ? db.brands : demoData.brands,
    products: db.products || demoData.products,
    comments: db.comments || demoData.comments,
    pendingProducts: db.pendingProducts || [],
    users: db.users || demoData.users,
  } as Database;

  normalized.products = normalized.products.map((product) => ({
    ...product,
    contentName: product.contentName || getContentNameByCategory(product.category),
    contentGrams:
      product.contentGrams || getDefaultContentGrams(product.category, product.grams),
  }));

  normalized.pendingProducts = normalized.pendingProducts.map((product) => ({
    ...product,
    contentName: product.contentName || getContentNameByCategory(product.category),
    contentGrams:
      product.contentGrams || getDefaultContentGrams(product.category, product.grams),
  }));

  return normalized;
}

export function saveDatabase(db: Database): void {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));

    // Cloud'a otomatik senkronizasyon (debounced)
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
      pushToCloud(db).then((result) => {
        if (!result.success) {
          console.log('Cloud sync failed, data saved locally');
        }
      });
    }, 2000);
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

export function loadUser(): any {
  try {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading user:', error);
  }
  return null;
}

export function saveUser(user: any): void {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (error) {
    console.error('Error saving user:', error);
  }
}
