import React, { useContext, useEffect, useState } from 'react';
    import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
    import Dashboard from './components/Dashboard';
    import OrderManagement from './components/OrderManagement';
    import TableManagement from './components/TableManagement';
    import RoomsManagement from './components/RoomsManagement';
    import MenuManagement from './components/MenuManagement';
    import StaffManagement from './components/StaffManagement';
    import InventoryManagement from './components/InventoryManagement';
    import SuppliersManagement from './components/SuppliersManagement';
    import Reports from './components/Reports';
    import Billing from './components/Billing';
    import Settings from './components/Settings';
    import Login from './components/Login';
    import { SupabaseContext } from './context/SupabaseContext';
    import {
      FaTh,
      FaShoppingCart,
      FaListAlt,
      FaCalendarAlt,
      FaUtensils,
      FaUsers,
      FaBoxes,
      FaTruck,
      FaChartBar,
      FaFileInvoiceDollar,
      FaCog,
      FaSignInAlt,
    } from 'react-icons/fa';

    function App() {
      const location = useLocation();
      const navigate = useNavigate();
      const { supabase, session, user, isAdmin, createAdminUser } = useContext(SupabaseContext);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const initialize = async () => {
          setLoading(true);
          if (!session) {
            navigate('/login');
          } else {
            if (user && !isAdmin) {
              navigate('/');
            }
          }
          setLoading(false);
        };
        initialize();
      }, [session, navigate, user, isAdmin]);

      useEffect(() => {
        const createInitialAdmin = async () => {
          if (session && !isAdmin) {
            await createAdminUser();
          }
        };
        createInitialAdmin();
      }, [session, isAdmin, createAdminUser]);

      if (loading) {
        return <div>Loading...</div>;
      }

      const ProtectedRoute = ({ children }) => {
        if (!session) {
          return navigate('/login');
        }
        return children;
      };

      const AdminRoute = ({ children }) => {
        if (!session || !isAdmin) {
          return navigate('/');
        }
        return children;
      };

      return (
        <div className="app-container">
          {session && (
            <aside className="sidebar">
              <h2>Restaurants</h2>
              <ul>
                <li>
                  <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                    <FaTh /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>
                    <FaShoppingCart /> Orders
                  </Link>
                </li>
                <li>
                  <Link to="/tables" className={location.pathname === '/tables' ? 'active' : ''}>
                    <FaListAlt /> Kitchen Order Tickets
                  </Link>
                </li>
                <li>
                  <Link to="/rooms" className={location.pathname === '/rooms' ? 'active' : ''}>
                    <FaCalendarAlt /> Reservation
                  </Link>
                </li>
                <li>
                  <Link to="/menu" className={location.pathname === '/menu' ? 'active' : ''}>
                    <FaUtensils /> Menus
                  </Link>
                </li>
                <li>
                  <Link to="/staff" className={location.pathname === '/staff' ? 'active' : ''}>
                    <FaUsers /> Staff
                  </Link>
                </li>
                <li>
                  <Link to="/inventory" className={location.pathname === '/inventory' ? 'active' : ''}>
                    <FaBoxes /> Inventory
                  </Link>
                </li>
                <li>
                  <Link to="/suppliers" className={location.pathname === '/suppliers' ? 'active' : ''}>
                    <FaTruck /> Suppliers
                  </Link>
                </li>
                <li>
                  <Link to="/reports" className={location.pathname === '/reports' ? 'active' : ''}>
                    <FaChartBar /> Reports
                  </Link>
                </li>
                <li>
                  <Link to="/billing" className={location.pathname === '/billing' ? 'active' : ''}>
                    <FaFileInvoiceDollar /> Billing
                  </Link>
                </li>
                <AdminRoute>
                  <li>
                    <Link to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>
                      <FaCog /> Settings
                    </Link>
                  </li>
                </AdminRoute>
              </ul>
            </aside>
          )}

          <main className="content">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrderManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tables"
                element={
                  <ProtectedRoute>
                    <TableManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rooms"
                element={
                  <ProtectedRoute>
                    <RoomsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/menu"
                element={
                  <ProtectedRoute>
                    <MenuManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff"
                element={
                  <ProtectedRoute>
                    <StaffManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute>
                    <InventoryManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/suppliers"
                element={
                  <ProtectedRoute>
                    <SuppliersManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/billing"
                element={
                  <ProtectedRoute>
                    <Billing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <AdminRoute>
                    <Settings />
                  </AdminRoute>
                }
              />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
        </div>
      );
    }

    export default App;
