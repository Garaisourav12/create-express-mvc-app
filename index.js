#!/usr/bin/env node

const fs = require("fs").promises;
const { existsSync } = require("fs");
const execa = require("execa");
const path = require("path");
const cls = require("cli-color"); // Use cls for color formatting

(async () => {
	const inquirer = (await import("inquirer")).default;

	inquirer
		.prompt([
			{
				type: "input",
				name: "projectName",
				message: "Enter project name:",
				default: "", // Default to current directory
			},
		])
		.then(async (answers) => {
			let projectName = answers.projectName;
			let projectDir = projectName;

			// If project name is empty
			if (!projectName) {
				throw new Error("Project name is required!");
			}
			// If project name is ".", use current directory name
			if (projectName === ".") {
				projectName = path.basename(process.cwd()); // Use current directory name
				projectDir = "."; // Set to current directory
			}

			// If project name is not provided, throw an error
			if (!projectName) {
				throw new Error("Project name is required!");
			}

			// Create the project directory if it doesn't exist
			if (projectDir !== "." && !existsSync(projectDir)) {
				await fs.mkdir(projectDir);
			}

			const sourceDir = path.join(__dirname, "create-express-app");

			try {
				// Start the process
				console.log(cls.green(`Creating project...`));

				// Copy files
				console.log(cls.green(`Copying files...`));
				await copyDirectory(sourceDir, projectDir);
				console.log(cls.green(`All files copied successfully...!`));

				// Modify package.json and package-lock.json
				await updatePackageFiles(projectDir, projectName);
				// Update .gitignore
				await updateGitIgnore(projectDir);
				// Install dependencies
				await installDependencies(projectDir);
				// Setup git
				await setupGit(projectDir);
				// Log success message
				printInstructions(projectDir);
			} catch (err) {
				console.error(cls.red(err.message));
				process.exit(1);
			}
		})
		.catch((err) => {
			console.error(cls.red(err.message));
		});
})();

// Function to copy directory recursively
async function copyDirectory(source, destination) {
	const entries = await fs.readdir(source, { withFileTypes: true });

	for (const entry of entries) {
		const srcPath = path.join(source, entry.name);
		const destPath = path.join(destination, entry.name);

		if (entry.isDirectory()) {
			await fs.mkdir(destPath, { recursive: true });
			await copyDirectory(srcPath, destPath);
		} else {
			await fs.copyFile(srcPath, destPath);
		}
	}
}

// Function to update package files
async function updatePackageFiles(projectDir, projectName) {
	try {
		const packageJsonPath = path.join(projectDir, "package.json");
		const packageLockJsonPath = path.join(projectDir, "package-lock.json");

		// Check if the files exist before reading
		if (existsSync(packageJsonPath)) {
			const templatePackageJson = JSON.parse(
				await fs.readFile(packageJsonPath, "utf8")
			);
			templatePackageJson.name = projectName;

			await fs.writeFile(
				packageJsonPath,
				JSON.stringify(templatePackageJson, null, 2)
			);
		}

		if (existsSync(packageLockJsonPath)) {
			const templatePackageLockJson = JSON.parse(
				await fs.readFile(packageLockJsonPath, "utf8")
			);
			templatePackageLockJson.name = projectName;
			templatePackageLockJson.packages[""].name = projectName;

			await fs.writeFile(
				packageLockJsonPath,
				JSON.stringify(templatePackageLockJson, null, 2)
			);
		}
	} catch (err) {
		console.error(cls.red(err.message));
	}
}

// Update .gitignore
async function updateGitIgnore(projectDir) {
	const gitIgnorePath = path.join(projectDir, ".gitignore");

	try {
		// File must exist so dont need to check if it exists just append .env in next line
		const gitIgnoreContent = `# Dependencies\nnode_modules\n\n# Environment variables\n.env`;
		await fs.appendFile(gitIgnorePath, gitIgnoreContent);
	} catch (err) {
		console.error(cls.red(err.message));
	}
}

/*
 * First go to project directory
 * npm install
 * Wait for Installation to complete
 * Log Dependencies installed
 * git init
 * Wait for git init to complete
 * git add .
 * Wait for git add to complete
 * git commit -m "Express app template"
 * Wait for git commit to complete
 * Log git setup complete
 */
async function installDependencies(projectDir) {
	try {
		console.log(cls.green(`Installing dependencies...`));
		await execa("npm", ["install"], { cwd: projectDir });
		console.log(cls.green(`Dependencies installlation complete...!`));
	} catch (err) {
		console.error(cls.red(err.message));
	}
}
async function setupGit(projectDir) {
	try {
		console.log(cls.green(`Setting up git...`));
		await execa("git", ["init"], { cwd: projectDir });
		await execa("git", ["add", "."], { cwd: projectDir });
		await execa("git", ["commit", "-m", "Express app template"], {
			cwd: projectDir,
		});
		console.log(cls.green(`Git setup complete...!`));
	} catch (err) {
		console.error(cls.red(err.message));
	}
}

// Instructions
function printInstructions(projectDir) {
	console.log(cls.green(`\nProject created successfully...!`));
	// Instructions
	console.log(cls.green(`\n\nTo run your application:`));
	if (projectDir === ".") {
		console.log(
			cls.green(`
			cd ${projectName}
		`)
		);
	}
	console.log(
		cls.green(`
		npm start - for production
		npm run dev - for development
	`)
	);
}
