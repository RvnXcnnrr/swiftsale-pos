/**
 * Advanced Search Utilities for Sidebar Menu
 * Includes fuzzy search, search history, and keyboard navigation
 */

// Fuzzy search implementation
export class FuzzySearch {
    constructor(options = {}) {
        this.threshold = options.threshold || 0.6;
        this.includeScore = options.includeScore || false;
        this.keys = options.keys || ['title'];
    }

    // Calculate Levenshtein distance
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    // Calculate similarity score
    similarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) {
            return 1.0;
        }
        
        const distance = this.levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    }

    // Search through items
    search(query, items) {
        if (!query || query.trim() === '') {
            return items;
        }

        const results = [];
        const queryLower = query.toLowerCase();

        items.forEach(item => {
            let bestScore = 0;
            let matchedKey = '';

            this.keys.forEach(key => {
                const value = this.getNestedValue(item, key);
                if (value) {
                    const valueLower = value.toLowerCase();
                    
                    // Exact match gets highest score
                    if (valueLower.includes(queryLower)) {
                        bestScore = Math.max(bestScore, 1.0);
                        matchedKey = key;
                    } else {
                        // Fuzzy match
                        const score = this.similarity(queryLower, valueLower);
                        if (score > bestScore) {
                            bestScore = score;
                            matchedKey = key;
                        }
                    }
                }
            });

            if (bestScore >= this.threshold) {
                const result = { item, score: bestScore, matchedKey };
                if (!this.includeScore) {
                    results.push(item);
                } else {
                    results.push(result);
                }
            }
        });

        // Sort by score (highest first)
        if (this.includeScore) {
            results.sort((a, b) => b.score - a.score);
        }

        return results;
    }

    // Get nested object value by key path
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
}

// Search History Manager
export class SearchHistory {
    constructor(maxItems = 10) {
        this.maxItems = maxItems;
        this.storageKey = 'swiftsale-search-history';
        this.history = this.loadHistory();
    }

    // Load history from localStorage
    loadHistory() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading search history:', error);
            return [];
        }
    }

    // Save history to localStorage
    saveHistory() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.history));
        } catch (error) {
            console.error('Error saving search history:', error);
        }
    }

    // Add search term to history
    addSearch(term) {
        if (!term || term.trim() === '') return;

        const trimmedTerm = term.trim();
        
        // Remove if already exists
        this.history = this.history.filter(item => item !== trimmedTerm);
        
        // Add to beginning
        this.history.unshift(trimmedTerm);
        
        // Limit size
        if (this.history.length > this.maxItems) {
            this.history = this.history.slice(0, this.maxItems);
        }
        
        this.saveHistory();
    }

    // Get search history
    getHistory() {
        return [...this.history];
    }

    // Clear history
    clearHistory() {
        this.history = [];
        this.saveHistory();
    }

    // Get suggestions based on current input
    getSuggestions(input) {
        if (!input || input.trim() === '') {
            return this.history.slice(0, 5);
        }

        const inputLower = input.toLowerCase();
        return this.history
            .filter(term => term.toLowerCase().includes(inputLower))
            .slice(0, 5);
    }
}

// Keyboard Navigation Handler
export class KeyboardNavigator {
    constructor(options = {}) {
        this.onSelect = options.onSelect || (() => {});
        this.onEscape = options.onEscape || (() => {});
        this.selectedIndex = -1;
        this.items = [];
    }

    // Set items for navigation
    setItems(items) {
        this.items = items;
        this.selectedIndex = -1;
    }

    // Handle keyboard events
    handleKeyDown(event, items = null) {
        if (items) {
            this.setItems(items);
        }

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.moveDown();
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.moveUp();
                break;
            case 'Enter':
                event.preventDefault();
                this.selectCurrent();
                break;
            case 'Escape':
                event.preventDefault();
                this.onEscape();
                break;
            default:
                break;
        }
    }

    // Move selection down
    moveDown() {
        if (this.items.length === 0) return;
        
        this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
        this.updateHighlight();
    }

    // Move selection up
    moveUp() {
        if (this.items.length === 0) return;
        
        this.selectedIndex = this.selectedIndex <= 0 
            ? this.items.length - 1 
            : this.selectedIndex - 1;
        this.updateHighlight();
    }

    // Select current item
    selectCurrent() {
        if (this.selectedIndex >= 0 && this.selectedIndex < this.items.length) {
            this.onSelect(this.items[this.selectedIndex], this.selectedIndex);
        }
    }

    // Update visual highlight
    updateHighlight() {
        // Remove previous highlights
        document.querySelectorAll('.search-result-highlighted').forEach(el => {
            el.classList.remove('search-result-highlighted');
        });

        // Add highlight to current selection
        const elements = document.querySelectorAll('.search-result-item');
        if (elements[this.selectedIndex]) {
            elements[this.selectedIndex].classList.add('search-result-highlighted');
            elements[this.selectedIndex].scrollIntoView({ 
                block: 'nearest', 
                behavior: 'smooth' 
            });
        }
    }

    // Reset navigation
    reset() {
        this.selectedIndex = -1;
        this.items = [];
        document.querySelectorAll('.search-result-highlighted').forEach(el => {
            el.classList.remove('search-result-highlighted');
        });
    }
}

// Advanced Search Manager - combines all features
export class AdvancedSearchManager {
    constructor(options = {}) {
        this.fuzzySearch = new FuzzySearch({
            threshold: options.threshold || 0.3,
            keys: options.keys || ['title', 'name']
        });
        
        this.searchHistory = new SearchHistory(options.maxHistory || 10);
        
        this.keyboardNavigator = new KeyboardNavigator({
            onSelect: options.onSelect || (() => {}),
            onEscape: options.onEscape || (() => {})
        });
        
        this.debounceDelay = options.debounceDelay || 300;
        this.debounceTimer = null;
    }

    // Perform search with debouncing
    search(query, items, callback) {
        clearTimeout(this.debounceTimer);
        
        this.debounceTimer = setTimeout(() => {
            const results = this.fuzzySearch.search(query, items);
            this.keyboardNavigator.setItems(results);
            
            if (callback) {
                callback(results, query);
            }
        }, this.debounceDelay);
    }

    // Handle search input
    handleSearchInput(query, items, callback) {
        if (query.trim()) {
            this.search(query, items, callback);
        } else {
            this.keyboardNavigator.reset();
            if (callback) {
                callback(items, query);
            }
        }
    }

    // Handle search submission
    handleSearchSubmit(query) {
        if (query.trim()) {
            this.searchHistory.addSearch(query);
        }
    }

    // Get search suggestions
    getSearchSuggestions(input) {
        return this.searchHistory.getSuggestions(input);
    }

    // Handle keyboard navigation
    handleKeyDown(event, items) {
        this.keyboardNavigator.handleKeyDown(event, items);
    }

    // Clear search history
    clearHistory() {
        this.searchHistory.clearHistory();
    }

    // Get search history
    getHistory() {
        return this.searchHistory.getHistory();
    }
}
