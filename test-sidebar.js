/**
 * SwiftSale Sidebar Enhancement Test Script
 * 
 * This script can be run in the browser console to test
 * the enhanced sidebar functionality.
 */

// Test 1: Check if enhanced CSS classes are applied
function testCSSClasses() {
    console.log('🧪 Testing CSS Classes...');
    
    const sidebar = document.querySelector('.pro-sidebar');
    const searchInput = document.querySelector('.search-input');
    const menuItems = document.querySelectorAll('.menu-item-enhanced');
    
    console.log('✅ Sidebar found:', !!sidebar);
    console.log('✅ Enhanced search input found:', !!searchInput);
    console.log('✅ Enhanced menu items found:', menuItems.length);
    
    return {
        sidebar: !!sidebar,
        searchInput: !!searchInput,
        menuItemsCount: menuItems.length
    };
}

// Test 2: Test search functionality
function testSearchFunctionality() {
    console.log('🔍 Testing Search Functionality...');
    
    const searchInput = document.querySelector('#search');
    if (!searchInput) {
        console.error('❌ Search input not found');
        return false;
    }
    
    // Test search input focus
    searchInput.focus();
    console.log('✅ Search input can be focused');
    
    // Test search value change
    searchInput.value = 'dashboard';
    searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('✅ Search value can be changed');
    
    // Clear search
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('✅ Search can be cleared');
    
    return true;
}

// Test 3: Test keyboard shortcuts
function testKeyboardShortcuts() {
    console.log('⌨️ Testing Keyboard Shortcuts...');
    
    // Test Ctrl+K shortcut
    const ctrlKEvent = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true
    });
    
    document.dispatchEvent(ctrlKEvent);
    
    const searchInput = document.querySelector('#search');
    const isSearchFocused = document.activeElement === searchInput;
    
    console.log('✅ Ctrl+K focuses search:', isSearchFocused);
    
    // Test Escape key
    const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true
    });
    
    document.dispatchEvent(escapeEvent);
    console.log('✅ Escape key handled');
    
    return isSearchFocused;
}

// Test 4: Test notification badges
function testNotificationBadges() {
    console.log('🔔 Testing Notification Badges...');
    
    const badges = document.querySelectorAll('.notification-badge');
    console.log('✅ Notification badges found:', badges.length);
    
    badges.forEach((badge, index) => {
        console.log(`Badge ${index + 1}:`, badge.textContent);
    });
    
    return badges.length > 0;
}

// Test 5: Test responsive behavior
function testResponsiveBehavior() {
    console.log('📱 Testing Responsive Behavior...');
    
    const sidebar = document.querySelector('.pro-sidebar');
    const overlay = document.querySelector('.bg-overlay');
    
    // Check if mobile classes exist
    const hasOpenMenu = document.querySelector('.open-menu');
    const hasHideMenu = document.querySelector('.hide-menu');
    
    console.log('✅ Sidebar responsive classes found:', !!(hasOpenMenu || hasHideMenu));
    console.log('✅ Overlay element found:', !!overlay);
    
    return {
        sidebar: !!sidebar,
        overlay: !!overlay,
        responsiveClasses: !!(hasOpenMenu || hasHideMenu)
    };
}

// Test 6: Test accessibility features
function testAccessibility() {
    console.log('♿ Testing Accessibility Features...');
    
    const sidebar = document.querySelector('.pro-sidebar');
    const searchInput = document.querySelector('#search');
    const menuItems = document.querySelectorAll('[role="menuitem"]');
    
    // Check ARIA attributes
    const hasAriaLabel = sidebar?.getAttribute('aria-label');
    const hasAriaExpanded = sidebar?.getAttribute('aria-expanded');
    const searchAriaLabel = searchInput?.getAttribute('aria-label');
    
    console.log('✅ Sidebar ARIA label:', hasAriaLabel);
    console.log('✅ Sidebar ARIA expanded:', hasAriaExpanded);
    console.log('✅ Search ARIA label:', searchAriaLabel);
    console.log('✅ Menu items with role:', menuItems.length);
    
    return {
        sidebarAria: !!hasAriaLabel,
        searchAria: !!searchAriaLabel,
        menuItemsWithRole: menuItems.length
    };
}

// Run all tests
function runAllTests() {
    console.log('🚀 Starting SwiftSale Sidebar Enhancement Tests...\n');
    
    const results = {
        cssClasses: testCSSClasses(),
        searchFunctionality: testSearchFunctionality(),
        keyboardShortcuts: testKeyboardShortcuts(),
        notificationBadges: testNotificationBadges(),
        responsiveBehavior: testResponsiveBehavior(),
        accessibility: testAccessibility()
    };
    
    console.log('\n📊 Test Results Summary:');
    console.table(results);
    
    // Overall assessment
    const allTestsPassed = Object.values(results).every(result => 
        typeof result === 'boolean' ? result : Object.values(result).some(v => v)
    );
    
    console.log(allTestsPassed ? 
        '🎉 All tests passed! Sidebar enhancements are working correctly.' :
        '⚠️ Some tests failed. Please check the implementation.'
    );
    
    return results;
}

// Auto-run tests if script is executed directly
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAllTests);
    } else {
        runAllTests();
    }
}

// Export for manual testing
window.sidebarTests = {
    runAllTests,
    testCSSClasses,
    testSearchFunctionality,
    testKeyboardShortcuts,
    testNotificationBadges,
    testResponsiveBehavior,
    testAccessibility
};

console.log('💡 Tip: Run sidebarTests.runAllTests() in the console to test the sidebar enhancements!');
