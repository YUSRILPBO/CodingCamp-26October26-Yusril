# Requirements Document

## Introduction

The Expense & Budget Visualizer is a mobile-friendly, client-side web application that helps users track daily spending. Users record spending transactions through a form, view a scrollable history of those transactions, see a running total balance at the top of the page, and visualize spending distribution by category through a pie chart. The application runs entirely in the browser with no backend server, persists data in Local Storage, and supports custom categories, transaction sorting, and a light/dark theme toggle. It is built with vanilla HTML, CSS, and JavaScript plus the Chart.js library loaded from a CDN, and uses a purple-blue gradient visual identity with white rounded cards.

## Glossary

- **System**: The Expense & Budget Visualizer web application running in the browser
- **User**: The person who operates the application to track spending
- **Transaction**: A spending record consisting of an item name, a numeric amount, and a category
- **Category**: A classification label applied to a Transaction; defaults to Food, Transport, and Fun
- **Total_Balance**: The sum of all Transaction amounts, displayed at the top of the page
- **Pie_Chart**: A Chart.js circular chart visualizing spending distribution by Category
- **Local_Storage**: The browser's persistent key-value storage API used to save application state across page reloads
- **Theme**: The visual appearance mode of the application, either light or dark
- **Sort_Mode**: The ordering applied to the displayed Transaction list (newest first, amount descending, amount ascending, or category alphabetical)

## Requirements

### Requirement 1: Transaction Input Form

**User Story:** As a user, I want to add spending transactions through a form, so that I can record my expenses.

#### Acceptance Criteria

1. THE System SHALL provide a form containing Item Name, Amount, and Category fields.
2. WHEN a User submits the form with all fields filled and a valid Amount greater than 0, THE System SHALL add the Transaction to the Transaction list.
3. WHEN a User submits the form with any empty field, THE System SHALL display an inline error message and reject the submission.
4. WHEN a User submits the form with an Amount of 0 or a negative value, THE System SHALL display an error message indicating the Amount must be greater than 0 and reject the submission.

### Requirement 2: Transaction List

**User Story:** As a user, I want to view and manage my transaction history, so that I can review and remove past expenses.

#### Acceptance Criteria

1. THE System SHALL display a scrollable list of all Transactions showing the item name, formatted Amount, and Category.
2. WHEN the Transaction list is empty, THE System SHALL display an empty-state message.
3. WHEN a User deletes a Transaction, THE System SHALL remove that Transaction from the list.
4. THE System SHALL render user-provided Transaction names and Category labels as plain text to prevent HTML and script injection.

### Requirement 3: Total Balance

**User Story:** As a user, I want to see my total spending balance, so that I can understand my overall expenses.

#### Acceptance Criteria

1. THE System SHALL display the Total_Balance as the sum of all Transaction amounts in a large card at the top of the page.
2. WHEN a Transaction is added or deleted, THE System SHALL update the Total_Balance automatically.
3. THE System SHALL format monetary amounts as Indonesian Rupiah currency using the id-ID locale with zero fraction digits.

### Requirement 4: Spending Chart

**User Story:** As a user, I want a visual breakdown of my spending by category, so that I can see where my money goes.

#### Acceptance Criteria

1. THE System SHALL display a Pie_Chart showing spending distribution by Category using the Chart.js library.
2. WHEN one or more Transactions exist, THE System SHALL aggregate spending totals per Category and render the Pie_Chart with one segment per Category.
3. WHEN no Transactions exist, THE System SHALL hide the Pie_Chart canvas and display an empty-state message.
4. WHEN a Transaction is added or deleted, THE System SHALL update the Pie_Chart automatically.
5. IF the Chart.js library fails to load, THEN THE System SHALL skip chart rendering without affecting the form, Transaction list, and Total_Balance.
6. THE System SHALL display a tooltip showing the formatted currency Amount when a User hovers over a Pie_Chart segment.

### Requirement 5: Custom Categories

**User Story:** As a user, I want to add my own spending categories, so that I can classify Transactions beyond the defaults.

#### Acceptance Criteria

