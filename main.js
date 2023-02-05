// Importing Modules (CommonJS module syntax)
// Import and call the update-electron-app module to auto-check for OTA updates of the app on startup.
require("update-electron-app")();
// The app module controls the app's event lifecysles.
// BrowserWindow creates and manages app windows.
// ipcMain is Electron's main-process handle listener for Inter-Process Communication (IPC).
// dialog is Electron's main-process module for displaying native system dialogs for opening and saving files, alerting etc.
// path is Node's path module, to allow you to read / navigate and manipulate file structures (paths / directories).
// fs is Node's file system module, to alow us to navigate the user's file system.
// ExcelJS is the tool we're using for reading, manipulating and writing .xlsx files.
// log is the function we're using to prettify printing to the console (main process only) via ALS.
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const FS = require("fs");
const ExcelJS = require("exceljs");
const log = require("./advancedLoggingSystem");

// variable for input file path initialization
let fileInputPath = "";

// Writing a reusable function to instantiate windows
// The createWindow() function loads your web page into a new BrowserWindow instance
const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		// attach the preload script to the renderer process by passing in it's path.
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	win.loadFile("index.html");
};

// Function that runs app's main code from the main process - script to read, manipulate and create new files for OCL reporting.
function fileInput() {
	// Following code only works for Windows Operating Systems, meaning that app ONLY works for Windows OS.
	if (process.platform === "win32") {
		// open a "Choose File" dialog which only allows the user to choose .xlsx files.
		dialog.showOpenDialog({
			properties: ["openFile"],
			filters: [
				{ name: "Excel Documents", extensions: ["xlsx"] },
			]
		})
		// Then, take the collected file and:
		// a) log it to the console (to make sure that promise is properly resolved)
		// b) 
			.then(files => {
				console.log(files.filePaths[0]);
				fileInputPath = files.filePaths[0];
			});
	}
}

// Calling a function to create a window when the app is ready.
app.whenReady().then(() => {
	createWindow();

	// Open a window if none are open (macOS)
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});

	// listen for click of input file button to know when to call the above function and open a choose file dialog.
	ipcMain.on("fileReceived", fileInput);
	// listen for click of run button to know when to call the bottom function to run the base code of the app.
	ipcMain.on("runButtonClicked", mainApp);
});

// Quit the app when all windows are closed (Windows & Linux)
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

// Basic Config:
// Constants and Variables declarations:

// a prefilled array holding all the different job positions - case sensitive
const Positions = [
	"Hostess",
	"FOH",
	"MOH",
	"BOH",
	"Coach",
	"Manager"
];

// a variable array to hold the names of all stores that participated in the OCL's.
let Stores = [];

