import React, { useEffect, useState } from 'react';
import { Order, OrderStatus } from '../types';
import { CheckCircle, Clock, ChefHat, AlertCircle, ArrowLeft, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';

interface KitchenDisplayProps {
  orders: Order[];
  updateStatus: (id: string, status: OrderStatus) => void;
}

export const KitchenDisplay: React.FC<KitchenDisplayProps> = ({ orders, updateStatus }) => {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Filter out served/cancelled orders for the active view, or keep served for a bit
    setActiveOrders(orders.filter(o => o.status !== OrderStatus.CANCELLED && o.status !== OrderStatus.SERVED).sort((a, b) => a.createdAt - b.createdAt));
  }, [orders]);

  const printReceipt = (order: Order) => {
    const receiptContent = `
      <html>
        <head>
          <title>Order #${order.id.slice(-4)}</title>
          <style>
            body { font-family: 'Courier New', monospace; width: 80mm; margin: 0; padding: 10px; color: black; background: white; }
            .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
            .title { font-size: 1.2em; font-weight: bold; }
            .meta { font-size: 0.9em; margin-bottom: 5px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.9em; }
            .total { border-top: 1px dashed #000; margin-top: 10px; padding-top: 5px; font-weight: bold; text-align: right; }
            .footer { margin-top: 20px; text-align: center; font-size: 0.8em; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">RESTOFLOW</div>
            <div>Order Receipt</div>
          </div>
          <div class="meta">Order #: ${order.id.slice(-4)}</div>
          <div class="meta">Table: ${order.tableId.replace('t-', '')}</div>
          <div class="meta">Date: ${new Date(order.createdAt).toLocaleString()}</div>
          <hr style="border-top: 1px dashed #000;"/>
          
          ${order.items.map(item => `
            <div class="item">
              <span>${item.quantity} x ${item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
          
          <div class="total">
            TOTAL: ${order.total.toFixed(2)} MAD
          </div>
          
          ${order.customerNote ? `<div style="margin-top:10px; font-size: 0.9em;"><strong>Note:</strong> ${order.customerNote}</div>` : ''}
          
          <div class="footer">
            Thank you for visiting!<br/>
            www.restoflow.com
          </div>
        </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    if (iframe.contentWindow) {
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(receiptContent);
        iframe.contentWindow.document.close();
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    }
    
    // Cleanup
    setTimeout(() => {
        document.body.removeChild(iframe);
    }, 1000);
  };

  const handleStatusUpdate = (order: Order, newStatus: OrderStatus) => {
      // Logic: If moving from PENDING to PREPARING (Kitchen Confirmation), print receipt
      if (order.status === OrderStatus.PENDING && newStatus === OrderStatus.PREPARING) {
          printReceipt(order);
      }
      updateStatus(order.id, newStatus);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'border-l-yellow-500 bg-[#2d2d2d]';
      case OrderStatus.PREPARING: return 'border-l-blue-500 bg-[#2d2d2d]';
      case OrderStatus.READY: return 'border-l-green-500 bg-[#2d2d2d]';
      default: return 'border-l-neutral-500 bg-[#2d2d2d]';
    }
  };
  
  const getBadgeColor = (status: OrderStatus) => {
     switch (status) {
      case OrderStatus.PENDING: return 'bg-yellow-500/20 text-yellow-500';
      case OrderStatus.PREPARING: return 'bg-blue-500/20 text-blue-500';
      case OrderStatus.READY: return 'bg-green-500/20 text-green-500';
      default: return 'bg-neutral-700 text-neutral-400';
    }
  }

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    if (current === OrderStatus.PENDING) return OrderStatus.PREPARING;
    if (current === OrderStatus.PREPARING) return OrderStatus.READY;
    if (current === OrderStatus.READY) return OrderStatus.SERVED;
    return null;
  };

  return (
    <div className="p-6 h-full bg-[#121212] min-h-screen text-white overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="p-3 bg-[#1f1f1f] hover:bg-[#2d2d2d] rounded-xl text-neutral-400 hover:text-white border border-neutral-800 transition">
             <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="bg-red-500 p-2 rounded-xl">
               <ChefHat className="w-8 h-8 text-white" />
            </div>
            Kitchen Display System
          </h1>
        </div>
        <div className="hidden md:flex gap-4 bg-[#1f1f1f] p-2 rounded-xl border border-neutral-800">
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 rounded-lg text-yellow-500"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Pending</div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-lg text-blue-500"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Prep</div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-lg text-green-500"><span className="w-2 h-2 rounded-full bg-green-500"></span> Ready</div>
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-neutral-600">
          <CheckCircle className="w-24 h-24 mb-6 opacity-20" />
          <p className="text-2xl font-bold">All caught up!</p>
          <p>No active orders in queue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeOrders.map(order => (
            <div key={order.id} className={`rounded-2xl border-l-[6px] p-5 shadow-lg ${getStatusColor(order.status)} flex flex-col h-full`}>
              <div className="flex justify-between items-start mb-4 border-b border-neutral-700 pb-3">
                <div>
                  <h3 className="text-2xl font-bold text-white">#{order.id.slice(-4)}</h3>
                  <span className="text-sm text-neutral-400">Table: {order.tableId.replace('t-', '')}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getBadgeColor(order.status)}`}>
                    {order.status}
                  </span>
                  <div className="text-xs text-neutral-400 mt-2 flex items-center justify-end gap-1">
                    <Clock size={12} />
                    {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6 flex-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-neutral-200">
                    <span className="font-medium text-lg flex gap-3">
                       <span className="bg-neutral-700 w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold">{item.quantity}</span> 
                       {item.name}
                    </span>
                  </div>
                ))}
              </div>

              {order.customerNote && (
                <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm mb-4 border border-red-500/20 flex gap-2">
                   <AlertCircle size={16} className="shrink-0 mt-0.5" />
                   <span className="italic">"{order.customerNote}"</span>
                </div>
              )}

              <div className="mt-auto pt-2 flex gap-2">
                 <button 
                    onClick={() => printReceipt(order)}
                    className="p-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-xl border border-neutral-700 hover:border-neutral-600 transition"
                    title="Print Receipt"
                 >
                    <Printer size={20} />
                 </button>
                {getNextStatus(order.status) && (
                  <button
                    onClick={() => handleStatusUpdate(order, getNextStatus(order.status)!)}
                    className="flex-1 py-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-bold transition-colors flex justify-center items-center gap-2 border border-neutral-700 hover:border-neutral-600"
                  >
                    Mark as {getNextStatus(order.status)}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};