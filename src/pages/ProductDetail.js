import React from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ComingSoonImg from '../assets/images/coming_soon.png';
import { Button } from '../components/ui';
import { services, hardwareProducts, softwareProducts } from '../data/productsData';

// Reusable data-driven detail page for every product/service.
import ProductDetailTemplate from './products/ProductDetailTemplate';

// Escape hatch for products that ever need a fully bespoke page. Empty today —
// NavIQ (formerly bespoke) is now data-driven via ProductDetailTemplate.
const customProductPages = {};

// Combined lookup of every active product/service by id
const productsById = [...hardwareProducts, ...softwareProducts, ...services].reduce(
    (acc, product) => {
        acc[product.id] = product;
        return acc;
    },
    {}
);

const ProductDetail = () => {
    const { id } = useParams();

    // 1. Bespoke page for this product?
    const CustomPage = customProductPages[id];
    if (CustomPage) {
        return <CustomPage />;
    }

    // 2. Known product/service: render the data-driven template
    const product = productsById[id];
    if (product) {
        return <ProductDetailTemplate product={product} />;
    }

    // 3. Unknown id (e.g. a deferred service): "Coming Soon" fallback
    return (
        <div className="min-h-screen bg-background pt-[var(--header-height)] pb-20 flex flex-col items-center justify-center">
            <SEO title="Product Detail" />
            <div className="text-center px-6">
                <img src={ComingSoonImg} alt="Coming Soon" className="w-28 h-28 mx-auto mb-8 opacity-80" />
                <h1 className="text-h1 font-heading text-white mb-6">Coming Soon</h1>
                <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
                    Detailed specifications and information for this product are currently being updated. Please check back shortly.
                </p>
                <Button to="/products" state={{ keepScroll: true }} variant="secondary" size="lg">
                    ← Back to Products
                </Button>
            </div>
        </div>
    );
};

export default ProductDetail;
