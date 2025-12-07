import React, { useState } from 'react';
import { MenuItem } from '../types';
import { generateMenuDescription } from '../services/geminiService';
import { MASTER_LIBRARY } from '../services/mockDb';
import { Sparkles, Plus, Edit, Trash, Image as ImageIcon, X, Languages, Download, Check, Search } from 'lucide-react';

interface MenuManagerProps {
  menu: MenuItem[];
  onAdd: (item: MenuItem) => void;
  onUpdate: (item: MenuItem) => void;
}

export const MenuManager: React.FC<MenuManagerProps> = ({ menu, onAdd, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [activeTab, setActiveTab] = useState<'en'|'fr'|'ar'>('en');
  const [currentItem, setCurrentItem] = useState<Partial<MenuItem>>({
    name: '', category: 'Food', price: 0, description: '', available: true,
    nameFr: '', descriptionFr: '', nameAr: '', descriptionAr: ''
  });
  
  // Library State
  const [selectedLibraryItems, setSelectedLibraryItems] = useState<string[]>([]);
  const [librarySearch, setLibrarySearch] = useState('');

  const handleGenerateDescription = async () => {
    // Basic AI generation for English only for now, could be expanded
    if (!currentItem.name || !currentItem.category) return;
    setLoadingAi(true);
    const desc = await generateMenuDescription(currentItem.name, currentItem.category);
    setCurrentItem(prev => ({ ...prev, description: desc }));
    setLoadingAi(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem.name || !currentItem.price) return;

    const newItem: MenuItem = {
      id: currentItem.id || Date.now().toString(),
      name: currentItem.name,
      description: currentItem.description || '',
      nameFr: currentItem.nameFr,
      descriptionFr: currentItem.descriptionFr,
      nameAr: currentItem.nameAr,
      descriptionAr: currentItem.descriptionAr,
      price: Number(currentItem.price),
      category: currentItem.category || 'Food',
      image: currentItem.image || `https://picsum.photos/200/200?random=${Date.now()}`,
      available: currentItem.available ?? true,
    };

    if (currentItem.id) {
      onUpdate(newItem);
    } else {
      onAdd(newItem);
    }
    setIsEditing(false);
    setCurrentItem({ name: '', category: 'Food', price: 0, description: '', available: true, nameFr: '', descriptionFr: '', nameAr: '', descriptionAr: '' });
  };

  const handleImportLibrary = () => {
      const itemsToImport = MASTER_LIBRARY.filter(item => selectedLibraryItems.includes(item.id));
      itemsToImport.forEach(item => {
          // Create a deep copy with a new ID
          const newItem: MenuItem = {
              ...item,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 5)
          };
          onAdd(newItem);
      });
      setIsLibraryOpen(false);
      setSelectedLibraryItems([]);
  };

  const toggleLibrarySelection = (id: string) => {
      setSelectedLibraryItems(prev => 
         prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
  };

  const filteredLibrary = MASTER_LIBRARY.filter(item => 
     item.name.toLowerCase().includes(librarySearch.toLowerCase()) || 
     item.category.toLowerCase().includes(librarySearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-white">Menu Catalogue</h2>
        <div className="flex gap-3 w-full md:w-auto">
            <button
                onClick={() => setIsLibraryOpen(true)}
                className="bg-[#2d2d2d] text-white px-5 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#3d3d3d] transition border border-neutral-700 flex-1 md:flex-none"
            >
                <Download size={20} /> Import from Library
            </button>
            <button
                onClick={() => { setIsEditing(true); setCurrentItem({}); }}
                className="bg-red-500 text-white px-5 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-600 transition shadow-lg shadow-red-500/20 font-bold flex-1 md:flex-none"
            >
                <Plus size={20} /> Add Item
            </button>
        </div>
      </div>

      {/* Library Modal */}
      {isLibraryOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-[#1f1f1f] rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col border border-neutral-800 shadow-2xl">
                  <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                      <div>
                        <h3 className="text-2xl font-bold text-white">Master Item Library</h3>
                        <p className="text-neutral-400 text-sm">Select items to add to your menu</p>
                      </div>
                      <button onClick={() => setIsLibraryOpen(false)} className="p-2 bg-neutral-800 rounded-full text-white hover:bg-neutral-700"><X size={20}/></button>
                  </div>
                  
                  <div className="p-4 border-b border-neutral-800">
                      <div className="bg-[#2d2d2d] rounded-xl flex items-center px-4 py-3 border border-transparent focus-within:border-neutral-600">
                          <Search size={20} className="text-neutral-500 mr-3" />
                          <input 
                            placeholder="Search library..." 
                            className="bg-transparent outline-none text-white w-full"
                            value={librarySearch}
                            onChange={(e) => setLibrarySearch(e.target.value)}
                          />
                      </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredLibrary.map(item => {
                              const isSelected = selectedLibraryItems.includes(item.id);
                              return (
                                  <div 
                                    key={item.id} 
                                    onClick={() => toggleLibrarySelection(item.id)}
                                    className={`relative cursor-pointer rounded-2xl border-2 overflow-hidden transition group ${
                                        isSelected ? 'border-red-500 bg-red-500/5' : 'border-neutral-800 bg-[#252525] hover:border-neutral-600'
                                    }`}
                                  >
                                      <div className="h-32 bg-neutral-800 relative">
                                          <img src={item.image} className="w-full h-full object-cover" />
                                          {isSelected && (
                                              <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center backdrop-blur-[1px]">
                                                  <div className="bg-red-500 rounded-full p-2 text-white shadow-lg">
                                                      <Check size={24} strokeWidth={3} />
                                                  </div>
                                              </div>
                                          )}
                                      </div>
                                      <div className="p-4">
                                          <div className="flex justify-between items-start mb-1">
                                              <h4 className="font-bold text-white">{item.name}</h4>
                                              <span className="text-red-400 font-bold text-sm">{item.price} Dh</span>
                                          </div>
                                          <p className="text-xs text-neutral-500 line-clamp-2">{item.description}</p>
                                          <div className="mt-2 flex gap-1">
                                              <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-1 rounded uppercase">{item.category}</span>
                                          </div>
                                      </div>
                                  </div>
                              )
                          })}
                      </div>
                  </div>

                  <div className="p-6 border-t border-neutral-800 flex justify-between items-center bg-[#1f1f1f] rounded-b-3xl">
                      <div className="text-neutral-400">
                          <span className="text-white font-bold">{selectedLibraryItems.length}</span> items selected
                      </div>
                      <div className="flex gap-3">
                          <button onClick={() => setIsLibraryOpen(false)} className="px-6 py-3 text-neutral-400 hover:text-white font-medium">Cancel</button>
                          <button 
                            onClick={handleImportLibrary}
                            disabled={selectedLibraryItems.length === 0}
                            className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              Import Selected
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Add/Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1f1f1f] rounded-3xl p-6 w-full max-w-lg border border-neutral-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-2xl font-bold text-white">{currentItem.id ? 'Edit Item' : 'New Item'}</h3>
               <button onClick={() => setIsEditing(false)} className="p-2 bg-neutral-800 rounded-full text-white hover:bg-neutral-700"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Common Fields */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Category</label>
                  <select
                    value={currentItem.category || 'Food'}
                    onChange={e => setCurrentItem({ ...currentItem, category: e.target.value })}
                    className="w-full rounded-xl bg-[#2d2d2d] border border-transparent focus:border-red-500 text-white p-3 outline-none transition"
                  >
                    <option value="Food">Food</option>
                    <option value="Coffee">Coffee</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Pastry">Pastry</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Price (MAD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={currentItem.price || ''}
                    onChange={e => setCurrentItem({ ...currentItem, price: parseFloat(e.target.value) })}
                    className="w-full rounded-xl bg-[#2d2d2d] border border-transparent focus:border-red-500 text-white p-3 outline-none transition"
                  />
                </div>
              </div>

              {/* Language Tabs */}
              <div className="bg-[#2d2d2d] p-1 rounded-xl flex gap-1 mt-4">
                {(['en', 'fr', 'ar'] as const).map(lang => (
                   <button
                     key={lang}
                     type="button"
                     onClick={() => setActiveTab(lang)}
                     className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${
                        activeTab === lang ? 'bg-neutral-700 text-white shadow' : 'text-neutral-500 hover:text-neutral-300'
                     }`}
                   >
                     {lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : 'العربية'}
                   </button>
                ))}
              </div>

              {/* English Fields */}
              {activeTab === 'en' && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Name (English)</label>
                    <input
                      type="text"
                      required
                      value={currentItem.name || ''}
                      onChange={e => setCurrentItem({ ...currentItem, name: e.target.value })}
                      className="w-full rounded-xl bg-[#2d2d2d] border border-transparent focus:border-red-500 text-white p-3 outline-none transition"
                      placeholder="e.g. Spicy Burger"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Description (English)</label>
                    <div className="relative">
                      <textarea
                        value={currentItem.description || ''}
                        onChange={e => setCurrentItem({ ...currentItem, description: e.target.value })}
                        className="w-full rounded-xl bg-[#2d2d2d] border border-transparent focus:border-red-500 text-white p-3 outline-none transition h-24 resize-none"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateDescription}
                        disabled={loadingAi || !currentItem.name}
                        className="absolute bottom-3 right-3 text-xs bg-purple-500/20 text-purple-300 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-purple-500/30 transition border border-purple-500/30"
                      >
                        <Sparkles size={12} /> AI
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* French Fields */}
              {activeTab === 'fr' && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Nom (Français)</label>
                    <input
                      type="text"
                      value={currentItem.nameFr || ''}
                      onChange={e => setCurrentItem({ ...currentItem, nameFr: e.target.value })}
                      className="w-full rounded-xl bg-[#2d2d2d] border border-transparent focus:border-blue-500 text-white p-3 outline-none transition"
                      placeholder="e.g. Burger Épicé"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Description (Français)</label>
                    <textarea
                      value={currentItem.descriptionFr || ''}
                      onChange={e => setCurrentItem({ ...currentItem, descriptionFr: e.target.value })}
                      className="w-full rounded-xl bg-[#2d2d2d] border border-transparent focus:border-blue-500 text-white p-3 outline-none transition h-24 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Arabic Fields */}
              {activeTab === 'ar' && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200" dir="rtl">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">الاسم (العربية)</label>
                    <input
                      type="text"
                      value={currentItem.nameAr || ''}
                      onChange={e => setCurrentItem({ ...currentItem, nameAr: e.target.value })}
                      className="w-full rounded-xl bg-[#2d2d2d] border border-transparent focus:border-green-500 text-white p-3 outline-none transition"
                      placeholder="مثال: برغر حار"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">الوصف (العربية)</label>
                    <textarea
                      value={currentItem.descriptionAr || ''}
                      onChange={e => setCurrentItem({ ...currentItem, descriptionAr: e.target.value })}
                      className="w-full rounded-xl bg-[#2d2d2d] border border-transparent focus:border-green-500 text-white p-3 outline-none transition h-24 resize-none"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2 mt-2">
                 <input 
                   type="checkbox" 
                   id="available"
                   checked={currentItem.available} 
                   onChange={e => setCurrentItem({...currentItem, available: e.target.checked})}
                   className="w-5 h-5 rounded border-neutral-600 text-red-600 focus:ring-red-500 bg-[#2d2d2d]"
                 />
                 <label htmlFor="available" className="text-white">Available for order</label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-neutral-800 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 text-neutral-400 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-500/20"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menu.map(item => (
          <div key={item.id} className="bg-[#1f1f1f] border border-neutral-800 rounded-3xl overflow-hidden flex flex-col group hover:border-red-500/50 transition duration-300 shadow-sm">
            <div className="h-48 bg-[#2d2d2d] relative overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              {!item.available && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white font-bold backdrop-blur-sm">
                  SOLD OUT
                </div>
              )}
              <div className="absolute top-3 right-3">
                 <button
                  onClick={() => { setCurrentItem(item); setIsEditing(true); }}
                  className="bg-black/50 hover:bg-red-500 p-2 rounded-full text-white backdrop-blur-md transition"
                >
                  <Edit size={16} />
                </button>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-white">{item.name}</h3>
                <span className="font-bold text-red-500">{item.price.toFixed(2)} MAD</span>
              </div>
              <p className="text-neutral-500 text-sm mb-4 flex-1 line-clamp-2">{item.description}</p>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-xs bg-[#2d2d2d] px-3 py-1 rounded-lg text-neutral-400 font-medium uppercase tracking-wider">{item.category}</span>
                <div className="flex gap-1">
                   {item.nameFr && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">FR</span>}
                   {item.nameAr && <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">AR</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};