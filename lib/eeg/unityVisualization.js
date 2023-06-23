const socketIsReady = (socket) => socket.readyState == WebSocket.OPEN

if (IN_VISUALIZATION) {
    if (HAS_INPUT["EEG"]) {
        if (CACHE["unityWebSocket"]) {
            sendData(CACHE["unityWebSocket"], null)
        } else {
            let connectionInfo = { ip: "127.0.0.1", port: 9007 }
            let socket = new WebSocket(`ws://${connectionInfo.ip}:${connectionInfo.port}`);
            socket.onerror = function (error) {
                return;
            };
            CACHE["unityWebSocket"] = socket;
            socket.onopen = () => { sendData(socket, colorScaleSettings()) };
        }
    }
} else {
    if (CACHE["unityWebSocket"]) {
        if (socketIsReady(CACHE["unityWebSocket"])) {
            CACHE["unityWebSocket"].send(`{ "clientDisconnect": true }`);
            CACHE["unityWebSocket"].close();
        }
        CACHE["unityWebSocket"] = null;
    }
}

function sendData(socket, settings) {
    if (socketIsReady(socket)) {
        var data = null
        if (INPUT["EEG"] != null) {
            var eeg_in = INPUT["EEG"];
            var eeg_T = eeg_in.map(x => x[0]);
            var labels_in = INPUT["Labels"];
            var labels_T = labels_in.map(x => x.toLowerCase());
            data = {}
            for (let i = 0; i < labels_T.length; i++) {
                let label = labels_T[i];
                data[label] = eeg_T[i];
            }
        }

        let jsonSettings = (settings != null ? `"settings":${JSON.stringify(settings)}` : ``);
        let jsonData = (data != null ? `"data":${JSON.stringify(data)}` : ``);
        let bothNotNull = (jsonSettings + jsonData).length > Math.max(jsonSettings.length, jsonData.length);
        let resultJson = `{${jsonSettings}${(bothNotNull ? "," : "")}${jsonData}}`;
        socket.send(resultJson);
    };
}

function colorScaleSettings() {
    let settingsValue = SETTINGS_VAL["Color Scale"];
    let values = settingsValue.values;
    let colors = settingsValue.colors.map(function (color) { return hexToRGB(color) });
    return { values: values, colors: colors };
}

function hexToRGB(hex) {
    let r, g, b;
    let length = hex.length - 1
    switch (length) {
        case 4: { }
        case 3: {
            r = parseInt(hex.slice(1, 2), 16),
                g = parseInt(hex.slice(2, 3), 16),
                b = parseInt(hex.slice(3, 4), 16);
            break;
        }
        default: {
            r = parseInt(hex.slice(1, 3), 16),
                g = parseInt(hex.slice(3, 5), 16),
                b = parseInt(hex.slice(5, 7), 16);
            break;
        }
    }
    return { "r": r, "g": g, "b": b };
}