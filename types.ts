export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SERVED = 'SERVED',
  CANCELLED = 'CANCELLED'
}

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED'
}

// --- SaaS Modules ---
export enum SaaSModule {
  POS = 'POS', // Core feature
  QR_MENU = 'QR_MENU',
  KITCHEN_DISPLAY = 'KITCHEN_DISPLAY',
  TABLE_BOOKING = 'TABLE_BOOKING',
  LIVE_CHAT = 'LIVE_CHAT',
  LOYALTY = 'LOYALTY', // Wallet/Points
  INVENTORY = 'INVENTORY',
  SUPPLIER_MARKET = 'SUPPLIER_MARKET'
}

export interface Tenant {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  logo?: string;
  activeModules: SaaSModule[];
  subscriptionPlan: 'BASIC' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'SUSPENDED';
}
// --------------------

export interface MenuItem {
  id: string;
  // Default (English)
  name: string;
  description: string;
  // French
  nameFr?: string;
  descriptionFr?: string;
  // Arabic
  nameAr?: string;
  descriptionAr?: string;
  
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  tableId: string | 'takeaway';
  items: CartItem[];
  status: OrderStatus;
  total: number;
  createdAt: number; // timestamp
  customerNote?: string;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  qrCodeUrl?: string; // Generated URL
}

export interface ChatMessage {
  id: string;
  sender: 'client' | 'staff';
  text: string;
  timestamp: number;
  tableId: string;
}

export interface Booking {
  id: string;
  customerName: string;
  tableId: string;
  date: string; // ISO date string
  time: string;
  depositAmount: number;
}

export type Language = 'en' | 'fr' | 'ar';

// Global Store Context Interface
export interface AppContextType {
  // Tenant / SaaS Context
  currentTenant: Tenant | null;
  allTenants: Tenant[];
  switchTenant: (tenantId: string) => void;
  updateTenantModules: (tenantId: string, modules: SaaSModule[]) => void;
  
  // Data Context
  menu: MenuItem[];
  tables: Table[];
  orders: Order[];
  bookings: Booking[];
  chatMessages: ChatMessage[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (item: MenuItem) => void;
  addBooking: (booking: Booking) => void;
  sendChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  refreshData: () => void;
}