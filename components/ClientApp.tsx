import React, { useState, useEffect } from 'react';
import { MenuItem, CartItem, Order, OrderStatus, ChatMessage, Language } from '../types';
import { ShoppingBag, MessageCircle, X, Send, Plus, Minus, Search, Flame, ChevronLeft, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ClientAppProps {
  tableId: string;
  menu: MenuItem[];
  onPlaceOrder: (items: CartItem[], note: string) => void;
  chatMessages: ChatMessage[];
  onSendMessage: (text: string) => void;
  activeOrder?: Order;
}

export const ClientApp: React.FC<ClientAppProps> = ({ 
  tableId, menu, onPlaceOrder, chatMessages, onSendMessage, activeOrder 
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [note, setNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [lang, setLang] = useState<Language>('en');

  const categories = ['All', ...Array.from(new Set(menu.map(i => i.category)))];

  // Helper to get localized text
  const t = (en: string, fr?: string, ar?: string) => {
    if (lang === 'fr') return fr || en;
    if (lang === 'ar') return ar || en;
    return en;
  };

  const getProductText = (item: MenuItem, field: 'name' | 'description') => {
    if (field === 'name') {
       if (lang === 'fr' && item.nameFr) return item.nameFr;
       if (lang === 'ar' && item.nameAr) return item.nameAr;
       return item.name;
    }
    if (field === 'description') {
       if (lang === 'fr' && item.descriptionFr) return item.descriptionFr;
       if (lang === 'ar' && item.descriptionAr) return item.descriptionAr;
       return item.description;
    }
    return '';
  }

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === itemId) {
        return { ...i, quantity: Math.max(0, i.quantity + delta) };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredMenu = menu.filter(i => {
    const matchesCategory = selectedCategory === 'All' || i.category === selectedCategory;
    const name = getProductText(i, 'name').toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCheckout = () => {
    onPlaceOrder(cart, note);
    setCart([]);
    setNote('');
    setIsCartOpen(false);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatInput);
    setChatInput('');
  };

  const isRTL = lang === 'ar';

  return (
    <div className={`bg-[#121212] min-h-screen text-neutral-100 flex flex-col md:flex-row ${isRTL ? 'font-[Tahoma,sans-serif]' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <div className="p-4 md:p-6 flex items-center justify-between bg-[#1f1f1f] border-b border-neutral-800 safe-top">
           <div className="flex items-center gap-4">
              <Link to="/" className="md:hidden p-2 -mx-2 text-neutral-400"><ChevronLeft className={isRTL ? 'rotate-180' : ''}/></Link>
              <div>
                <h1 className="font-bold text-xl flex items-center gap-2">
                  <Flame className="text-red-500 fill-red-500" size={20} />
                  RestoFlow
                </h1>
                <p className="text-xs text-neutral-500">{t('Table', 'Table', 'طاولة')} {tableId.replace('t-', '')}</p>
              </div>
           </div>
           
           <div className="flex gap-3 items-center">
             <div className="flex bg-[#2d2d2d] rounded-full p-1 border border-neutral-700">
                <button onClick={() => setLang('en')} className={`w-8 h-8 rounded-full text-xs font-bold transition ${lang === 'en' ? 'bg-neutral-600 text-white' : 'text-neutral-500'}`}>EN</button>
                <button onClick={() => setLang('fr')} className={`w-8 h-8 rounded-full text-xs font-bold transition ${lang === 'fr' ? 'bg-blue-600 text-white' : 'text-neutral-500'}`}>FR</button>
                <button onClick={() => setLang('ar')} className={`w-8 h-8 rounded-full text-xs font-bold transition ${lang === 'ar' ? 'bg-green-600 text-white' : 'text-neutral-500'}`}>ع</button>
             </div>

             <button 
                onClick={() => setIsChatOpen(true)}
                className="relative p-3 bg-[#2d2d2d] hover:bg-[#3d3d3d] rounded-full text-white transition"
              >
                <MessageCircle size={20} />
                {chatMessages.length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1f1f1f]"></span>}
              </button>
             <button 
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-3 bg-red-500 hover:bg-red-600 rounded-full text-white transition shadow-lg shadow-red-500/20 md:hidden"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
           </div>
        </div>

        {/* Search & Categories */}
        <div className="p-4 md:p-6 space-y-6 flex-shrink-0">
           <div className="relative">
             <Search className={`absolute top-3.5 text-neutral-500 ${isRTL ? 'right-4' : 'left-4'}`} size={20} />
             <input 
               type="text" 
               placeholder={t('Search food, drinks...', 'Rechercher...', 'ابحث عن طعام ، مشروبات ...')}
               className={`w-full bg-[#1f1f1f] border border-neutral-800 rounded-2xl py-3 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-base text-white focus:ring-2 focus:ring-red-500 outline-none`}
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
             />
           </div>

           <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2">
             {categories.map((cat: string) => (
               <button
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`flex flex-col items-center gap-2 min-w-[70px] transition-all duration-300 group ${
                   selectedCategory === cat ? 'scale-110' : 'opacity-60 hover:opacity-100'
                 }`}
               >
                 <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${
                   selectedCategory === cat 
                   ? 'bg-red-500 border-red-500 shadow-lg shadow-red-500/30' 
                   : 'bg-[#2d2d2d] border-transparent group-hover:border-neutral-600'
                 }`}>
                    <span className={`text-xs font-bold ${selectedCategory === cat ? 'text-white' : 'text-neutral-400'}`}>
                      {cat.substring(0,2).toUpperCase()}
                    </span>
                 </div>
                 <span className={`text-xs font-medium ${selectedCategory === cat ? 'text-white' : 'text-neutral-500'}`}>
                   {cat}
                 </span>
               </button>
             ))}
           </div>
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-32 no-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
             {filteredMenu.map(item => (
               <div key={item.id} className="bg-[#1f1f1f] p-4 rounded-3xl flex flex-row sm:flex-col gap-4 group hover:bg-[#252525] transition border border-transparent hover:border-red-500/20 shadow-sm">
                  <div className="relative w-24 h-24 sm:w-full sm:h-40 rounded-2xl overflow-hidden flex-shrink-0">
                     <img src={item.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col">
                     <h3 className="font-bold text-white mb-1 text-lg">{getProductText(item, 'name')}</h3>
                     <p className="text-xs text-neutral-500 line-clamp-2 mb-3 leading-relaxed">{getProductText(item, 'description')}</p>
                     <div className="mt-auto flex justify-between items-center">
                        <span className="font-bold text-lg text-white">{item.price.toFixed(2)} MAD</span>
                        <button 
                          onClick={() => addToCart(item)}
                          disabled={!item.available}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                            item.available 
                            ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20' 
                            : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                          }`}
                        >
                          <Plus size={20} />
                        </button>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Active Order Status Notification - Floating above everything */}
        {activeOrder && (
           <div className="absolute bottom-6 left-4 right-4 md:left-auto md:right-auto md:bottom-8 md:w-96 bg-[#2d2d2d] border border-red-500/30 p-4 rounded-2xl shadow-2xl flex items-center justify-between z-30 animate-in slide-in-from-bottom-5 fade-in">
              <div>
                 <p className="text-xs text-neutral-400 uppercase font-bold tracking-wider">{t('Order Status', 'Statut de la commande', 'حالة الطلب')}</p>
                 <p className="text-red-500 font-bold flex items-center gap-2">
                   <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                   {activeOrder.status}
                 </p>
              </div>
              <div className="h-10 w-10 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 font-bold text-xs">
                 #{activeOrder.id.slice(-3)}
              </div>
           </div>
        )}
      </div>

      {/* Cart Sidebar (Desktop) / Bottom Sheet (Mobile) */}
      <div className={`
        fixed inset-0 z-50 bg-black/60 md:static md:bg-transparent md:z-auto md:w-96 md:border-l md:border-neutral-800 md:flex md:flex-col
        transition-all duration-300 backdrop-blur-sm md:backdrop-blur-none
        ${isCartOpen ? 'flex opacity-100' : 'hidden md:flex opacity-0 md:opacity-100'}
      `}>
         <div className={`
            bg-[#1f1f1f] w-full md:w-full h-[85vh] md:h-screen mt-auto md:mt-0 rounded-t-3xl md:rounded-none flex flex-col shadow-2xl md:shadow-none
            transform transition-transform duration-300 ${isCartOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
         `}>
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">{t('Current Order', 'Commande', 'الطلب الحالي')}</h2>
                <p className="text-xs text-neutral-500">ID: #{Math.floor(Math.random() * 10000)}</p>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="md:hidden p-2 bg-neutral-800 rounded-full text-white"><X size={18}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
               {cart.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-neutral-500">
                    <ShoppingBag size={48} className="mb-4 opacity-20" />
                    <p>{t('Your cart is empty', 'Votre panier est vide', 'سلة الطلبات فارغة')}</p>
                 </div>
               ) : (
                 cart.map(item => (
                   <div key={item.id} className="flex gap-4 items-center">
                      <img src={item.image} className="w-16 h-16 rounded-xl object-cover bg-neutral-800" />
                      <div className="flex-1">
                         <h4 className="font-bold text-white text-sm">{getProductText(item, 'name')}</h4>
                         <p className="text-xs text-neutral-500">{item.price.toFixed(2)} MAD</p>
                      </div>
                      <div className="flex items-center gap-3 bg-[#2d2d2d] rounded-full px-2 py-1">
                         <button onClick={() => updateQuantity(item.id, -1)} className="p-2 text-white hover:text-red-500"><Minus size={14}/></button>
                         <span className="font-bold text-sm text-white w-4 text-center">{item.quantity}</span>
                         <button onClick={() => updateQuantity(item.id, 1)} className="p-2 text-white hover:text-red-500"><Plus size={14}/></button>
                      </div>
                   </div>
                 ))
               )}

               {cart.length > 0 && (
                <div className="mt-6">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">{t('Notes', 'Notes', 'ملاحظات')}</label>
                  <textarea 
                    className="w-full bg-[#2d2d2d] border border-transparent focus:border-neutral-700 rounded-xl p-3 text-base text-white resize-none" 
                    placeholder={t('Less ice, no spicy...', 'Moins de glaçons, pas épicé...', 'بدون سكر، بدون حار...')}
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="p-6 bg-[#252525] md:bg-[#1f1f1f] border-t border-neutral-800 safe-bottom">
               
               <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-neutral-400 text-sm">
                     <span>{t('Subtotal', 'Sous-total', 'المجموع الفرعي')}</span>
                     <span>{cartTotal.toFixed(2)} MAD</span>
                  </div>
                  <div className="flex justify-between text-neutral-400 text-sm">
                     <span>{t('Tax', 'Taxe', 'ضريبة')} (10%)</span>
                     <span>{(cartTotal * 0.1).toFixed(2)} MAD</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-neutral-700">
                     <span>{t('Total', 'Total', 'المجموع')}</span>
                     <span>{(cartTotal * 1.1).toFixed(2)} MAD</span>
                  </div>
               </div>

               <button 
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
               >
                  {t('Confirm Order', 'Confirmer la commande', 'تأكيد الطلب')}
               </button>
            </div>
         </div>
      </div>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1f1f1f] w-full max-w-md h-[600px] rounded-3xl flex flex-col shadow-2xl border border-neutral-800">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
              <h2 className="font-bold text-white">{t('Chat with Staff', 'Discuter avec le staff', 'تحدث مع النادل')}</h2>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-neutral-800 rounded-full text-white"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.filter(m => m.tableId === tableId).map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    msg.sender === 'client' 
                    ? 'bg-red-500 text-white rounded-br-none shadow-lg shadow-red-500/20' 
                    : 'bg-[#2d2d2d] text-white shadow rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatMessages.filter(m => m.tableId === tableId).length === 0 && (
                 <div className="text-center mt-20 text-neutral-600">
                    <MessageCircle size={48} className="mx-auto mb-4 opacity-20"/>
                    <p>{t('Need something?', 'Besoin de quelque chose?', 'هل تحتاج شيئا؟')}</p>
                 </div>
              )}
            </div>
            <form onSubmit={handleSendChat} className="p-4 border-t border-neutral-800 flex gap-3">
              <input 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder={t('Type a message...', 'Votre message...', 'اكتب رسالتك ...')}
                className="flex-1 bg-[#2d2d2d] border-none rounded-xl px-4 py-3 text-base text-white focus:ring-2 focus:ring-red-500 outline-none"
              />
              <button type="submit" className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20">
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};