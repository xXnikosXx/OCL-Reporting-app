// get input button by id inputBtn
const inputFileBtn = document.getElementById("inputBtn");

// listen for 'click' of input button
inputFileBtn.addEventListener("click", () => {
	// send a message to the main process via IPC that the button was clicked (message: fileSend) within the electronAPI channel.
	window.electronAPI.fileSend();
});

// get run button by id runBtn
const runBtn = document.getElementById("runBtn");

// listen for 'click' of run button.
runBtn.addEventListener("click", () => {
	// send a message to the main process via IPC that the run button was clicked (message; runBtn) within the electronAPI channel.
	window.electronAPI.runBtn();
});
