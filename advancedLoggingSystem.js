// import node modules.
const path = require("path");
// const fs = require("fs");
const process = require("process");
const readline = require("readline");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
const std = process.stdout;
const wait = require("node:timers/promises").setTimeout;

// Declare CMD formatting constants
const styles = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	dim: "\x1b[2m",
	underscore: "\x1b[4m",
	blink: "\x1b[5m",
	reverse: "\x1b[7m",
	hidden: "\x1b[8m"
};
const foreground = {
	black: "\x1b[30m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
	white: "\x1b[37m"
};
const background = {
	black: "\x1b[40m",
	red: "\x1b[41m",
	green: "\x1b[42m",
	yellow: "\x1b[43m",
	blue: "\x1b[44m",
	magenta: "\x1b[45m",
	cyan: "\x1b[46m",
	white: "\x1b[47m"
};





// In short, the code below creates an artificialerror, in order to capture it's stack, and from that extract
// the line number contained in that stack.

// takes the __stack property of the 'global' module

Object.defineProperty(global, "__stack", {
	// get() serves as a getter for th eproperty
	get() {
		// orig: temp const to save Error.prepareStackTrace initial value
		const orig = Error.prepareStackTrace;

		// if there IS an error already, return it's stack.
		Error.prepareStackTrace = function(_, stack) {
			return stack;
		};
		
		// else, create a new error.
		const err = new Error;

		// capture it's stack
		Error.captureStackTrace(err, arguements.callee);

		// save that stack in a constant,
		const stack = err.stack;

		// change the Error.prepareStackTrace value back to it's original.
		Error.prepareStackTrace = orig;

		// return artificial error's stack for further manipulation.
		return stack;

	},
});

// Utility Functions (UF's):
// Functions used within this file only, in order to make custom logging work.
// UF's will NOT be exported as they are NOT meant to be invoked from outside this file.

// UF: Init
// This UF initializes a config file for the ALS.
function init() {

}

// UF: Timestamp
// This UF adds a Timestamp to the output.
function timestamp(output) {
	// Create a new Date object, and extract time and date info from it.
	const date = new Date;
	const [day, month] = date.toLocaleDateString("el-GR").split("/");
	const [hour, minute, second] = date.toLocaleTimeString("el-GR").split(/:| /);
	const millisecond = date.getMilliseconds();
	
	// Add Timestamp to output
	output = `${output}[${day}/${month} & ${hour}:${minute}:${second}.${millisecond}] `;

	return output;
} 

// UF: Filename, Line & Column
// This UF adds the name of the file where the log function was invoked in, along with the line and column where the log is located.
function filename(output) {
	// Get caller's filename

	// Prepare a stack trace
	const prepareStackTraceOrg = Error.prepareStackTrace;
	const err = new Error();

	Error.prepareStackTrace = (_, stack) => stack;

	const stack = err.stack;

	Error.prepareStackTrace = prepareStackTraceOrg;

	// change stack[i] i to go up or down in the call stack (i.e. for callbacks)
	output = `${output}-(${path.basename(stack[2].getFileName())} | ${stack[2].getLineNumber()}:${stack[2].getColumnNumber()})-> `;

	return output;
}


// Exported Functions (EF's):
// Functions used for custom logging.
// EF's WILL be exported at the bottom of this file,
// since they are meant to be invoked from files outside of this one..

// NOTE: Every EF will include a usage guide at the very beginning, for future reference.

