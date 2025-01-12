import React, { useContext, useEffect, useState, useRef } from 'react';
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
      FaChevronRight,
    } from 'react-icons/fa';

    function App() {
      const location = useLocation();
      const navigate = useNavigate();
      const { supabase, session, user, isAdmin, createAdminUser } = useContext(SupabaseContext);
      const [loading, setLoading] = useState(true);
      const [isOrdersOpen, setIsOrdersOpen] = useState(false);
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const [initialized, setInitialized] = useState(false);
      const navigationRef = useRef(false);

      useEffect(() => {
        const initialize = async () => {
          setLoading(true);
          if (!session) {
            if (!navigationRef.current) {
              navigationRef.current = true;
              navigate('/login');
            }
          } else {
            if (user && !isAdmin) {
              if (!navigationRef.current) {
                navigationRef.current = true;
                navigate('/');
              }
            }
          }
          setLoading(false);
          setInitialized(true);
          navigationRef.current = false;
        };
        initialize();
      }, [session, navigate, user, isAdmin]);

      useEffect(() => {
        const createInitialAdmin = async () => {
          if (session && !isAdmin) {
            await createAdminUser();
          }
        };
        if (initialized) {
          createInitialAdmin();
        }
      }, [session, isAdmin, createAdminUser, initialized]);

      if (loading) {
        return <div>Loading...</div>;
      }

      const ProtectedRoute = ({ children }) => {
        if (!session) {
          if (!navigationRef.current) {
            navigationRef.current = true;
            navigate('/login');
          }
          return null;
        }
        navigationRef.current = false;
        return children;
      };

      const toggleOrders = () => {
        setIsOrdersOpen(!isOrdersOpen);
      };

      const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
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
                <li className={`has-submenu ${isOrdersOpen ? 'open' : ''}`}>
                  <div className="menu-item" onClick={toggleOrders}>
                    <FaShoppingCart /> Orders <FaChevronRight className="arrow-icon" />
                  </div>
                  {isOrdersOpen && (
                    <ul className="submenu">
                      <li>
                        <Link to="/orders/new" className={location.pathname === '/orders/new' ? 'active' : ''}>
                          New Order
                        </Link>
                      </li>
                      <li>
                        <Link to="/orders/pending" className={location.pathname === '/orders/pending' ? 'active' : ''}>
                          Pending Orders
                        </Link>
                      </li>
                      <li>
                        <Link to="/orders/all" className={location.pathname === '/orders/all' ? 'active' : ''}>
                          All Orders
                        </Link>
                      </li>
                    </ul>
                  )}
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
                <li className={`has-submenu ${isMenuOpen ? 'open' : ''}`}>
                  <div className="menu-item" onClick={toggleMenu}>
                    <FaUtensils /> Menus <FaChevronRight className="arrow-icon" />
                  </div>
                  {isMenuOpen && (
                    <ul className="submenu">
                      <li>
                        <Link to="/menu" className={location.pathname === '/menu' ? 'active' : ''}>
                          Menu Items
                        </Link>
                      </li>
                    </ul>
                  )}
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
                <li>
                  <Link to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>
                    <FaCog /> Settings
                  </Link>
                </li>
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
                path="/orders/*"
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
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
        </div>
      );
    }

    export default App;
