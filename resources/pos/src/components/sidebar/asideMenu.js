import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
    ProSidebar,
    SidebarHeader,
    SidebarContent,
    MenuItem,
    Menu,
    SubMenu,
} from "react-pro-sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import "react-pro-sidebar/dist/css/styles.css";
import {
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import { useIntl } from "react-intl";
import { Tokens } from "../../constants";
import { ThemeToggle } from "../../contexts/ThemeContext";
import { useSidebarSettings, SidebarSettingsPanel } from "../../contexts/SidebarSettingsContext";
import { AdvancedSearchManager } from "../../utils/advancedSearch";
import { getAnalytics, AnalyticsDashboard } from "../../utils/sidebarAnalytics";
import { useSidebarTranslations, TRANSLATION_KEYS } from "../../utils/sidebarI18n";

const AsideMenu = (props) => {
    const {
        asideConfig,
        frontSetting,
        isResponsiveMenu,
        menuClick,
        menuIconClick,
        isMenuCollapse,
    } = props;

    const location = useLocation();
    const intl = useIntl();
    const { id } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchHistory, setShowSearchHistory] = useState(false);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const updatedLanguage = localStorage.getItem(Tokens.UPDATED_LANGUAGE);

    // Analytics instance
    const analytics = getAnalytics();

    // Internationalization
    const { t } = useSidebarTranslations();

    // Sidebar settings
    const {
        settings,
        addToRecent,
        getAnimationClass,
        getSidebarCSSVars
    } = useSidebarSettings();

    // Advanced search manager
    const [searchManager] = useState(() => new AdvancedSearchManager({
        threshold: 0.3,
        keys: ['title', 'name'],
        onSelect: (item) => {
            // Handle item selection
            if (item.to) {
                addToRecent(item.name);
                setSearchTerm("");
                setShowSearchHistory(false);
            }
        },
        onEscape: () => {
            setSearchTerm("");
            setShowSearchHistory(false);
            setIsSearchFocused(false);
        }
    }));

    // Enhanced menu item renderer with notification support
    const renderMenuIcon = (icon, hasNotification = false, notificationCount = 0) => {
        if (!settings.showIcons) {
            return null;
        }

        return (
            <div className="menu-icon-wrapper">
                {icon}
                {settings.showNotifications && hasNotification && notificationCount > 0 && (
                    <span className="notification-badge">
                        {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                )}
            </div>
        );
    };

    // Handle menu item click to track recent items and analytics
    const handleMenuItemClick = (itemId, itemName, itemPath) => {
        addToRecent(itemId);
        analytics.trackMenuClick(itemId, itemName, itemPath);
    };

    // Check if menu item should show notification (you can customize this logic)
    const getNotificationCount = (menuName) => {
        // Example: Show notifications for specific menu items
        const notifications = {
            'dashboard': 3,
            'sales': 5,
            'products': 2,
        };
        return notifications[menuName] || 0;
    };

    // Enhanced touch gesture handling for mobile
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && isResponsiveMenu) {
            // Close sidebar on left swipe
            menuClick();
        }
        if (isRightSwipe && !isResponsiveMenu && window.innerWidth <= 992) {
            // Open sidebar on right swipe (only if not already open)
            menuClick();
        }
    };

    useEffect(() => {
        updateMenu();
    }, [updatedLanguage]);

    // Enhanced keyboard shortcuts for search
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Ctrl/Cmd + K to focus search
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                event.preventDefault();
                const searchInput = document.getElementById('search');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            // Escape to clear search
            if (event.key === 'Escape' && searchTerm) {
                setSearchTerm("");
                const searchInput = document.getElementById('search');
                if (searchInput) {
                    searchInput.blur();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [searchTerm]);

    // ar MenuHendling
    const updateMenu = () => {
        if (updatedLanguage === "ar") {
            var content = document.getElementsByClassName("pro-arrow-wrapper");
            for (let index = 0; index < content.length; index++) {
                content[index].style.textAlign = "end";
            }
        }
    };

    // Enhanced search handling with advanced features
    const handleSearchChange = (value) => {
        setSearchTerm(value);

        if (value.trim()) {
            setShowSearchHistory(false);

            // Prepare menu items for search
            const searchableItems = prepareSearchableItems(asideConfig);

            // Use advanced search
            searchManager.handleSearchInput(value, searchableItems, (results) => {
                setSearchResults(results);
                // Track search analytics
                analytics.trackSearch(value, results.length);
            });
        } else {
            setSearchResults([]);
            setShowSearchHistory(isSearchFocused);
            setSearchSuggestions(searchManager.getSearchSuggestions(""));
        }
    };

    // Prepare menu items for search
    const prepareSearchableItems = (config) => {
        const items = [];

        config.forEach(item => {
            // Add main item
            items.push({
                ...item,
                searchTitle: intl.formatMessage({ id: item.title }),
                type: 'main'
            });

            // Add sub items
            if (item.newRoute) {
                item.newRoute.forEach(subItem => {
                    items.push({
                        ...subItem,
                        searchTitle: intl.formatMessage({ id: subItem.title }),
                        parent: item,
                        type: 'sub'
                    });
                });
            }
        });

        return items;
    };

    // Get filtered menu based on search
    const getFilteredMenu = () => {
        if (!searchTerm.trim()) {
            return asideConfig;
        }

        // Filter original config based on search results
        const resultIds = searchResults.map(item => item.name || item.title);
        return asideConfig.filter(item => {
            if (resultIds.includes(item.name || item.title)) {
                return true;
            }

            // Check if any sub-items match
            if (item.newRoute) {
                return item.newRoute.some(subItem =>
                    resultIds.includes(subItem.name || subItem.title)
                );
            }

            return false;
        });
    };

    const filteredMenu = getFilteredMenu();

    // side sub-menu handling
    useEffect(() => {
        if (filteredMenu) {
            var element = document.getElementsByClassName("myDIV");
            var content = document.getElementsByClassName("pro-item-content");
            var arrow = document.getElementsByClassName("pro-arrow-wrapper");
            filteredMenu.map((SubMenus) => {
                for (let index = 0; index < element.length; index++) {
                    if (SubMenus.newRoute && searchTerm.length > 0) {
                        element[index].lastChild.classList.remove("closed");
                        element[index].lastChild.style.height = "auto";
                        element[index].classList.add("open");
                        if (updatedLanguage === "ar") {
                            arrow[index].style.textAlign = "end";
                        }
                        // element[index].classList.add("pro-active-sub-search")
                    } else {
                        if (!searchTerm) {
                            element[index].lastChild.classList.add("closed");
                            element[index].classList.remove("open");
                            if (updatedLanguage === "ar") {
                                arrow[index].style.textAlign = "end";
                            }
                            // element[index].classList.remove("pro-active-sub-search")
                        }
                    }
                }
                for (let index = 0; index < content.length; index++) {
                    if (SubMenus.newRoute && searchTerm.length) {
                        const postName =
                            content[index].children[0]?.innerText.toLowerCase();
                        if (postName !== undefined) {
                            if (
                                postName.includes(searchTerm.toLowerCase()) ===
                                    true ||
                                postName === "reports"
                            ) {
                                const hideElement =
                                    content[index].firstChild.parentElement
                                        .parentElement.parentElement;
                                hideElement.classList.remove("notShow");
                                hideElement.classList.add("d-flex");
                            } else {
                                const hideElement =
                                    content[index].firstChild.parentElement
                                        .parentElement.parentElement;
                                hideElement.classList.remove("d-flex");
                                hideElement.classList.add("notShow");
                            }
                        }
                    } else {
                        if (!searchTerm) {
                            const showElement =
                                content[index].parentElement.parentElement;
                            showElement.classList.remove("notShow");
                        }
                    }
                }
            });
        }
    }, [filteredMenu && searchTerm.length]);

    // default open side-menu handling
    useEffect(() => {
        var content = document.getElementsByClassName("pro-item-content");
        var element = document.getElementsByClassName("myDIV");
        for (let index = 0; index < content.length; index++) {
            const hideElementOne =
                content[index].firstChild.parentElement.parentElement
                    .parentElement;
            if (
                hideElementOne.classList.value.includes(
                    "pro-menu-item d-flex flex-column active"
                )
            ) {
                let closedElement =
                    hideElementOne.parentElement.parentElement.parentElement;
                closedElement.classList.add("openMenu");
                let activeElementOne = closedElement.parentElement;
                activeElementOne.classList.add("pro-active-sub");
            }
        }
        for (let index = 0; index < element.length; index++) {
            if (element[index].classList.value.includes("pro-active-sub")) {
                let closeMenu = element[index].firstChild.lastChild.firstChild;
                if (updatedLanguage === "ar") {
                    closeMenu.style.transform = "rotate(-45deg)";
                } else {
                    closeMenu.style.transform = "rotate(45deg)";
                }
                element[index].addEventListener("click", () => {
                    let opneElement = element[index].lastChild;
                    if (
                        opneElement.classList.value.includes(
                            "closed openMenu transitioning"
                        ) ||
                        opneElement.classList.value.includes(
                            "openMenu transitioning closed"
                        ) ||
                        opneElement.classList.value.includes(
                            "transitioning openMenu closed"
                        )
                    ) {
                        opneElement.classList.toggle("closeMenu", "closeMenu");
                        opneElement.classList.toggle("openMenu", "");
                        if (updatedLanguage === "ar") {
                            closeMenu.style.transform = "rotate(45deg)";
                        } else {
                            closeMenu.style.transform = "rotate(-45deg)";
                        }
                    } else {
                        if (updatedLanguage === "ar") {
                            closeMenu.style.transform = "rotate(-45deg)";
                        } else {
                            closeMenu.style.transform = "rotate(45deg)";
                        }
                        opneElement.classList.toggle("closeMenu", "");
                        opneElement.classList.toggle("openMenu", "openMenu");
                        opneElement.classList.add("closed");
                    }
                });
            }
        }
    }, [location.pathname]);

    return (
        <>
            <ProSidebar
                collapsed={isMenuCollapse}
                className={`${
                    isResponsiveMenu === true ? "open-menu" : "hide-menu"
                } aside-menu-container ${getAnimationClass()} ${
                    settings.compactMode ? "sidebar-compact" : ""
                } sidebar-${settings.menuStyle}`}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                role="navigation"
                aria-label="Main navigation"
                aria-expanded={isResponsiveMenu}
                style={getSidebarCSSVars()}
            >
                <SidebarHeader className="aside-menu-container__aside-logo flex-column-auto pb-2 pt-3">
                    <a
                        href="/"
                        className="text-decoration-none sidebar-logo text-gray-900 fs-4"
                        aria-label="Go to homepage"
                    >
                        <div
                            className={`${
                                isMenuCollapse
                                    ? "d-none"
                                    : "image image-mini me-3"
                            }`}
                        >
                            <img
                                src={
                                    frontSetting.value &&
                                    frontSetting.value.logo
                                }
                                className="img-fluid object-fit-contain"
                                alt="profile image"
                            />
                        </div>

                        {isMenuCollapse
                            ? null
                            : frontSetting.value &&
                              frontSetting.value.show_app_name_in_sidebar ===
                                  "1"
                            ? frontSetting.value.company_name
                            : ""}
                    </a>
                    <button
                        type="button"
                        onClick={(e) => menuIconClick(e)}
                        className="btn p-0 fs-1 aside-menu-container__aside-menubar d-lg-block d-none sidebar-btn border-0"
                        aria-label={isMenuCollapse ? "Expand sidebar" : "Collapse sidebar"}
                        aria-expanded={!isMenuCollapse}
                        title={isMenuCollapse ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <FontAwesomeIcon
                            icon={faBars}
                            className="text-gray-600"
                            aria-hidden="true"
                        />
                    </button>
                </SidebarHeader>

                {/* Theme Toggle, Settings, and Analytics */}
                {!isMenuCollapse && (
                    <div className="px-3 py-2">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <ThemeToggle />
                            <div className="d-flex gap-1">
                                <button
                                    onClick={() => setIsAnalyticsOpen(true)}
                                    className="btn btn-sm p-2"
                                    aria-label="View analytics"
                                    title="View analytics"
                                >
                                    📊
                                </button>
                                <button
                                    onClick={() => setIsSettingsOpen(true)}
                                    className="btn btn-sm p-2"
                                    aria-label="Sidebar settings"
                                    title="Sidebar settings"
                                >
                                    ⚙️
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <SidebarContent className="sidebar-scrolling">
                    <div
                        className={`aside-search-enhanced ${
                            isMenuCollapse ? "d-none" : ""
                        } ${isSearchFocused ? "search-focused" : ""}`}
                    >
                        <div className="position-relative">
                            <input
                                className="search-input"
                                type="search"
                                id="search"
                                placeholder={t(TRANSLATION_KEYS.SEARCH.PLACEHOLDER)}
                                aria-label={t(TRANSLATION_KEYS.SEARCH.PLACEHOLDER)}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                onFocus={() => {
                                    setIsSearchFocused(true);
                                    if (!searchTerm.trim()) {
                                        setShowSearchHistory(true);
                                        setSearchSuggestions(searchManager.getSearchSuggestions(""));
                                    }
                                }}
                                onBlur={() => {
                                    // Delay to allow clicking on suggestions
                                    setTimeout(() => {
                                        setIsSearchFocused(false);
                                        setShowSearchHistory(false);
                                    }, 200);
                                }}
                                onKeyDown={(e) => {
                                    if (showSearchHistory && searchSuggestions.length > 0) {
                                        searchManager.handleKeyDown(e, searchSuggestions);
                                    } else if (searchResults.length > 0) {
                                        searchManager.handleKeyDown(e, searchResults);
                                    }
                                }}
                                value={searchTerm}
                                autoComplete="off"
                            />
                            <span className={`search-icon ${isSearchFocused ? "focused" : ""}`} aria-hidden="true">
                                <FontAwesomeIcon icon={faSearch} />
                            </span>
                            {searchTerm && (
                                <button
                                    className="search-clear"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSearchResults([]);
                                        setShowSearchHistory(false);
                                    }}
                                    aria-label={t(TRANSLATION_KEYS.SEARCH.CLEAR)}
                                    type="button"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        {/* Search History/Suggestions */}
                        {showSearchHistory && searchSuggestions.length > 0 && (
                            <div className="search-suggestions">
                                <div className="search-suggestions-header">{t(TRANSLATION_KEYS.SEARCH.RECENT_SEARCHES)}</div>
                                {searchSuggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="search-suggestion-item search-result-item"
                                        onClick={() => {
                                            setSearchTerm(suggestion);
                                            handleSearchChange(suggestion);
                                            setShowSearchHistory(false);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faSearch} className="suggestion-icon" />
                                        {suggestion}
                                    </div>
                                ))}
                                <button
                                    className="clear-history-btn"
                                    onClick={() => {
                                        searchManager.clearHistory();
                                        setSearchSuggestions([]);
                                    }}
                                >
                                    {t(TRANSLATION_KEYS.SEARCH.CLEAR_HISTORY)}
                                </button>
                            </div>
                        )}

                        {/* Search Results Info */}
                        {searchTerm && (
                            <div className="search-results-info">
                                {filteredMenu.length} result{filteredMenu.length !== 1 ? 's' : ''} found
                                {searchResults.length > 0 && (
                                    <span className="search-type-info"> • Fuzzy search</span>
                                )}
                            </div>
                        )}
                    </div>
                    <Menu role="menubar" aria-label="Navigation menu">
                        {filteredMenu.length ? (
                            filteredMenu.map((mainItems, index) => {
                                const notificationCount = getNotificationCount(mainItems.name);
                                return mainItems.newRoute ? (
                                    <SubMenu
                                        key={index}
                                        title={
                                            <div className="d-flex align-items-center justify-content-between w-100">
                                                <span>{intl.formatMessage({
                                                    id: `${mainItems.title}`,
                                                })}</span>
                                                {notificationCount > 0 && (
                                                    <span className="notification-badge">
                                                        {notificationCount > 99 ? '99+' : notificationCount}
                                                    </span>
                                                )}
                                            </div>
                                        }
                                        className={
                                            location.pathname ===
                                                mainItems?.subPath
                                                    ?.userSubPath ||
                                            location.pathname ===
                                                mainItems?.subPath
                                                    ?.customerSubPath ||
                                            location.pathname ===
                                                mainItems?.subPath
                                                    ?.suppliareSubPath ||
                                            location.pathname ===
                                                mainItems?.subPath
                                                    ?.productsSubPath ||
                                            location.pathname ===
                                                mainItems?.subPath
                                                    ?.categoriesSubPath ||
                                            location.pathname ===
                                                mainItems?.subPath
                                                    ?.brandsSubPath ||
                                            location.pathname ===
                                                mainItems?.subPath
                                                    ?.unitsSubPath ||
                                            location.pathname ===
                                                mainItems?.subPath
                                                    ?.baseUnitsSubPath ||
                                            location.pathname ===
                                                mainItems?.subPath
                                                    ?.barcodeSubPath ||
                                            location.pathname ===
                                                mainItems?.subPath
                                                    ?.purchasesSubPath ||
                                            location.pathname ===
                                                mainItems?.subPath
                                                    ?.purchaseReturnSubPath ||
                                            location.pathname ===
                                                mainItems?.subPath
                                                    ?.salesSubPath ||
                                            location.pathname ===
                                                mainItems?.subPath
                                                    ?.salesReturnSubPath ||
                                            location.pathname ===
                                                mainItems?.subPath
                                                    ?.expensesSubPath ||
                                            location.pathname ===
                                                mainItems?.subPath
                                                    ?.expenseCategoriesSubPath ||
                                            location.pathname ===
                                                mainItems?.subPath
                                                    ?.emailTemplateSubPath ||
                                            location.pathname ===
                                                mainItems?.subPath
                                                    ?.smsTemplateSubPath ||
                                            location.pathname ===
                                                mainItems?.subPath
                                                    ?.smsApiSubPath
                                                ? "pro-active-sub myDIV menu-item-enhanced"
                                                : "myDIV menu-item-enhanced"
                                        }
                                        icon={renderMenuIcon(mainItems.fontIcon, notificationCount > 0, notificationCount)}
                                        role="menuitem"
                                        aria-haspopup="true"
                                        aria-expanded={location.pathname.includes(mainItems.to)}
                                    >
                                        {mainItems.newRoute.map(
                                            (subMainItems, index) => {
                                                // subPath.push(subMainItems.to)
                                                return (
                                                    <MenuItem
                                                        key={index}
                                                        icon={renderMenuIcon(subMainItems.fontIcon)}
                                                        className={`${
                                                            isMenuCollapse ===
                                                            false
                                                                ? subMainItems.class
                                                                : ""
                                                        } flex-column menu-item-enhanced`}
                                                        role="menuitem"
                                                        active={
                                                            location.pathname ===
                                                                subMainItems.to ||
                                                            location.pathname ===
                                                                subMainItems.path ||
                                                            location.pathname.includes(
                                                                subMainItems.to
                                                            ) ||
                                                            location.pathname ===
                                                                subMainItems.stockPath ||
                                                            location.pathname ===
                                                                subMainItems.productPath ||
                                                            location.pathname ===
                                                                subMainItems.purchasePath ||
                                                            location.pathname ===
                                                                subMainItems.topSellingPath ||
                                                            location.pathname ===
                                                                subMainItems.productQuantityAlertPath ||
                                                            location.pathname ===
                                                                subMainItems.stockDetailPath +
                                                                    "/" +
                                                                    id
                                                        }
                                                    >
                                                        <Link
                                                            to={subMainItems.to}
                                                            className="menu-text"
                                                        >
                                                            {intl.formatMessage(
                                                                {
                                                                    id: `${subMainItems.title}`,
                                                                }
                                                            )}
                                                        </Link>
                                                    </MenuItem>
                                                );
                                            }
                                        )}
                                    </SubMenu>
                                ) : (
                                    mainItems.to !== "/app/pos" && (
                                        <MenuItem
                                            key={index}
                                            icon={renderMenuIcon(mainItems.fontIcon, getNotificationCount(mainItems.name) > 0, getNotificationCount(mainItems.name))}
                                            className={`${
                                                isMenuCollapse === false
                                                    ? mainItems.class
                                                    : ""
                                            } flex-column menu-item-enhanced`}
                                            role="menuitem"
                                            active={
                                                location.pathname ===
                                                    mainItems.to ||
                                                location.pathname ===
                                                    mainItems.path ||
                                                location.pathname ===
                                                    mainItems.mailSettingsPath ||
                                                location.pathname ===
                                                    mainItems.prefixesPath ||
                                                location.pathname ===
                                                    mainItems.profitLossReportPath ||
                                                location.pathname.includes(
                                                    mainItems.to
                                                ) ||
                                                location.pathname ===
                                                    mainItems.stockPath ||
                                                location.pathname ===
                                                    mainItems.productPath ||
                                                location.pathname ===
                                                    mainItems.purchasePath ||
                                                location.pathname ===
                                                    mainItems.topSellingPath ||
                                                location.pathname ===
                                                    mainItems.productQuantityAlertPath ||
                                                location.pathname ===
                                                    mainItems.supplierReportPath ||
                                                location.pathname ===
                                                    mainItems.customerReportPath ||
                                                location.pathname ===
                                                    mainItems.bestCustomerReportPath ||
                                                location.pathname ===
                                                    mainItems.registerReportPath ||
                                                location.pathname ===
                                                    mainItems.supplierReportDetailsPath +
                                                        "/" +
                                                        id ||
                                                location.pathname ===
                                                    mainItems.customerReportDetailsPath +
                                                        "/" +
                                                        id
                                            }
                                        >
                                            <Link to={mainItems.to} className="menu-text">
                                                <span className="d-flex align-items-center justify-content-between w-100">
                                                    <span>{intl.formatMessage({
                                                        id: `${mainItems.title}`,
                                                    })}</span>
                                                    {getNotificationCount(mainItems.name) > 0 && (
                                                        <span className="notification-badge">
                                                            {getNotificationCount(mainItems.name) > 99 ? '99+' : getNotificationCount(mainItems.name)}
                                                        </span>
                                                    )}
                                                </span>
                                            </Link>
                                        </MenuItem>
                                    )
                                );
                            })
                        ) : (
                            <div className="text-center">
                                {getFormattedMessage("side-menu.empty.message")}
                            </div>
                        )}
                    </Menu>
                </SidebarContent>
            </ProSidebar>

            <div
                className={`${
                    isResponsiveMenu === true && "bg-overlay d-block"
                }`}
                onClick={menuClick}
            />

            {/* Sidebar Settings Panel */}
            <SidebarSettingsPanel
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />

            {/* Analytics Dashboard */}
            <AnalyticsDashboard
                isOpen={isAnalyticsOpen}
                onClose={() => setIsAnalyticsOpen(false)}
            />
        </>
    );
};

export default AsideMenu;
