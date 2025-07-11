import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/**
 * VirtualizedMenu Component
 * Implements virtual scrolling for large menu lists to improve performance
 */
const VirtualizedMenu = ({
    items = [],
    itemHeight = 48,
    containerHeight = 400,
    renderItem,
    overscan = 5,
    className = '',
    onScroll,
    ...props
}) => {
    const [scrollTop, setScrollTop] = useState(0);
    const [containerRef, setContainerRef] = useState(null);
    const scrollElementRef = useRef(null);

    // Calculate visible range
    const visibleRange = useMemo(() => {
        const start = Math.floor(scrollTop / itemHeight);
        const visibleCount = Math.ceil(containerHeight / itemHeight);
        const end = start + visibleCount;

        return {
            start: Math.max(0, start - overscan),
            end: Math.min(items.length, end + overscan),
        };
    }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

    // Calculate total height
    const totalHeight = items.length * itemHeight;

    // Get visible items
    const visibleItems = useMemo(() => {
        return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
            ...item,
            index: visibleRange.start + index,
            top: (visibleRange.start + index) * itemHeight,
        }));
    }, [items, visibleRange, itemHeight]);

    // Handle scroll
    const handleScroll = useCallback((e) => {
        const newScrollTop = e.target.scrollTop;
        setScrollTop(newScrollTop);
        
        if (onScroll) {
            onScroll(e);
        }
    }, [onScroll]);

    // Scroll to item
    const scrollToItem = useCallback((index) => {
        if (scrollElementRef.current) {
            const targetScrollTop = index * itemHeight;
            scrollElementRef.current.scrollTop = targetScrollTop;
            setScrollTop(targetScrollTop);
        }
    }, [itemHeight]);

    // Scroll to top
    const scrollToTop = useCallback(() => {
        scrollToItem(0);
    }, [scrollToItem]);

    return (
        <div
            ref={(ref) => {
                setContainerRef(ref);
                scrollElementRef.current = ref;
            }}
            className={`virtualized-menu ${className}`}
            style={{
                height: containerHeight,
                overflow: 'auto',
                position: 'relative',
            }}
            onScroll={handleScroll}
            {...props}
        >
            {/* Total height spacer */}
            <div style={{ height: totalHeight, position: 'relative' }}>
                {/* Visible items */}
                {visibleItems.map((item) => (
                    <div
                        key={item.index}
                        style={{
                            position: 'absolute',
                            top: item.top,
                            left: 0,
                            right: 0,
                            height: itemHeight,
                        }}
                        className="virtualized-menu-item"
                    >
                        {renderItem(item, item.index)}
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * Performance-optimized Menu Item Component
 */
const OptimizedMenuItem = React.memo(({ 
    item, 
    isActive, 
    onClick, 
    renderIcon, 
    renderNotification,
    className = '' 
}) => {
    const handleClick = useCallback(() => {
        if (onClick) {
            onClick(item);
        }
    }, [item, onClick]);

    return (
        <div
            className={`optimized-menu-item ${className} ${isActive ? 'active' : ''}`}
            onClick={handleClick}
            role="menuitem"
            tabIndex={0}
        >
            {renderIcon && (
                <div className="menu-item-icon">
                    {renderIcon(item)}
                </div>
            )}
            
            <div className="menu-item-content">
                <span className="menu-item-title">{item.title}</span>
                {item.subtitle && (
                    <span className="menu-item-subtitle">{item.subtitle}</span>
                )}
            </div>
            
            {renderNotification && (
                <div className="menu-item-notification">
                    {renderNotification(item)}
                </div>
            )}
        </div>
    );
});

/**
 * Performance Monitor Hook
 */
const usePerformanceMonitor = (componentName) => {
    const renderCount = useRef(0);
    const lastRenderTime = useRef(Date.now());

    useEffect(() => {
        renderCount.current += 1;
        const now = Date.now();
        const timeSinceLastRender = now - lastRenderTime.current;
        lastRenderTime.current = now;

        if (process.env.NODE_ENV === 'development') {
            console.log(`${componentName} render #${renderCount.current}, time since last: ${timeSinceLastRender}ms`);
        }
    });

    return {
        renderCount: renderCount.current,
        getStats: () => ({
            renderCount: renderCount.current,
            lastRenderTime: lastRenderTime.current,
        }),
    };
};

/**
 * Debounced Search Hook
 */
const useDebouncedSearch = (searchTerm, delay = 300) => {
    const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [searchTerm, delay]);

    return debouncedTerm;
};

/**
 * Memoized Menu Filter Hook
 */
const useMemoizedMenuFilter = (items, searchTerm, filterFn) => {
    return useMemo(() => {
        if (!searchTerm || !filterFn) {
            return items;
        }
        return items.filter(filterFn);
    }, [items, searchTerm, filterFn]);
};

/**
 * Intersection Observer Hook for Lazy Loading
 */
const useIntersectionObserver = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [element, setElement] = useState(null);

    useEffect(() => {
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
            },
            {
                threshold: 0.1,
                ...options,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [element, options]);

    return [setElement, isIntersecting];
};

/**
 * Performance-optimized Sidebar Menu Component
 */
const PerformantSidebarMenu = ({
    items,
    searchTerm,
    onItemClick,
    virtualScrolling = true,
    itemHeight = 48,
    containerHeight = 400,
    className = '',
}) => {
    // Performance monitoring
    usePerformanceMonitor('PerformantSidebarMenu');

    // Debounced search
    const debouncedSearchTerm = useDebouncedSearch(searchTerm, 200);

    // Memoized filtered items
    const filteredItems = useMemoizedMenuFilter(
        items,
        debouncedSearchTerm,
        useCallback((item) => {
            if (!debouncedSearchTerm) return true;
            return item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        }, [debouncedSearchTerm])
    );

    // Memoized render item function
    const renderItem = useCallback((item, index) => (
        <OptimizedMenuItem
            key={item.id || index}
            item={item}
            onClick={onItemClick}
            renderIcon={(item) => item.icon}
            renderNotification={(item) => item.notification}
        />
    ), [onItemClick]);

    // Use virtual scrolling for large lists
    if (virtualScrolling && filteredItems.length > 50) {
        return (
            <VirtualizedMenu
                items={filteredItems}
                itemHeight={itemHeight}
                containerHeight={containerHeight}
                renderItem={renderItem}
                className={`performant-sidebar-menu ${className}`}
            />
        );
    }

    // Regular rendering for smaller lists
    return (
        <div className={`performant-sidebar-menu ${className}`}>
            {filteredItems.map((item, index) => renderItem(item, index))}
        </div>
    );
};

export {
    VirtualizedMenu,
    OptimizedMenuItem,
    usePerformanceMonitor,
    useDebouncedSearch,
    useMemoizedMenuFilter,
    useIntersectionObserver,
    PerformantSidebarMenu,
};

export default VirtualizedMenu;

/**
 * Performance Optimization Utilities
 */

// Throttle function for scroll events
export const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Debounce function for search inputs
export const debounce = (func, delay) => {
    let timeoutId;
    return function() {
        const args = arguments;
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
};

// Memoization utility
export const memoize = (fn, getKey = (...args) => JSON.stringify(args)) => {
    const cache = new Map();
    return (...args) => {
        const key = getKey(...args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
};

// Performance measurement utility
export const measurePerformance = (name, fn) => {
    return (...args) => {
        const start = performance.now();
        const result = fn(...args);
        const end = performance.now();

        if (process.env.NODE_ENV === 'development') {
            console.log(`${name} took ${end - start} milliseconds`);
        }

        return result;
    };
};

// Lazy loading utility
export const createLazyComponent = (importFn) => {
    return React.lazy(() => {
        return importFn().catch(err => {
            console.error('Error loading component:', err);
            return { default: () => <div>Error loading component</div> };
        });
    });
};

// Memory usage monitor
export const monitorMemoryUsage = () => {
    if (performance.memory) {
        const memory = performance.memory;
        console.log({
            usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
            totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
            jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
        });
    }
};
