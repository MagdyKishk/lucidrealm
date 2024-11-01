import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../store/useAuth";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
    const { isAuthenticated, user, isCheckingAuth } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-5 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto px-6 py-4 h-24 flex items-center justify-between w-full">
                <div className="flex justify-between w-full items-center">
                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </button>

                    {/* Navigation Links - Left */}
                    <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-24 md:top-0 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 gap-4 md:gap-8 border-b md:border-b-0 border-gray-100`}>
                        <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 text-sm font-medium">
                            Feed
                        </Link>
                        <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 text-sm font-medium">
                            About
                        </Link>
                        <Link to="/contact" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 text-sm font-medium">
                            Contact
                        </Link>
                        <Link to="/explore" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 text-sm font-medium">
                            Explore
                        </Link>
                        {/* Mobile Auth Links */}
                        <div className="md:hidden flex flex-col gap-4 pt-4 border-t border-gray-100 text-center">
                            {(isAuthenticated && !isCheckingAuth) ? 
                                <Link to={`/profile/${user?._id}`} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg hover:shadow-lg hover:shadow-indigo-100 transition-all duration-200">
                                    <span>{user?.firstName}{" "}{user?.lastName}</span>
                                </Link>
                            : <>
                                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                                    Log in
                                </Link>
                                <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-indigo-100 text-center">
                                    Sign up
                                </Link> 
                            </>}
                        </div>
                    </div>

                    {/* Logo - Center */}
                    <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 group">
                        <img 
                            src={logo} 
                            alt="LucidRealm" 
                            className="w-10 h-10 group-hover:scale-110 transition-all duration-500 hover:shadow-lg hover:shadow-indigo-200 rounded-lg"
                        />
                        <h1 className="text-lg font-display font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent transition-transform duration-300">
                            LucidRealm
                        </h1>
                    </Link>

                    {/* Auth Buttons - Right (Desktop Only) */}
                    <div className="hidden md:flex items-center gap-4">
                        {(isAuthenticated && !isCheckingAuth) ? 
                        <Link to={`/profile/${user?._id}`} className="flex items-center min-w-24 gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg hover:shadow-lg hover:shadow-indigo-100 transition-all duration-200">
                            <span className="hidden sm:inline">{user?.firstName}{" "}{user?.lastName}</span>
                            <span className="sm:hidden">Profile</span>
                        </Link>
                        : <>
                            <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                                Log in
                            </Link>
                            <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-indigo-100">
                                Sign up
                            </Link> 
                        </>}
                    </div>
                </div>
            </div>
        </nav>
    )
}