//
// TODO: Move to config.json!
// *: Col Letter array per job position.
const HostessArr = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T"
];
const HostessCheckList = [
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P"
];
const FOHArr = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
	"AA",
	"AB",
	"AC",
	"AD",
	"AE",
	"AF",
	"AG",
	"AH",
	"AI",
	"AJ",
	"AK",
	"AL",
	"AM",
	"AN",
	"AO",
	"AP",
	"AQ",
	"AR",
	"AS",
	"AT",
	"AU",
	"AV",
	"AW",
	"AX",
	"AY",
	"AZ",
	"BA",
	"BB",
	"BC",
	"BD",
	"BE"
];
const MOHArr = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"G",
	"BF",
	"BG",
	"BH",
	"BI",
	"BJ",
	"BK",
	"BL",
	"BM",
	"BN",
	"BO",
	"BP",
	"BQ",
	"BR",
	"BS",
	"BT",
	"BU",
	"BV",
	"BW",
	"BX",
	"BY",
	"BZ",
	"CA",
	"CB",
	"CC"
];
const BOHArr = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"H",
	"CD",
	"CE",
	"CF",
	"CG",
	"CH",
	"CI",
	"CJ",
	"CK",
	"CL",
	"CM",
	"CN",
	"CO",
	"CP",
	"CQ",
	"CR",
	"CS",
	"CT",
	"CU",
	"CV",
	"CW",
	"CX",
	"CY",
	"CZ",
	"DA",
	"DB",
	"DC",
	"DD",
	"DE",
	"DF",
	"DG",
	"DH",
	"DI",
	"DJ",
	"DK",
	"DL",
	"DM",
	"DN",
	"DO",
	"DP",
	"DQ",
	"DR",
	"DS",
	"DT",
	"DU",
	"DV",
	"DW",
	"DX",
	"DY",
	"DZ",
	"EA",
	"EB",
	"EC",
	"ED",
	"EE",
	"EF",
	"EG",
	"EH",
	"EI",
	"EJ",
	"EK",
	"EL",
	"EM",
	"EN",
	"EO",
	"EP",
	"EQ",
	"ER",
	"ES",
	"ET",
	"EU",
	"EV",
	"EW",
	"EX",
	"EY",
	"EZ",
	"FA",
	"FB",
	"FC",
	"FD"
];
const CoachArr = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"FE",
	"FF",
	"FG",
	"FH",
	"FI",
	"FJ",
	"FK",
	"FL",
	"FM",
	"FN",
	"FO",
	"FP",
	"FQ"
];
const ManagerArr = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"I",
	"FR",
	"FS",
	"FT",
	"FU",
	"FV",
	"FW",
	"FX",
	"FY",
	"FZ",
	"GR",
	"GS",
	"GT",
	"GU",
	"GV",
	"GW",
	"GX",
	"GY",
	"GZ",
	"GA",
	"GB",
	"GC",
	"GD",
	"GE",
	"GF",
	"GG",
	"GH",
	"GI",
	"GJ",
	"GK",
	"GL",
	"GM",
	"GN",
	"GO"
];

// a variable that holds the total score of a spreadsheet.
let scoreTotal = 0;

