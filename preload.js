// We use preloaders to bridge render processes and Electron's main process.
// It is important to use preloaders, because renderer processes do not have access to node, for security reasons.
// Because preload scripts are sandboxed and do not have access to a full Node environment, we have a 
// Polyfilled require function that only has access to a limited set of API's.
// Again for ecurity reasons, preload scripts only have access to limited electron and node resources:
// Electron resources in preload scripts: Renderer Process Modules
// Node resources in preload scripts: events, timers, url
// Polyfilled globals: Buffer, process, clearImmediate, setImmediate.
// Preload scripts are injected before a web page loads in the renderer.

const { contextBridge, ipcRenderer } = require("electron");

// allow for communication between the main and renderer processes via the electronAPI channel (for sending and receiving the fileSend message).
contextBridge.exposeInMainWorld("electronAPI", {
	openFile: () => ipcRenderer.invoke("dialog:openFile"),
	chooseOutput: () => ipcRenderer.invoke("dialog:chooseDir"),
	runBtn: () => ipcRenderer.send("runButtonClicked"),
	scriptDone: (callback) => ipcRenderer.on("scriptDone", callback),
});