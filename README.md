# 💸 Fleeca Now

A lightweight and intuitive money transfer application, inspired by **Venmo**, built specifically for **FiveM servers** using React and TypeScript. Fleeca Now seamlessly integrates with LB Phone, empowering your players to send and receive money with ease, enhancing in-game financial interactions.

--- 

## ⚙️ Support

- Support is given in the [issues section](https://github.com/Maximus7474/mps-fleecanow/issues) of this github repo.

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
    * *Note:* If you encounter errors, please ensure you are using an up-to-date MariaDB version (v10.11.* or newer is recommended).
3.  **Resource Deployment:**
    * Add the `mps-fleecanow` resource folder to your FiveM server's `resources` directory.
    * Add `ensure mps-fleecanow` to your `server.cfg`.

***

## ⚙️ Configuration

The `config.json` file, located in the `static/` directory, allows you to customize the application's behavior and appearance.

* `Identifier`: A unique ID for the application. It's recommended to **leave this as default** unless you are developing another app with the same identifier.
* `DefaultApp`: A boolean value (`true` or `false`) that determines if the app should be a default application on the phone for all players.
* `AppName`: The name of the application that will be displayed on the phone's home screen.
* `AppDescription`: A short description of the application that appears in the app store. You can customize this to fit your server's roleplay lore.
* `AppDeveloper`: The name of the developer displayed in the app store.
* `MaxDistanceForProximity`: A numeric value that defines the maximum distance for a player to be nearby another player for transactions to be made.
* `VersionCheck`: A boolean value that, enables/disables an automatic version check on script startup.
* `LoggingMethod`: The used method for logging transactions. Your options are:
    * `"none"`: Disables all transaction logging.
    * `"discord"`: Logs transactions to a Discord channel via webhooks.
    * `"fivemanage"`: Integrates with [fivemanage's loggging dk](https://github.com/fivemanage/sdk).
    * `"custom"`: Requires you to configure your own custom logging method.

**To adapt or add locales**, you can modify the `json` files in the `locales/` directory. Each file corresponds to a different language. The **key-value pairs** within these files allow you to change the in-game text for that language.

## 🙏 Credits

* 🎨 **UI Template:** [lb-scripts / lb-phone-app-template](https://github.com/lbphone/lb-phone-app-template)
* ⚙️ **TypeScript Boilerplate:** [Overextended / fivem-typescript-boilerplate](https://github.com/overextended/fivem-typescript-boilerplate)