async function mainApp() {
	console.log("Main App Function Invoked");
	console.log(fileInputPath);

	const DateNow = new Date();
	// check if input file is there.
	// The following method is synchronous. NO code will run until it's been verified that the input file exists.

	// test
	console.log(path.dirname(fileInputPath));

	const InputPath = fileInputPath;
	const OutputDirPath = `${path.dirname(fileInputPath)}/output`;

	console.log("Checking for input file...");
	try {
		if (FS.existsSync(InputPath)) {
			// log.success("File Exists!");

			// Check for existence of output folder
			console.log("Checking for output directory...");
			try {
				if (FS.existsSync(OutputDirPath)) {
					// log.success("Output Directory Found!");
				}
				else {
					// log.warn("Output Directory not found. Creating now...");
					await // log.load("Creating Output Directory...");
					// create output directory
					await FS.mkdirSync(OutputDirPath);
					// log.success("Output Directory created successfully!");
					// log.info(`New directory located at: ${Path.resolve("./output")}`);
				}
			} catch(err) {
				// log.error("error", err);
			}
			// Load input file
			const InputWB = new ExcelJS.Workbook();
			await InputWB.xlsx.readFile(InputPath);
			// Read inputfile's main worksheet.
			const InputWS = InputWB.getWorksheet("Form responses 1");
			// We want to read every cell but the first on the 2nd column (B) to get the number and names of all the
			// restaurants that participated in the OCL, and create a file for each store.
			// Get the number of cells in col B and subtract 1 to account for the 1st cell, which we ignore.
			const WSRowCount = InputWS.actualRowCount - 1;
			// log.info(`Document Row Count: ${WSRowCount + 1}`);
			// Check each cell but the first one to see if it's value is in the Stores array.
			await InputWS.getColumn("B").eachCell((cell, rn) => {
				// cell value, row number
				// // log.log(`${cell}, ${rn}`);
				// check Stores array for cell's value
				if (rn == 1) {
					return;
				}
				else if (Stores.includes(cell.value) === true) { // if cell's value exists in aStores array, return.
					return;
				}
				else if (Stores.includes(cell.value) === false) { // else, add cell's value in Stores array.
					Stores.push(cell.value);
				}

			});
			// log Stores array
			// log.debug(Stores);
			
			// create workbooks (loop once for each store)
			let i = 0;
			while (i <= (Stores.length - 1)) {
				// First, get current Date.
				// create Constant with new workbook's name
				const FileName = `OCL ${Stores[i]} - ${("0" + (DateNow.getMonth() + 1)).slice(-2)}.${DateNow.getFullYear()}`;
				// log.info(FileName);

				// Create a new Workbook to initialize before saving as file
				const NewWorkbook = new ExcelJS.Workbook();
				// set WB author as Nikos Motos JS to know who created it
				NewWorkbook.creator = "Nikos Motos";
				NewWorkbook.lastModifiedBy = "OCLJS";
				
				
				
				// loop once for each job position to create the worksheets
				// This piece of code loops once for each store. Inside each store loop, it loops once for each job
				// Position. For each job position, it creates a new worksheet inside that stores workbook.
				let j = 0;
				while (j <= (Positions.length - 1)) {
					const NewPosWS = NewWorkbook.addWorksheet(`${Positions[j]}`, {views:[{state: "frozen", xSplit: 0, ySplit:1}]});
					// log.info(`${Positions[j]}`);
					switch (Positions[j]) {
					case "Hostess":
						// log.log("Hostess");
						await FileInit(i, j, NewPosWS, InputWS, NewWorkbook, FileName, HostessArr, "Hostess", Stores[i]);
						NewPosWS.autoFilter = {from: "A1", to: "P1"};
						break;
					case "FOH":
						// log.log("FOH");
						await FileInit(i, j, NewPosWS, InputWS, NewWorkbook, FileName, FOHArr, "FOH", Stores[i]);
						NewPosWS.autoFilter = {from: "A1", to: "AQ1"};
						break;
					case "MOH":
						// log.log("MOH");
						await FileInit(i, j, NewPosWS, InputWS, NewWorkbook, FileName, MOHArr, "MOH", Stores[i]);
						NewPosWS.autoFilter = {from: "A1", to: "AD1"};
						break;
					case "BOH":
						// log.log("BOH");
						await FileInit(i, j, NewPosWS, InputWS, NewWorkbook, FileName, BOHArr, "BOH", Stores[i]);
						NewPosWS.autoFilter = {from: "A1", to: "CG1"};
						NewPosWS.addConditionalFormatting({
							ref: "B2:AAA999",
							rules: [
								{
									type: "colorScale",
									cfvo: [
										{type: "num", value: 1},
										{type: "num", value: 3},
										{type: "num", value: 5},
									],
									color: [
										{argb: "FFF8696B"},
										{argb: "FF92D050"},
										{argb: "FF00B0F0"}
									]
								}
							]
						});
						// NewPosWS.addConditionalFormatting({
						// 	ref: "B2:AAA999",
						// 	rules: [
						// 		{
						// 			type: "colorScale",
						// 			cfvo: [
						// 				{type: "formula", value: "'Οχι"},
						// 				{type: "num", value: 'Ναι'}
						// 			],
						// 			color: [
						// 				{argb: "FFF8696B"},
						// 				{argb: "FF92D050"}
						// 			]
						// 		}
						// 	]
						// });
						
						break;
					case "Coach":
						// log.log("Coach");
						await FileInit(i, j, NewPosWS, InputWS, NewWorkbook, FileName, CoachArr, "Coach", Stores[i]);
						NewPosWS.autoFilter = {from: "A1", to: "R1"};
						break;
					case "Manager":
						// log.log("Manager");
						await FileInit(i, j, NewPosWS, InputWS, NewWorkbook, FileName, ManagerArr, "Manager", Stores[i]);
						NewPosWS.autoFilter = {from: "A1", to: "AM1"};
						break;
					}
					console.log(scoreTotal);
					scoreTotal = 0;
					j++;
				}
				
				// First, create a wiorksheet in each file for charts.
				const ChartsWS = NewWorkbook.addWorksheet("Charts");

				// write new workbook
				await NewWorkbook.xlsx.writeFile(`${OutputDirPath}/${FileName}.xlsx`)
					.then(c => {
						console.log(c);
					})
					.catch(err => {
						console.log(err);
					});

				i++;
			}
			const ResultsFileName = `OCL Results - ${("0" + (DateNow.getMonth() + 1)).slice(-2)}.${DateNow.getFullYear()}`;
			const ResultsWB = new ExcelJS.Workbook();
			ResultsWB.creator = "Nikos Motos";
			ResultsWB.lastModifiedBy = "OCLJS";
			const ResultsChartsWS = ResultsWB.addWorksheet("Charts");
			const ResultsAnalysisWS = ResultsWB.addWorksheet("Analysis");
			await ResultsWB.xlsx.writeFile(`${OutputDirPath}/${ResultsFileName}.xlsx`)
				.then(c => {
					console.log(c);
				})
				.catch(err => {
					console.log(err);
				});



		}
		else {
			// log.error("", " Input file doesn't exist!");
		}
	} catch(err) {
		// log.error("error", err);
	}
}

