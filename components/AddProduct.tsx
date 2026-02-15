
import React, { useState, useRef, useEffect } from 'react';
import { 
  PackagePlus, 
  Tag, 
  DollarSign, 
  FileText, 
  Image as ImageIcon, 
  X, 
  Plus, 
  Save, 
  ShoppingBag,
  Layers,
  CheckCircle2,
  Trash2,
  Edit
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  image: string | null;
}

const AddProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Virtual Items',
    description: '',
    image: null as string | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load products from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('nexus_store_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newProduct: Product = {
        id: `PROD-${Math.floor(1000 + Math.random() * 9000)}`,
        ...formData
      };
      
      const updatedProducts = [newProduct, ...products];
      setProducts(updatedProducts);
      localStorage.setItem('nexus_store_products', JSON.stringify(updatedProducts));

      setFormData({
        name: '',
        price: '',
        category: 'Virtual Items',
        description: '',
        image: null
      });
      setIsSubmitting(false);
      alert("Product added successfully! It is now visible in the Member Basket.");
    }, 1000);
  };

  const removeProduct = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('nexus_store_products', JSON.stringify(updatedProducts));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden sticky top-24">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                <PackagePlus size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">Add Product</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Configure Catalog Item</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                <div className="relative group">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input 
                    required
                    type="text" 
                    placeholder="Enter product title"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (Rs)</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                      required
                      type="number" 
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <div className="relative group">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <select 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all appearance-none cursor-pointer"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option>Virtual Items</option>
                      <option>Packages</option>
                      <option>Gift Cards</option>
                      <option>Memberships</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <textarea 
                    rows={4}
                    placeholder="Describe the product features..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all resize-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Image</label>
                <div className="relative">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  {!formData.image ? (
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-3 px-6 py-6 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:bg-slate-50 hover:border-indigo-300 transition-all group"
                    >
                      <ImageIcon size={24} className="group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-sm">Upload Thumbnail</span>
                    </button>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video group">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 bg-white text-slate-800 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"><Edit size={20} /></button>
                        <button type="button" onClick={() => setFormData({...formData, image: null})} className="p-3 bg-rose-500 text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"><X size={20} /></button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
              >
                {isSubmitting ? <CheckCircle2 className="animate-pulse" /> : <Save size={20} />}
                {isSubmitting ? "Processing..." : "Save Product"}
              </button>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden h-fit">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">Active Catalog</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">{products.length} Items Listed</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {products.length === 0 ? (
                <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center gap-4">
                  <div className="p-8 bg-slate-50 rounded-full text-slate-200">
                    <ShoppingBag size={64} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-400 uppercase tracking-widest">No Products Found</h4>
                    <p className="text-slate-400 text-xs font-medium max-w-[200px] mx-auto mt-1">Start by adding a new product using the form on the left.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map(product => (
                    <div key={product.id} className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 group hover:shadow-xl hover:bg-white transition-all duration-500">
                      <div className="flex gap-5">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-200 border border-slate-100 shrink-0">
                          {product.image ? (
                            <img src={product.image} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <ImageIcon size={32} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-black text-slate-800 truncate uppercase text-sm">{product.name}</h4>
                              <span className="text-[10px] font-black text-indigo-500 uppercase bg-indigo-50 px-2 py-0.5 rounded-full">{product.category}</span>
                            </div>
                            <p className="text-lg font-black text-indigo-600">Rs {product.price}</p>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-3 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">ID: {product.id}</span>
                         <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit size={16} /></button>
                            <button onClick={() => removeProduct(product.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddProduct;
