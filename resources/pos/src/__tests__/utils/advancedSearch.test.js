/**
 * Unit Tests for Advanced Search Utilities
 */

import {
    FuzzySearch,
    SearchHistory,
    KeyboardNavigator,
    AdvancedSearchManager
} from '../../utils/advancedSearch';

describe('FuzzySearch', () => {
    let fuzzySearch;

    beforeEach(() => {
        fuzzySearch = new FuzzySearch({
            threshold: 0.6,
            keys: ['title', 'name']
        });
    });

    test('should calculate Levenshtein distance correctly', () => {
        expect(fuzzySearch.levenshteinDistance('cat', 'bat')).toBe(1);
        expect(fuzzySearch.levenshteinDistance('hello', 'world')).toBe(4);
        expect(fuzzySearch.levenshteinDistance('same', 'same')).toBe(0);
    });

    test('should calculate similarity score correctly', () => {
        expect(fuzzySearch.similarity('cat', 'cat')).toBe(1.0);
        expect(fuzzySearch.similarity('cat', 'bat')).toBeCloseTo(0.67, 2);
        expect(fuzzySearch.similarity('hello', 'world')).toBeLessThan(0.5);
    });

    test('should search items with exact matches', () => {
        const items = [
            { title: 'Dashboard', name: 'dashboard' },
            { title: 'Products', name: 'products' },
            { title: 'Categories', name: 'categories' }
        ];

        const results = fuzzySearch.search('Dashboard', items);
        expect(results).toHaveLength(1);
        expect(results[0].title).toBe('Dashboard');
    });

    test('should search items with fuzzy matches', () => {
        const items = [
            { title: 'Dashboard', name: 'dashboard' },
            { title: 'Products', name: 'products' }
        ];

        const results = fuzzySearch.search('Dashbord', items); // Typo
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].title).toBe('Dashboard');
    });

    test('should return empty array for no matches', () => {
        const items = [
            { title: 'Dashboard', name: 'dashboard' }
        ];

        const results = fuzzySearch.search('xyz', items);
        expect(results).toHaveLength(0);
    });

    test('should handle nested object properties', () => {
        const items = [
            { user: { profile: { name: 'John Doe' } } }
        ];

        const fuzzySearchNested = new FuzzySearch({
            keys: ['user.profile.name']
        });

        const results = fuzzySearchNested.search('John', items);
        expect(results).toHaveLength(1);
    });
});

describe('SearchHistory', () => {
    let searchHistory;

    beforeEach(() => {
        localStorage.clear();
        searchHistory = new SearchHistory(5); // Max 5 items
    });

    test('should add search terms to history', () => {
        searchHistory.addSearch('dashboard');
        searchHistory.addSearch('products');

        const history = searchHistory.getHistory();
        expect(history).toContain('dashboard');
        expect(history).toContain('products');
        expect(history[0]).toBe('products'); // Most recent first
    });

    test('should not add empty or whitespace-only terms', () => {
        searchHistory.addSearch('');
        searchHistory.addSearch('   ');
        searchHistory.addSearch('valid');

        const history = searchHistory.getHistory();
        expect(history).toHaveLength(1);
        expect(history[0]).toBe('valid');
    });

    test('should remove duplicates and move to front', () => {
        searchHistory.addSearch('dashboard');
        searchHistory.addSearch('products');
        searchHistory.addSearch('dashboard'); // Duplicate

        const history = searchHistory.getHistory();
        expect(history).toHaveLength(2);
        expect(history[0]).toBe('dashboard'); // Moved to front
        expect(history[1]).toBe('products');
    });

    test('should limit history size', () => {
        for (let i = 0; i < 10; i++) {
            searchHistory.addSearch(`term${i}`);
        }

        const history = searchHistory.getHistory();
        expect(history).toHaveLength(5); // Max limit
    });

    test('should provide suggestions based on input', () => {
        searchHistory.addSearch('dashboard');
        searchHistory.addSearch('data-analysis');
        searchHistory.addSearch('products');

        const suggestions = searchHistory.getSuggestions('da');
        expect(suggestions).toContain('dashboard');
        expect(suggestions).toContain('data-analysis');
        expect(suggestions).not.toContain('products');
    });

    test('should persist to localStorage', () => {
        searchHistory.addSearch('test');
        
        // Create new instance to test persistence
        const newSearchHistory = new SearchHistory();
        const history = newSearchHistory.getHistory();
        
        expect(history).toContain('test');
    });

    test('should clear history', () => {
        searchHistory.addSearch('test1');
        searchHistory.addSearch('test2');
        searchHistory.clearHistory();

        const history = searchHistory.getHistory();
        expect(history).toHaveLength(0);
    });
});

