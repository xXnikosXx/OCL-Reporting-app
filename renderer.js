// get input button by id inputBtn
const inputFileBtn = document.getElementById("inputBtn");

// listen for 'click' of input button
inputFileBtn.addEventListener("click", async () => {
	document.getElementById("loadingSpinner").classList.add("text-danger");
	document.getElementById("loadingSpinner").classList.remove("text-success");
	document.getElementById("loadingSpinner").classList.remove("text-warning");
	document.getElementById("loadingSpinner").classList.remove("bi");
	document.getElementById("loadingSpinner").classList.remove("bi-check-circle");
	document.getElementById("loadingSpinner").classList.add("spinner-grow");
	document.getElementById("LoadingMSG").innerHTML = "Awaiting input...";
	// send a message to the main process via IPC that the button was clicked (message: fileSend) within the electronAPI channel.
	const fileInfo = await window.electronAPI.openFile();
	document.getElementById("chosenFileP").innerHTML = fileInfo[0];
	if (document.getElementById("chosenDirP").innerHTML === "No direcory chosen.") {
		document.getElementById("chosenDirP").innerHTML = fileInfo[1];
	}
	document.getElementById("runBtn").disabled = false;
});

// get dir btn by id outputDirInput
const dirBtn = document.getElementById("outputDirInput");

// listen for 'click' of choose dir button.
dirBtn.addEventListener("click", async () => {
	// same as above
	const outputPath = await window.electronAPI.chooseOutput();
	document.getElementById("chosenDirP").innerHTML = outputPath;
});

// get run button by id runBtn
const runBtn = document.getElementById("runBtn");

// listen for 'click' of run button.
runBtn.addEventListener("click", () => {
	// send a message to the main process via IPC that the run button was clicked (message; runBtn) within the electronAPI channel.
	window.electronAPI.runBtn();
	document.getElementById("loadingSpinner").classList.remove("text-danger");
	document.getElementById("loadingSpinner").classList.remove("text-success");
	document.getElementById("loadingSpinner").classList.add("text-warning");
	document.getElementById("loadingSpinner").classList.remove("bi");
	document.getElementById("loadingSpinner").classList.remove("bi-check-circle");
	document.getElementById("loadingSpinner").classList.add("spinner-grow");
	document.getElementById("LoadingMSG").innerHTML = "Running...";
});

window.electronAPI.scriptDone(() => {
	document.getElementById("loadingSpinner").classList.remove("spinner-grow");
	document.getElementById("loadingSpinner").classList.remove("text-danger");
	document.getElementById("loadingSpinner").classList.remove("text-warning");
	document.getElementById("loadingSpinner").classList.add("bi");
	document.getElementById("loadingSpinner").classList.add("bi-check-circle");
	document.getElementById("loadingSpinner").classList.add("text-success");
	document.getElementById("loadingSpinner").style.fontSize = "2rem";
	document.getElementById("LoadingMSG").innerHTML = "Complete!";
});

// let i = 1;
// // listen for click of output directory input
// const outputDirInput= document.getElementById("outputDirInput");
// outputDirInput.addEventListener("click", () => {
// 	const test = document.getElementById("console-output");
// 	const p = document.createElement("p");
// 	const node = document.createTextNode(`Output Line ${i}`);
// 	i++;
// 	p.appendChild(node);
// 	test.appendChild(p);
// 	test.scrollTop = test.scrollHeight;
// });
