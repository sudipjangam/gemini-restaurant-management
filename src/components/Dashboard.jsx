import React, { useState, useEffect, useContext } from 'react';
    import { SupabaseContext } from '../context/SupabaseContext';

    function Dashboard() {
      const { supabase, user } = useContext(SupabaseContext);
      const [orders, setOrders] = useState([]);

      useEffect(() => {
        const fetchOrders = async () => {
          try {
            const { data, error } = await supabase
              .from('orders')
              .select('*')
              .eq('restaurant_id', user?.restaurant_id)
              .limit(3);

            if (error) {
              console.error('Error fetching orders:', error);
            } else {
              setOrders(data);
            }
          } catch (error) {
            console.error('Error fetching orders:', error);
          }
        };

        if (user) {
          fetchOrders();
        }
      }, [supabase, user]);

      return (
        <div>
          <div className="dashboard-header">
            <h2>Dashboard</h2>
          </div>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>0</h3>
              <p>Items To Reorder</p>
            </div>
            <div className="dashboard-card">
              <h3>0</h3>
              <p>Upcoming Reservations</p>
            </div>
            <div className="dashboard-card">
              <h3>0</h3>
              <p>Pending KOT</p>
            </div>
            <div className="dashboard-card">
              <h3>₹0</h3>
              <p>Today's Revenue</p>
            </div>
          </div>

          <div>
            <h3>Order Status</h3>
            <table className="order-status-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Order Type</th>
                  <th>Attendant</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.order_type}</td>
                    <td>{order.attendant}</td>
                    <td>{order.time}</td>
                    <td>{order.status}</td>
                    <td>{order.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="quick-links">
            <h3>Quick Links</h3>
            <button>New Order</button>
            <button>Reserve Table</button>
            <button>Add Menu Items</button>
            <button>Add Invoice</button>
            <button>Update Daily Usage</button>
          </div>

          <div className="revenue-expenses">
            <div>
              <h4>Revenue</h4>
              <button>Regenerate</button>
            </div>
            <div>
              <h4>Expenses</h4>
              <button>Regenerate</button>
            </div>
          </div>
        </div>
      );
    }

    export default Dashboard;