describe('KeyboardNavigator', () => {
    let keyboardNavigator;
    let mockOnSelect;
    let mockOnEscape;

    beforeEach(() => {
        mockOnSelect = jest.fn();
        mockOnEscape = jest.fn();
        keyboardNavigator = new KeyboardNavigator({
            onSelect: mockOnSelect,
            onEscape: mockOnEscape
        });

        // Mock DOM methods
        document.querySelectorAll = jest.fn(() => []);
    });

    test('should handle arrow down navigation', () => {
        const items = ['item1', 'item2', 'item3'];
        keyboardNavigator.setItems(items);

        const event = { key: 'ArrowDown', preventDefault: jest.fn() };
        keyboardNavigator.handleKeyDown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(keyboardNavigator.selectedIndex).toBe(0);
    });

    test('should handle arrow up navigation', () => {
        const items = ['item1', 'item2', 'item3'];
        keyboardNavigator.setItems(items);
        keyboardNavigator.selectedIndex = 1;

        const event = { key: 'ArrowUp', preventDefault: jest.fn() };
        keyboardNavigator.handleKeyDown(event);

        expect(keyboardNavigator.selectedIndex).toBe(0);
    });

    test('should wrap around at boundaries', () => {
        const items = ['item1', 'item2', 'item3'];
        keyboardNavigator.setItems(items);

        // Test wrap around at end
        keyboardNavigator.selectedIndex = 2;
        const downEvent = { key: 'ArrowDown', preventDefault: jest.fn() };
        keyboardNavigator.handleKeyDown(downEvent);
        expect(keyboardNavigator.selectedIndex).toBe(0);

        // Test wrap around at beginning
        keyboardNavigator.selectedIndex = 0;
        const upEvent = { key: 'ArrowUp', preventDefault: jest.fn() };
        keyboardNavigator.handleKeyDown(upEvent);
        expect(keyboardNavigator.selectedIndex).toBe(2);
    });

    test('should handle Enter key selection', () => {
        const items = ['item1', 'item2', 'item3'];
        keyboardNavigator.setItems(items);
        keyboardNavigator.selectedIndex = 1;

        const event = { key: 'Enter', preventDefault: jest.fn() };
        keyboardNavigator.handleKeyDown(event);

        expect(mockOnSelect).toHaveBeenCalledWith('item2', 1);
    });

    test('should handle Escape key', () => {
        const event = { key: 'Escape', preventDefault: jest.fn() };
        keyboardNavigator.handleKeyDown(event);

        expect(mockOnEscape).toHaveBeenCalled();
    });

    test('should reset navigation state', () => {
        const items = ['item1', 'item2'];
        keyboardNavigator.setItems(items);
        keyboardNavigator.selectedIndex = 1;

        keyboardNavigator.reset();

        expect(keyboardNavigator.selectedIndex).toBe(-1);
        expect(keyboardNavigator.items).toHaveLength(0);
    });
});

describe('AdvancedSearchManager', () => {
    let searchManager;
    let mockCallback;

    beforeEach(() => {
        localStorage.clear();
        mockCallback = jest.fn();
        searchManager = new AdvancedSearchManager({
            threshold: 0.3,
            keys: ['title'],
            onSelect: jest.fn(),
            onEscape: jest.fn(),
            debounceDelay: 100
        });
    });

    test('should perform debounced search', async () => {
        const items = [
            { title: 'Dashboard' },
            { title: 'Products' }
        ];

        searchManager.search('dash', items, mockCallback);

        // Should not call immediately due to debouncing
        expect(mockCallback).not.toHaveBeenCalled();

        // Wait for debounce delay
        await new Promise(resolve => setTimeout(resolve, 150));

        expect(mockCallback).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({ title: 'Dashboard' })
            ]),
            'dash'
        );
    });

    test('should handle search input changes', () => {
        const items = [{ title: 'Test' }];
        
        // Test with query
        searchManager.handleSearchInput('test', items, mockCallback);
        expect(searchManager.debounceTimer).toBeDefined();

        // Test with empty query
        searchManager.handleSearchInput('', items, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(items, '');
    });

    test('should handle search submission', () => {
        searchManager.handleSearchSubmit('test query');
        
        const history = searchManager.getHistory();
        expect(history).toContain('test query');
    });

    test('should provide search suggestions', () => {
        searchManager.handleSearchSubmit('dashboard');
        searchManager.handleSearchSubmit('data-analysis');

        const suggestions = searchManager.getSearchSuggestions('da');
        expect(suggestions).toContain('dashboard');
        expect(suggestions).toContain('data-analysis');
    });

    test('should clear search history', () => {
        searchManager.handleSearchSubmit('test');
        searchManager.clearHistory();

        const history = searchManager.getHistory();
        expect(history).toHaveLength(0);
    });

    test('should handle keyboard navigation', () => {
        const items = ['item1', 'item2'];
        const event = { key: 'ArrowDown', preventDefault: jest.fn() };

        searchManager.handleKeyDown(event, items);
        
        expect(event.preventDefault).toHaveBeenCalled();
    });
});
