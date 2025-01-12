import React, { useState, useEffect, useContext } from 'react';
    import { SupabaseContext } from '../context/SupabaseContext';
    import { Link, Routes, Route, useLocation } from 'react-router-dom';
    import { format } from 'date-fns';

    function OrderManagement() {
      const location = useLocation();
      return (
        <div>
          <h2>Order Management</h2>
          <ul>
            <li>
              <Link to="/orders/new">New Order</Link>
            </li>
            <li>
              <Link to="/orders/pending">Pending Orders</Link>
            </li>
            <li>
              <Link to="/orders/all">All Orders</Link>
            </li>
          </ul>
          <Routes>
            <Route path="/new" element={<NewOrderForm />} />
            <Route path="/pending" element={<PendingOrders />} />
            <Route path="/all" element={<AllOrders />} />
          </Routes>
        </div>
      );
    }

    function NewOrderForm() {
      const { supabase, user } = useContext(SupabaseContext);
      const [orderType, setOrderType] = useState('Dine In');
      const [table, setTable] = useState('');
      const [time, setTime] = useState(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
      const [orderItems, setOrderItems] = useState([]);
      const [attendant, setAttendant] = useState('');
      const [multiSelect, setMultiSelect] = useState('');
      const [tables, setTables] = useState([]);

      useEffect(() => {
        const fetchTables = async () => {
          try {
            const { data, error } = await supabase
              .from('tables')
              .select('*')
              .eq('restaurant_id', user?.restaurant_id);
            if (error) {
              console.error('Error fetching tables:', error);
            } else {
              setTables(data);
            }
          } catch (error) {
            console.error('Error fetching tables:', error);
          }
        };
        if (user) {
          fetchTables();
        }
      }, [supabase, user]);

      const handleAddItem = () => {
        setOrderItems([...orderItems, { category: '', itemName: '', notes: '', quantity: 1, unitPrice: 0 }]);
      };

      const handleItemChange = (index, field, value) => {
        const updatedItems = [...orderItems];
        updatedItems[index][field] = value;
        setOrderItems(updatedItems);
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const { data, error } = await supabase.from('orders').insert([
            {
              order_type: orderType,
              table: table,
              time: time,
              order_items: orderItems,
              attendant: attendant,
              multi_select: multiSelect,
              restaurant_id: user.restaurant_id,
              status: 'Pending',
            },
          ]);
          if (error) {
            console.error('Error creating order:', error);
          } else {
            console.log('Order created successfully:', data);
            setOrderItems([]);
            setTable('');
            setMultiSelect('');
          }
        } catch (error) {
          console.error('Error creating order:', error);
        }
      };

      const handleReset = () => {
        setOrderType('Dine In');
        setTable('');
        setTime(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
        setOrderItems([]);
        setAttendant('');
        setMultiSelect('');
      };

      return (
        <div className="form-container">
          <h2>New Order</h2>
          <form onSubmit={handleSubmit}>
            <label>Order Type</label>
            <div>
              <input
                type="radio"
                id="dineIn"
                name="orderType"
                value="Dine In"
                checked={orderType === 'Dine In'}
                onChange={(e) => setOrderType(e.target.value)}
              />
              <label htmlFor="dineIn">Dine In</label>
              <input
                type="radio"
                id="takeAway"
                name="orderType"
                value="Take Away"
                checked={orderType === 'Take Away'}
                onChange={(e) => setOrderType(e.target.value)}
              />
              <label htmlFor="takeAway">Take Away</label>
            </div>
            <label>Table</label>
            <select value={table} onChange={(e) => setTable(e.target.value)}>
              <option value="">-Select-</option>
              {tables.map((table) => (
                <option key={table.id} value={table.table_number}>
                  {table.table_number}
                </option>
              ))}
            </select>
            <label>Time</label>
            <input type="text" value={time} onChange={(e) => setTime(e.target.value)} />
            <label>Order Items</label>
            {orderItems.map((item, index) => (
              <div key={index} className="order-item">
                <input
                  type="text"
                  placeholder="Category"
                  value={item.category}
                  onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Item Name"
                  value={item.itemName}
                  onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Notes"
                  value={item.notes}
                  onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="Unit Price"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                />
              </div>
            ))}
            <button type="button" onClick={handleAddItem}>
              + Add New
            </button>
            <label>Attendant</label>
            <input type="text" value={attendant} onChange={(e) => setAttendant(e.target.value)} />
            <label>Multi Select</label>
            <select value={multiSelect} onChange={(e) => setMultiSelect(e.target.value)}>
              <option value="">-Select-</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
            <div className="form-buttons">
              <button type="submit">Submit</button>
              <button type="button" onClick={handleReset}>
                Reset
              </button>
            </div>
          </form>
        </div>
      );
    }

    function PendingOrders() {
      const { supabase, user, subscribeToOrders, removeSubscription } = useContext(SupabaseContext);
      const [pendingOrders, setPendingOrders] = useState([]);

      useEffect(() => {
        if (user) {
          const subscription = subscribeToOrders(
            (newOrders) => {
              setPendingOrders(newOrders.filter((order) => order.status === 'Pending'));
            },
            user.restaurant_id,
            'Pending'
          );
          return () => {
            if (subscription) {
              removeSubscription(subscription);
            }
          };
        }
      }, [supabase, user, subscribeToOrders, removeSubscription]);

      return (
        <div className="table-container">
          <h2>Pending Orders</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Order Type</th>
                <th>Order Items</th>
                <th>Status</th>
                <th>Attendant</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.order_type}</td>
                  <td>{order.order_items?.map((item) => item.itemName).join(', ')}</td>
                  <td>{order.status}</td>
                  <td>{order.attendant}</td>
                  <td>
                    <button>Add Items</button>
                    <button>Move To Billing</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    function AllOrders() {
      const { supabase, user, subscribeToOrders, removeSubscription } = useContext(SupabaseContext);
      const [allOrders, setAllOrders] = useState([]);

      useEffect(() => {
        if (user) {
          const subscription = subscribeToOrders(
            (newOrders) => {
              setAllOrders(newOrders);
            },
            user.restaurant_id
          );
          return () => {
            if (subscription) {
              removeSubscription(subscription);
            }
          };
        }
      }, [supabase, user, subscribeToOrders, removeSubscription]);

      return (
        <div className="table-container">
          <h2>All Orders</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Time</th>
                <th>Net Total</th>
                <th>Status</th>
                <th>Attendant</th>
                <th>Cashier</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.time}</td>
                  <td>{order.price}</td>
                  <td>{order.status}</td>
                  <td>{order.attendant}</td>
                  <td>{order.cashier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    export default OrderManagement;
