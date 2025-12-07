import { MenuItem, Order, Table, Booking, ChatMessage, OrderStatus, TableStatus, Tenant, SaaSModule } from '../types';

// --- MASTER LIBRARY (Pre-filled items for quick setup) ---
export const MASTER_LIBRARY: MenuItem[] = [
  // COFFEE
  { 
    id: 'lib_1', 
    name: 'Espresso', description: 'Rich, concentrated coffee served in a small cup.', 
    nameFr: 'Espresso', descriptionFr: 'Café riche et concentré servi dans une petite tasse.',
    nameAr: 'إسبريسو', descriptionAr: 'قهوة غنية ومركزة تقدم في كوب صغير.',
    price: 20, category: 'Coffee', available: true,
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'lib_2', 
    name: 'Double Espresso', description: 'Two shots of our signature espresso blend.', 
    nameFr: 'Double Espresso', descriptionFr: 'Deux doses de notre mélange espresso signature.',
    nameAr: 'دبل إسبريسو', descriptionAr: 'جرعتين من خليط الإسبريسو الخاص بنا.',
    price: 28, category: 'Coffee', available: true,
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'lib_3', 
    name: 'Cappuccino', description: 'Espresso topped with foamed milk.', 
    nameFr: 'Cappuccino', descriptionFr: 'Espresso surmonté de mousse de lait.',
    nameAr: 'كابتشينو', descriptionAr: 'إسبريسو مغطى رغوة الحليب.',
    price: 30, category: 'Coffee', available: true,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'lib_4', 
    name: 'Café Latte', description: 'Espresso with steamed milk and a thin layer of foam.', 
    nameFr: 'Café Latte', descriptionFr: 'Espresso avec lait chaud et une fine couche de mousse.',
    nameAr: 'كافيه لاتيه', descriptionAr: 'إسبريسو مع حليب مبخر وطبقة رقيقة من الرغوة.',
    price: 32, category: 'Coffee', available: true,
    image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'lib_5', 
    name: 'Iced Americano', description: 'Espresso shots topped with cold water and ice.', 
    nameFr: 'Americano Glacé', descriptionFr: 'Doses d\'espresso allongées avec de l\'eau froide et des glaçons.',
    nameAr: 'آيس أمريكانو', descriptionAr: 'جرعات إسبريسو مع ماء بارد وثلج.',
    price: 28, category: 'Coffee', available: true,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'lib_6', 
    name: 'Caramel Macchiato', description: 'Espresso with vanilla syrup, steamed milk and caramel drizzle.', 
    nameFr: 'Caramel Macchiato', descriptionFr: 'Espresso avec sirop de vanille, lait chaud et filet de caramel.',
    nameAr: 'كراميل ماكياتو', descriptionAr: 'إسبريسو مع شراب الفانيليا، حليب مبخر وصوص الكراميل.',
    price: 38, category: 'Coffee', available: true,
    image: 'https://images.unsplash.com/photo-1485808191679-5f8c7c860695?auto=format&fit=crop&w=800&q=80'
  },

  // BAKERY & PASTRY
  { 
    id: 'lib_7', 
    name: 'Butter Croissant', description: 'Classic French flaky pastry.', 
    nameFr: 'Croissant au Beurre', descriptionFr: 'Classique de la viennoiserie française.',
    nameAr: 'كرواسون بالزبدة', descriptionAr: 'معجنات فرنسية كلاسيكية هشة.',
    price: 15, category: 'Pastry', available: true,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'lib_8', 
    name: 'Pain au Chocolat', description: 'Flaky pastry filled with dark chocolate.', 
    nameFr: 'Pain au Chocolat', descriptionFr: 'Pâte feuilletée garnie de chocolat noir.',
    nameAr: 'بان أو شوكولا', descriptionAr: 'معجنات هشة محشوة بالشوكولاتة الداكنة.',
    price: 18, category: 'Pastry', available: true,
    image: 'https://images.unsplash.com/photo-1623158021877-c8695ee26982?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'lib_9', 
    name: 'Blueberry Muffin', description: 'Soft muffin baked with fresh blueberries.', 
    nameFr: 'Muffin aux Myrtilles', descriptionFr: 'Muffin moelleux cuit avec des myrtilles fraîches.',
    nameAr: 'مافن التوت', descriptionAr: 'مافن طري مخبوز مع التوت الطازج.',
    price: 22, category: 'Pastry', available: true,
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'lib_10', 
    name: 'Cheesecake', description: 'Creamy New York style cheesecake slice.', 
    nameFr: 'Cheesecake', descriptionFr: 'Part de cheesecake crémeux style New York.',
    nameAr: 'تشيز كيك', descriptionAr: 'قطعة تشيز كيك كريمية على طريقة نيويورك.',
    price: 45, category: 'Pastry', available: true,
    image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=800&q=80'
  },

  // BREAKFAST & FOOD
  { 
    id: 'lib_11', 
    name: 'Avocado Toast', description: 'Sourdough bread, mashed avocado, poached egg.', 
    nameFr: 'Toast Avocat', descriptionFr: 'Pain au levain, purée d\'avocat, œuf poché.',
    nameAr: 'توست الأفوكادو', descriptionAr: 'خبز العجين المخمر، أفوكادو مهروس، بيض مسلوق.',
    price: 65, category: 'Food', available: true,
    image: 'https://images.unsplash.com/photo-1588137372308-15f75323ca8d?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'lib_12', 
    name: 'Pancakes Stack', description: 'Fluffy pancakes with maple syrup and berries.', 
    nameFr: 'Pile de Pancakes', descriptionFr: 'Pancakes moelleux avec sirop d\'érable et baies.',
    nameAr: 'بان كيك', descriptionAr: 'بان كيك هش مع شراب القيقب والتوت.',
    price: 50, category: 'Food', available: true,
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'lib_13', 
    name: 'Club Sandwich', description: 'Chicken, lettuce, tomato, cheese and mayo.', 
    nameFr: 'Club Sandwich', descriptionFr: 'Poulet, laitue, tomate, fromage et mayonnaise.',
    nameAr: 'كلوب ساندويتش', descriptionAr: 'دجاج، خس، طماطم، جبن ومايونيز.',
    price: 55, category: 'Food', available: true,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80'
  },

  // DRINKS
  { 
    id: 'lib_14', 
    name: 'Fresh Orange Juice', description: 'Freshly squeezed oranges.', 
    nameFr: 'Jus d\'Orange', descriptionFr: 'Oranges fraîchement pressées.',
    nameAr: 'عصير برتقال', descriptionAr: 'برتقال طازج معصور.',
    price: 25, category: 'Drinks', available: true,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'lib_15', 
    name: 'Mojito Virgin', description: 'Lime, mint, soda water and sugar.', 
    nameFr: 'Mojito Virgin', descriptionFr: 'Citron vert, menthe, eau gazeuse et sucre.',
    nameAr: 'موهيتو فيرجن', descriptionAr: 'ليمون، نعناع، مياه غازية وسكر.',
    price: 35, category: 'Drinks', available: true,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'lib_16', 
    name: 'Strawberry Smoothie', description: 'Strawberries, banana, yogurt.', 
    nameFr: 'Smoothie Fraise', descriptionFr: 'Fraises, banane, yaourt.',
    nameAr: 'سموذي الفراولة', descriptionAr: 'فراولة، موز، زبادي.',
    price: 40, category: 'Drinks', available: true,
    image: 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'lib_17', 
    name: 'Moroccan Mint Tea', description: 'Green tea with fresh mint leaves.', 
    nameFr: 'Thé à la Menthe', descriptionFr: 'Thé vert avec feuilles de menthe fraîches.',
    nameAr: 'شاي مغربي', descriptionAr: 'شاي أخضر بأوراق النعناع الطازجة.',
    price: 20, category: 'Drinks', available: true,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231847233?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'lib_18', 
    name: 'Hot Chocolate', description: 'Creamy hot chocolate with marshmallows.', 
    nameFr: 'Chocolat Chaud', descriptionFr: 'Chocolat chaud crémeux avec guimauves.',
    nameAr: 'شوكلاتة ساخنة', descriptionAr: 'شوكلاتة ساخنة كريمية مع المارشميلو.',
    price: 35, category: 'Drinks', available: true,
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80'
  }
];

