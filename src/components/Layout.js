import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Grain from './ui/Grain';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-background text-text-primary">
            <Grain />
            <Header />
            <main className="flex-grow pt-[var(--header-height)]">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
