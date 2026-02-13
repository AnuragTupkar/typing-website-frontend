import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"; // Adjust path if needed
import { Menu, X, LogOut, User } from "lucide-react"; // npm install lucide-react
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Navbar = ({ navItems = [], className }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'auth/logout' });
    navigate('/login');
  };

  return (
    <div className={cn("fixed top-0 inset-x-0 z-50 px-4 py-4", className)}>
      <nav className="max-w-7xl mx-auto flex items-center justify-between bg-white/70 dark:bg-black/70 backdrop-blur-md border border-neutral-200 dark:border-white/10 rounded-full px-6 py-3 shadow-sm">
        {/* Logo */}
        <NavLink to="/">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <div className="h-6 w-6 bg-black dark:bg-white rounded-full" />
          <span>Typing</span>
        </div></NavLink>

        {/* Desktop Links (Center) */}
        <div className="hidden md:flex items-center gap-2 relative">
          {navItems.map((navItem, idx) => (
            <NavLink
              key={navItem.name}
              to={navItem.link}
              className="relative px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <AnimatePresence>
                {hoveredIndex === idx && (
                  <motion.span
                    className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-full -z-10"
                    layoutId="hoverBackground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.15 } }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15, delay: 0.2 },
                    }}
                  />
                )}
              </AnimatePresence>
              {navItem.name}
            </NavLink>
          ))}
        </div>

        {/* Right Side Button */}
        <div className="hidden md:block">
          {token ? (
            <div className="flex items-center gap-4">
               <span className="text-sm font-medium hidden lg:block">Hello, {user?.name || 'User'}</span>
               <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
               >
                 <LogOut className="w-4 h-4" />
                 Logout
               </button>
            </div>
          ) : (
            <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
              <NavLink to="/login">Login</NavLink>
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.link}
                className="text-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
            
            {token ? (
              <button 
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-red-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <button className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold">
                <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>Login</NavLink>
              </button>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