// EF: Load
// This EF acts as a loading spinner with a message output along with it.
// Usage: .load("Message to be displayed");
async function load(output) {

	// The following code first finds the console cursor's location.
	// Then, it removes the cursor and starts the spin animation on the previously calculated cursor location,
	// while printing the output next to it for a 'loading' log effect.

	// Step 1: Get cursor's absolute position:
	// Absolute refering to the cursor's porition absolutely on the console/screen.
	// for relative position (in relation to input prompt) use rl.getCursorPos();
	
	const getCursorPos = () => new Promise((resolve) => {
		const termcodes = { cursorGetPosition: "\u001b[6n" };

		// Set the character encoding for the data in the readstream.
		process.stdin.setEncoding("utf8");

		const readfx = function () {
			// .read() gets data out of the internal buffer and returns it.
			const buf = process.stdin.read();
			
			// Parse buffer data from before into string (expected output)
			const str = JSON.stringify(buf); // ("\u001b[9;1R")
			
			// regex explanation:
			// /\[(.*)/g
			// \[ matches the character [
			// . matches any character that's not a line terminator.
			// * matches the previous token between 0 and infinite times, giving back as needed (greedy)
			// g modifier: global. all matches.
			const regex = /\[(.*)/g;
			
			// regex.exec(str)[0] = [11;1R"
			// .replace(/\[|R"/g, "") = 11;1
			// .split(";") = [ '11', '1' ]
			const xy = regex.exec(str)[0].replace(/\[|R"/g, "").split(";");
			
			// Save position in object - matching the way getCursorPos(); returns the cursor's RELATIVE position.
			const pos = { rows: xy[0], cols: xy[1] };
			
			// Resolve pos value to the promise.
			resolve(pos);
		};

		process.stdin.once("readable", readfx);
		process.stdout.write(termcodes.cursorGetPosition);
	});

	// Run above code asynchronously (wait to get the cursor's position - code halts till promise resolved).
	const pos = await getCursorPos();

	// Seperate rows and columns into their own constants to use later (to reset cursor position).
	const col = parseInt(pos.cols);
	const row = parseInt(pos.rows);

	// Step 2: Create Spinners:

	// Remove the cursor to be able to see the effect.
	process.stdout.write("\x1B[?25l");

	// Array of line types that will make up the spin effect.
	const spinners = [
		"⠋",
		"⠙",
		"⠹",
		"⠸",
		"⠼",
		"⠴",
		"⠦",
		"⠧",
		"⠇",
		"⠏"
	];

	// Current index of the spinners array
	let index = 0;

	// Loop between characters to create spinning effect.
	const interval = setInterval(() => {
		// Select a spinner style
		let line = spinners[index];

		// If line is undefined, set the index to position 0.
		if (line == undefined) {
			index = 0;
			line = spinners[index];
		}

		// Writes the line type to terminal
		// color codes explained: bright + yellow foreground (spinner) reset + foreground yellow (output) reset
		std.write(`${styles.bright}${foreground.yellow}${line}${styles.reset} ${foreground.yellow}${output}${styles.reset}`);

		// Set the curson to (x, y) because that's the cell position we are operating in.
		// We're using col - 1, otherwise it will output the first char in the right place and then continue
		// animating in the next col.
		readline.cursorTo(std, col - 1, row);

		// Adjust the index
		index = index >= spinners.length ? 0 : index + 1;

		// the interval determines the speed in which the spinner will be animated.
	}, 80);

	// wait for (time)
	await wait(700);

	// Change from spinner to success
	readline.cursorTo(std, col - 1, row);
	// color codes: bright + foreground green (✓ output) reset
	std.write(`${styles.bright}\x1b[32m\u2713 ${output}${styles.reset}\n`);
	clearInterval(interval);

	// Close the process (free console)
	//process.exit();
	
	

}

// EF: Log
// This EF acts as a console.log(); replacement.
// It's supposed to be used in development only, not on any production code.
// For that reason, no filenames or timestamps are added,just some color to make the log easier to locate.
// Usage: .log("Message to be logged");
function log(output) {
	// bright white underscore ${output} reset \n
	// always resetting styling so it doesnt "bleed" into the next log.
	// always adding a new line in the end of each log so next log doesnt appear on the same line.
	std.write(`${styles.bright}${foreground.white}${styles.underscore}${output}${styles.reset}\n`);
	// process.exit();
}

// EF: Info
// This EF prints an info-level log.
// It's supposed to be used in production code, so styling, timestamps and filenames are added.
// Usage: .info("Message to be displayed");
function info(msg) {
	// init styling for timestamp, filename
	let output = `${foreground.cyan}`; // foreground cyan

	// add timestamp, filename.
	output = timestamp(output);
	output = filename(output);

	// reset styling for level.
	// reset bright foreground yellow (level) reset foreground yellow (msg) reset \n
	output += `${styles.reset}${styles.bright}${foreground.yellow}INFO:${styles.reset} ${foreground.yellow}${msg}${styles.reset}\n`;

	// print output using stdout.
	std.write(output);

	// exit process.
	// process.exit();

}

// EF: Success
// This EF prints a success-level log.
// It's supposed to be used in production code, so styling, timestamps and filenames are added.
// Usage: .success("Message to be displayed");
function success(msg) {
	// init styling for timestamp, filename
	let output = `${foreground.cyan}`; // foreground cyan

	// add timestamp, filename.
	output = timestamp(output);
	output = filename(output);

	// reset styling for level.
	// reset bright foreground green (level) reset foreground green (msg) reset \n
	output += `${styles.reset}${styles.bright}${foreground.green}SUCCESS:${styles.reset}${foreground.green} ${msg}${styles.reset}\n`;

	// print output using stdout.
	std.write(output);

	// exit process.
	// process.exit();

}

// EF: Debug
// This EF prints a debug-level log.
// It's supposed to be used in production code, so styling, timestamps and filenames are added.
// Usage: .debug("Message to be displayed");
function debug(msg) {
	// init styling for timestamp, filename
	let output = `${foreground.cyan}`; // foreground cyan

	// add timestamp, filename.
	output = timestamp(output);
	output = filename(output);

	// reset styling for level.
	// reset bright foreground magenta (level) reset foreground magenta (msg) reset \n
	output += `${styles.reset}${styles.bright}${foreground.magenta}DEBUG:${styles.reset}${foreground.magenta} ${msg}${styles.reset}\n`;

	// print output using stdout.
	std.write(output);

	// exit process.
	// process.exit();

}

// EF: Warn
// This EF prints a warn-level log.
// It's supposed to be used in production code, so styling, timestamps and filenames are added.
// Usage: .warn("Message to be displayed");
function warn(msg) {
	// init styling for timestamp, filename
	let output = `${foreground.cyan}`; // foreground cyan

	// add timestamp, filename.
	output = timestamp(output);
	output = filename(output);

	// reset styling for level.
	// reset bright foreground red (level) reset foreground red (msg) reset \n
	output += `${styles.reset}${styles.bright}${foreground.red}WARN:${styles.reset}${foreground.red} ${msg}${styles.reset}\n`;

	// print output using stdout.
	std.write(output);

	// exit process.
	// process.exit();

}

// EF: Error
// This EF prints a error-level log.
// It's supposed to be used in production code, so styling, timestamps and filenames are added.
// Usage: .error("Message to be displayed");
function error(msg, error) {
	// init styling for timestamp, filename
	let output = `${foreground.cyan}`; // foreground cyan

	// add timestamp, filename.
	output = timestamp(output);
	output = filename(output);

	// reset styling for level.
	// reset bright foreground red invert (level) reset foreground red (msg) => underline (error) reset \n
	output += `${styles.reset}${styles.bright}${foreground.red}${styles.reverse}ERROR:${styles.reset}${foreground.red} ${msg} => ${styles.underscore}${error}${styles.reset}\n`;

	// print output using stdout.
	std.write(output);
	std.write(`${styles.bright}${foreground.red} ! : `);
	console.error(error);
	std.write(`${styles.reset}`);

	// exit process.
	// process.exit();

}


// Export EF's
module.exports = {
	load,
	log,
	info,
	success,
	debug,
	warn,
	error
};

/* 	CONSOLE.LOG COLORS REFERENCE!

			Reset = "\x1b[0m"
			Bright = "\x1b[1m"
			Dim = "\x1b[2m"
			Underscore = "\x1b[4m"
			Blink = "\x1b[5m"
			Reverse = "\x1b[7m"
			Hidden = "\x1b[8m"

			FgBlack = "\x1b[30m"
			FgRed = "\x1b[31m"
			FgGreen = "\x1b[32m"
			FgYellow = "\x1b[33m"
			FgBlue = "\x1b[34m"
			FgMagenta = "\x1b[35m"
			FgCyan = "\x1b[36m"
			FgWhite = "\x1b[37m"

			BgBlack = "\x1b[40m"
			BgRed = "\x1b[41m"
			BgGreen = "\x1b[42m"
			BgYellow = "\x1b[43m"
			BgBlue = "\x1b[44m"
			BgMagenta = "\x1b[45m"
			BgCyan = "\x1b[46m"
			BgWhite = "\x1b[47m"
*/