1. THE System SHALL provide an input field and button to add a custom Category.
2. THE System SHALL seed the Category list with Food, Transport, and Fun on first use.
3. WHEN a User submits a non-empty Category name that does not match an existing Category case-insensitively, THE System SHALL append the Category to the Category list, persist it, and update the Category dropdown.
4. WHEN a User submits an empty Category name, THE System SHALL display an error message and not add the Category.
5. WHEN a User submits a Category name that matches an existing Category case-insensitively, THE System SHALL display an error message and not add the Category.

### Requirement 6: Transaction Sorting

**User Story:** As a user, I want to sort my Transactions, so that I can view them in a meaningful order.

#### Acceptance Criteria

1. THE System SHALL provide a sort control offering newest-first, Amount high-to-low, Amount low-to-high, and Category alphabetical order.
2. WHEN a User selects a sort option, THE System SHALL reorder the displayed Transaction list to match the selected Sort_Mode without modifying the stored Transaction order.
3. THE System SHALL default the Sort_Mode to newest first, ordering Transactions by creation timestamp descending.

### Requirement 7: Theme Toggle

**User Story:** As a user, I want to switch between light and dark mode, so that I can use the app comfortably in different lighting.

#### Acceptance Criteria

1. THE System SHALL provide a theme toggle button in the header.
2. WHEN a User clicks the theme toggle, THE System SHALL switch between light and dark Themes.
3. WHEN the Theme changes, THE System SHALL update the Pie_Chart legend text color to match the active Theme.
4. THE System SHALL persist the Theme choice to Local_Storage and restore it on page load.
5. THE System SHALL default to the light Theme when no Theme preference is stored.

### Requirement 8: Data Persistence

**User Story:** As a user, I want my data to persist across page reloads, so that I do not lose my Transactions and settings.

#### Acceptance Criteria

1. THE System SHALL persist Transactions, Categories, Theme, and Sort_Mode to Local_Storage as JSON-encoded strings.
2. WHEN the page loads, THE System SHALL restore Transactions, Categories, Theme, and Sort_Mode from Local_Storage.
3. FOR ALL stored values, saving a value and then loading the same key SHALL produce an equivalent value (round-trip property).
4. IF Local_Storage is unavailable or contains corrupted data, THEN THE System SHALL initialize with default values and continue operating for the current session.
5. WHEN a Local_Storage write fails, THE System SHALL continue operating using in-memory state for the current session.

### Requirement 9: Architecture and Technology Constraints

**User Story:** As a developer, I want a framework-free client-side architecture, so that the application is simple to maintain and deploy.

#### Acceptance Criteria

1. THE System SHALL be implemented using HTML for structure, CSS for styling, and vanilla JavaScript for behavior, without any frontend framework.
2. THE System SHALL consist of exactly one CSS file located in the css directory, exactly one JavaScript file located in the js directory, and an index.html entry point at the project root.
3. THE System SHALL run entirely in the browser without a backend server or network calls beyond the Chart.js CDN.
4. THE System SHALL function in modern browsers including Chrome, Firefox, Edge, and Safari as a standalone web app.

### Requirement 10: Responsive Visual Design

**User Story:** As a user, I want a clean, responsive interface, so that I can use the app on desktop and mobile devices.

#### Acceptance Criteria

1. THE System SHALL display a purple-blue gradient background transitioning from #667eea to #764ba2.
2. THE System SHALL display content in white, rounded cards with soft shadows.
3. WHILE the viewport is wider than 700px, THE System SHALL display the input form and Pie_Chart side by side in two columns.
4. WHILE the viewport is 700px or narrower, THE System SHALL stack all content into a single column.
5. THE System SHALL use #667eea as the primary color for accents, the Total_Balance, and buttons.
6. THE System SHALL maintain a clean, minimal interface with clear visual hierarchy and readable typography.

### Requirement 11: Performance and Simplicity

**User Story:** As a user, I want a fast and simple application, so that I can track expenses without friction.

#### Acceptance Criteria

1. THE System SHALL update the Total_Balance, Transaction list, and Pie_Chart within a single render cycle without page reloads.
2. THE System SHALL operate without requiring build steps, test setup, or complex configuration.