// Initial Mock Data
const INITIAL_MENU: MenuItem[] = [
  MASTER_LIBRARY[0], // Espresso
  MASTER_LIBRARY[2], // Cappuccino
  MASTER_LIBRARY[6], // Croissant
  MASTER_LIBRARY[10], // Avocado Toast
  MASTER_LIBRARY[16], // Tea
];

const INITIAL_TABLES: Table[] = Array.from({ length: 10 }, (_, i) => ({
  id: `t-${i + 1}`,
  number: i + 1,
  capacity: i % 2 === 0 ? 4 : 2,
  status: TableStatus.AVAILABLE,
}));

const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Café Luxe Casablanca',
    ownerName: 'Ahmed Benali',
    email: 'ahmed@cafeluxe.ma',
    activeModules: [SaaSModule.POS, SaaSModule.QR_MENU, SaaSModule.KITCHEN_DISPLAY, SaaSModule.TABLE_BOOKING, SaaSModule.LIVE_CHAT],
    subscriptionPlan: 'ENTERPRISE',
    status: 'ACTIVE'
  },
  {
    id: 'tenant-2',
    name: 'Burger Station',
    ownerName: 'Sarah Smith',
    email: 'sarah@burgerstation.com',
    activeModules: [SaaSModule.POS, SaaSModule.KITCHEN_DISPLAY], // No QR Menu or Booking
    subscriptionPlan: 'BASIC',
    status: 'ACTIVE'
  },
  {
    id: 'tenant-3',
    name: 'MatchDay Sports Bar',
    ownerName: 'Karim Z.',
    email: 'karim@matchday.ma',
    activeModules: [SaaSModule.POS, SaaSModule.QR_MENU, SaaSModule.TABLE_BOOKING], // No Kitchen Display
    subscriptionPlan: 'PRO',
    status: 'ACTIVE'
  }
];

