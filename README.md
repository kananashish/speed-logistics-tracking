# Speed Logistics — Cargo Tracking Prototype

A responsive web-based logistics management prototype designed to demonstrate how customers and operations teams can track shipments, manage shipment progress, and handle delivery workflows through a simple interface.

> **Note:** This is a front-end prototype using sample data and browser storage. It is not connected to a live logistics backend or real-time GPS tracking system.

## Features

- **Customer Tracking:** Search for a shipment using its tracking ID and view its current status and progress.
- **Operations Management:** Create, search, and manage shipments while advancing them through the shipment lifecycle.
- **Delivery Desk:** Manage delivery assignments, update delivery statuses, and simulate proof of delivery.
- **Shipment Timeline:** Visualize shipment progress across predefined delivery stages.
- **Dark and Light Themes:** Switch between themes for a more comfortable viewing experience.
- **Responsive UI:** Layouts designed for desktop, tablet, and mobile screens.
- **Browser Data Persistence:** Shipment data and theme preferences are stored locally in the browser.

## Screens

The application includes three main sections:

1. **Customer Tracking** — Look up shipments and view their progress.
2. **Operations** — Create and manage shipment records.
3. **Delivery Desk** — Simulate delivery assignment and completion workflows.

## Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser Local Storage

No framework, package manager, or backend server is required to run the prototype.

## Getting Started

### Run locally

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR-USERNAME/speed-logistics-tracking.git
   ```

2. Open the project directory:

   ```bash
   cd speed-logistics-tracking
   ```

3. Open `index.html` in your browser.

Alternatively, use the **Live Server** extension in Visual Studio Code for local development.

### Demo tracking IDs

Use the following sample tracking IDs to explore the application:

- `SL-2026-1042` — Delhi to London
- `SL-2026-1043` — Noida to Mumbai

Shipment records may change as you interact with the prototype.

## Shipment Lifecycle

Shipments move through these predefined stages:

1. Order Accepted
2. Picked Up
3. At Origin Warehouse
4. Ready for Dispatch
5. In Transit
6. At Destination Hub
7. Out for Delivery
8. Delivered

The interface reflects the shipment's current stage and displays its progress through the lifecycle.

## Data Storage

The application uses the browser's `localStorage` to persist prototype data.

This means:

- Data is stored in the current browser on the current device.
- Different users and devices do not automatically share shipment updates.
- Clearing browser storage may remove locally stored prototype data.
- The application does not provide server-side authentication or centralized data management.

Use fictional data for demonstrations. Do not enter confidential or real customer information.

## Deployment

The project can be hosted as a static website on services such as Netlify or GitHub Pages.

For Netlify, upload the project folder containing `index.html` and its associated source files. For GitHub Pages, enable Pages in the repository settings and select the appropriate deployment source.

## Current Limitations

- No live GPS or carrier tracking integration.
- No backend API or centralized database.
- No authentication or role-based access control.
- Delivery updates and proof of delivery are simulated.
- Shipment data is local to the browser.

## Future Improvements

Potential enhancements include:

- Backend API and centralized database integration.
- Secure authentication and role-based permissions.
- Real-time shipment status updates.
- Carrier and GPS integrations.
- Notifications for shipment status changes.
- Actual proof-of-delivery uploads.

## Project Status

**Version:** 3 — UI refinement prototype

This version focuses on the user interface, responsive layouts, and the existing shipment-management workflows. The project is intended for learning, demonstration, and portfolio purposes.

## License

No license has been specified yet. If you want others to reuse or modify this project, consider adding an appropriate open-source license.

---

Built as a logistics tracking and management UI prototype.
