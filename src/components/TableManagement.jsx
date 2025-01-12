import React, { useState, useEffect, useContext } from 'react';
    import { SupabaseContext } from '../context/SupabaseContext';

    function TableManagement() {
      const { supabase, user } = useContext(SupabaseContext);
      const [kitchenOrders, setKitchenOrders] = useState([]);

      useEffect(() => {
        const fetchKitchenOrders = async () => {
          try {
            const { data, error } = await supabase
              .from('orders')
              .select('*')
              .eq('restaurant_id', user?.restaurant_id);
            if (error) {
              console.error('Error fetching kitchen orders:', error);
            } else {
              setKitchenOrders(data);
            }
          } catch (error) {
            console.error('Error fetching kitchen orders:', error);
          }
        };
        if (user) {
          fetchKitchenOrders();
        }
      }, [supabase, user]);

      return (
        <div className="table-container">
          <h2>All Kitchen Orders</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Staff</th>
                <th>KOT Status</th>
              </tr>
            </thead>
            <tbody>
              {kitchenOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.order_items?.map((item) => item.itemName).join(', ')}</td>
                  <td>{order.order_items?.map((item) => item.quantity).join(', ')}</td>
                  <td>{order.attendant}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    export default TableManagement;