// LocalStorage Keys
const STORAGE_KEYS = {
  MENU: 'restoflow_menu',
  ORDERS: 'restoflow_orders',
  TABLES: 'restoflow_tables',
  BOOKINGS: 'restoflow_bookings',
  CHAT: 'restoflow_chat',
  TENANTS: 'restoflow_tenants'
};

class MockDBService {
  // Tenant Management
  getTenants(): Tenant[] {
    const stored = localStorage.getItem(STORAGE_KEYS.TENANTS);
    return stored ? JSON.parse(stored) : INITIAL_TENANTS;
  }

  saveTenants(tenants: Tenant[]) {
    localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(tenants));
  }

  // Data Management
  getMenu(): MenuItem[] {
    const stored = localStorage.getItem(STORAGE_KEYS.MENU);
    return stored ? JSON.parse(stored) : INITIAL_MENU;
  }

  saveMenu(menu: MenuItem[]) {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menu));
  }

  getTables(): Table[] {
    const stored = localStorage.getItem(STORAGE_KEYS.TABLES);
    return stored ? JSON.parse(stored) : INITIAL_TABLES;
  }

  saveTables(tables: Table[]) {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
  }

  getOrders(): Order[] {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return stored ? JSON.parse(stored) : [];
  }

  saveOrders(orders: Order[]) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  getBookings(): Booking[] {
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return stored ? JSON.parse(stored) : [];
  }

  saveBookings(bookings: Booking[]) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }

  getChatMessages(): ChatMessage[] {
    const stored = localStorage.getItem(STORAGE_KEYS.CHAT);
    return stored ? JSON.parse(stored) : [];
  }

  saveChatMessages(messages: ChatMessage[]) {
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(messages));
  }
}

export const dbService = new MockDBService();