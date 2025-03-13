const { app, BrowserWindow, Tray, Menu, Notification } = require('electron');
const path = require('path');

let tray = null;
let mainWindow = null;
let isGameMode = false; // Флаг режима игры

app.whenReady().then(() => {
    createTray();
    createWindow();
    startTimers();
    app.on('window-all-closed', (event) => {
        event.preventDefault(); // Предотвращаем выход
    });
});

function createTray() {
    tray = new Tray(path.join(__dirname, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Открыть', click: () => showWindow() },
        { label: 'Режим игры', type: 'checkbox', checked: isGameMode, click: () => toggleGameMode() }
    ]);
    tray.setToolTip('EyeCare');
    tray.setContextMenu(contextMenu);
}

function toggleGameMode() {
    isGameMode = !isGameMode;
    tray.setContextMenu(Menu.buildFromTemplate([
        { label: 'Открыть', click: () => showWindow() },
        { label: 'Режим игры', type: 'checkbox', checked: isGameMode, click: () => toggleGameMode() }
    ]));
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 500,
        frame: false, // Без рамки
        transparent: false, // Прозрачный фон
        webPreferences: {
            nodeIntegration: true
        },
        show: false, // Окно создается скрытым
    });

    mainWindow.loadFile('index.html');
    mainWindow.on('close', (event) => {
        event.preventDefault(); // Предотвращаем закрытие
        mainWindow.hide(); // Просто скрываем окно
    });
}

function showWindow() {
    if (mainWindow) {
        mainWindow.show();
    }
}

function sendNotification(title, body) {
    if (isGameMode) return; // Не показывать уведомления в режиме игры

    let notificationWindow = new BrowserWindow({
        width: 500,
        height: 500,
        alwaysOnTop: true, // Окно всегда поверх
        frame: false, // Без рамки
        transparent: false, // Прозрачный фон
        skipTaskbar: true, // Не показывать в панели задач
        webPreferences: { nodeIntegration: true }
    });

    notificationWindow.loadURL(`data:text/html,
        <html>
        <head>
            <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; background: rgba(0, 0, 0, 0.8); color: white; border-radius: 10px; overflow: hidden; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                <h3 style="font-size: 24px; margin-bottom: 2px;">${title}</h3>
                <p style="font-size: 16px; margin-bottom: 5px;">${body}</p>
            </div>
        </body>
        </html>`);

    setTimeout(() => {
        if (notificationWindow) notificationWindow.close();
    }, 2500); // Закрытие через 2.5 секунды
}

function startTimers() {
    setInterval(() => {
        // Проверка на режим игры
        if (!isGameMode) {
            sendNotification('Перерыв', 'Пора сделать отдых!');

            // Второе сообщение через 2.5 секунды
            setTimeout(() => {
                sendNotification('Перерыв', 'Пора сделать отдых!');

                setTimeout(() => {
                    sendNotification('Перерыв', 'Пора сделать отдых!');
                }, 3500); // 3.5 секунды
            }, 3500); // 3.5 секунды
        }
    }, 60 * 60 * 1000); // 60 минут

    setInterval(() => {
        // Проверка на режим игры
        if (!isGameMode) {
            sendNotification('Отдых', 'Пора сделать небольшой отдых!');

            // Второе сообщение через 2.5 секунды
            setTimeout(() => {
                sendNotification('Отдых', 'Пора сделать небольшой отдых!');

                setTimeout(() => {
                    sendNotification('Отдых', 'Пора сделать небольшой отдых!');
                }, 3500); // 3.5 секунды
            }, 3500); // 3.5 секунды
        }
    }, 20 * 60 * 1000); // 20 минут
}
