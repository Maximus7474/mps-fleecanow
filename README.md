# 💸 Fleeca Now

A lightweight and intuitive money transfer application, inspired by **Venmo**, built specifically for **FiveM servers** using React and TypeScript. Fleeca Now seamlessly integrates with LB Phone, empowering your players to send and receive money with ease, enhancing in-game financial interactions.

---

## ✨ Features

* **Seamless Transfers:** Effortlessly send and receive money between players anonymously.
* **Intuitive UI:** A clean and user-friendly interface powered by React.
* **Robust & Reliable:** Built with TypeScript for enhanced stability and maintainability.
* **LB Phone Integration:** Designed to work flawlessly with the LB Phone resource.

---

## 🚀 Installation Guide

**Important:** This resource **requires LB Phone** to function correctly.

1.  **Dependencies:** Ensure you have `LB-Phone` installed and running on your server.
2.  **Database Setup:** Execute the provided SQL file: `sql/tables.sql`
    * *Note:* If you encounter errors during table creation, please verify that you are using an up-to-date MariaDB version (v10.11.\* or newer is recommended).
3.  **Resource Configuration:**
    * To adapt the configuration on the fly, you can do so by altering the `json` files in the `static/` directory.
    * To adapt/add locales, you can do so by working on the `json` files in the `locales/` directory.
4.  **Resource Deployment:**
    * Add the `mps-fleecanow` resource folder to your FiveM server's `resources` directory.
    * Add `ensure mps-fleecanow` to your `server.cfg`.
---

## 🙏 Credits

* 🎨 **UI Template:** [lb-scripts / lb-phone-app-template](https://github.com/lbphone/lb-phone-app-template)
* ⚙️ **TypeScript Boilerplate:** [Overextended / fivem-typescript-boilerplate](https://github.com/overextended/fivem-typescript-boilerplate)