async function FileInit(i, j, WS, InputWS, WB, FileName, PosCellArr, pos, store){ 

	// array that will hold row's cells
	let RowCells = [];

	// write those cell values to the new worksheet.
	let r = 1; // row
	while (r <= InputWS.actualRowCount) {

		let c = 1; // column
		// if (r == 1) {
		// 	while (c <= initCells.length) {
		// 		RowCells.push(InputWS.getRow(r).getCell(initCells[c - 1]).value);
		// 		c++;
		// 	}
		// }
		if (r == 1 || (InputWS.getRow(r).getCell("E").value == pos && InputWS.getRow(r).getCell("B").value == store)) {
			while (c <= PosCellArr.length) {

				await RowCells.push(InputWS.getRow(r).getCell(PosCellArr[c - 1]).value);
				c++;
			}
			if (r !== 1) {
				// score row's values
				await scoring(WS, RowCells, r, pos);
				console.log("Test");
			}
			else {
				// if its first row, change col B to "Score"
				const index = RowCells.indexOf("Καταστήματα");

				if (index !== -1) {
					RowCells[index] = "Score";
				}
				// in scoring, input final score in column B.
			}

			WS.addRow(RowCells);
			RowCells = [];
		}
		// log.debug(`r: ${r}`);
		r++;
	}

}

async function scoring(WS, RowCells, r, position) {
	// log.debug(`Scoring: row ${r}`);

	if (r !== 1) {
		// log.info(RowCells);
		// TODO: read each cell's value depending on position and options (eg: Hostess, read cells rF - rP)
		// TODO: calculate sum of all cell values. Yes = 5, No = 1
		// ! Multiple choice = TBD
		let i;
		let pointSum = 0;
		let total = 0;
		if (position == "Hostess") {
			i = 5;
		}
		else if (position == "FOH") {
			i = 6;
		}
		else if (position == "MOH") {
			i = 6;
		}
		else if (position == "BOH") {
			i = 6;
		}
		else if (position == "Coach") {
			i = 5;
		}
		else if (position == "Manager") {
			i = 6;
		}

		while (i <= RowCells.length) {
			// check every cell (row: r, col: HostessCheckList[i]). if value is yes/no, count accordingly,
			if (RowCells[i] <= 5 && RowCells[i] >= 1) {
				// log.debug(RowCells[i]);
				// log.debug("number 1-5");
				pointSum = pointSum + RowCells[i];
				total ++;
			}
			else if (typeof RowCells[i] == "string") {
				// log.debug(RowCells[i]);
				// log.debug("string");
				if (RowCells[i] == "Ναι") {
					pointSum = pointSum + 5;
					total ++;
				}
				else if (RowCells[i] == "Όχι") {
					pointSum = pointSum + 1;
					total ++;
				}
				else {
					// log.debug(typeof RowCells[i]);
					// log.info(RowCells[i]);
					// console.log(RowCells[i]);
					const coachMClength = RowCells[i].split(",");
					// console.log(coachMClength);
					let coachQScore = coachMClength.length * 0.8333;
					// log.warn(coachQScore);

					pointSum = pointSum + coachQScore;
					total ++;
				}
			}
			else {
				// log.debug(RowCells[i]);
				// log.debug("else undefined");
			}

			// otherwise add to sum and divide by total of cells.
			// log.info(RowCells[i]);
			i++;
		}
		pointSum = pointSum / total;
		console.log(pointSum);
		RowCells[1] = pointSum;
		scoreTotal = scoreTotal + pointSum;
	}

}